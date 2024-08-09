/* eslint-disable no-bitwise */
import { useMemo, useState, useRef, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';
import { useAuth } from '../contexts/AuthContext';

import * as ExpoDevice from 'expo-device';
import Config from '../config';
import { addDataPerDay } from '../firebaseHelpers';

import base64 from 'react-native-base64';
import { DateTime } from 'luxon';

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  errorMessage: string;
}

interface BLEData {
  id: string;
  mode: number;
  data: Data[];
  v_batt: number;
  t_mcu: number;
  uptime: number;
  awake_ms: number;
  sleeptime: number;
  rssi: number;
  fw_version: number;
  eof: string;
}

interface ElectrodeData {
  id: number;
  data: number;
  type: string;
  coords: number[];
}

interface Data {
  flags: number;
  timestamp: string;
  timePosix: number;
  timestamp_posix: string;
  temperature: number;
  moisture: number;
  gsr: number;
  emg: number;
  electrode_data: ElectrodeData[];
}

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { authState } = useAuth();
  const userId = authState?.user?.id;
  const streamedData = useRef('');

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      // @ts-ignore
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      },
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      // @ts-ignore
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      },
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      // @ts-ignore
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      },
    );

    return (
      bluetoothScanPermission === 'granted' &&
      bluetoothConnectPermission === 'granted' &&
      fineLocationPermission === 'granted'
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          // @ts-ignore
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name?.includes('BLH_Wig_Sensor')) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id, {
        requestMTU: 508,
      });
      setConnectedDevice(deviceConnection);

      startStreamingData(deviceConnection);
    } catch (e) {
      console.log(e);
      console.log('FAILED TO CONNECT', e);
      setErrorMessage(`Failed to connect, ${e}`);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      try {
        bleManager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
      } catch (error) {}
    }
  };

  const onBleUpdate = (
    error: BleError | null,
    characteristic: Characteristic | null,
  ) => {
    if (error) {
      console.log(`error-${error}`);
      setErrorMessage(`Something went wrong: ${error}`);
      return -1;
    } else if (!characteristic?.value) {
      setErrorMessage('No Data was received from device');
      return -1;
    }

    const value = base64.decode(characteristic.value);

    streamedData.current += value;

    if (streamedData.current.includes('"eof":""}')) {
      const completeBleDataJSON = streamedData.current || '';
      // console.log(completeBleDataJSON);

      const parsedCompleteBleData: BLEData = JSON.parse(
        completeBleDataJSON.replace(/\\n/g, ''),
      );
      parsedCompleteBleData.data.forEach(data => {
        const timestamp = parseInt(data.timestamp_posix);
        data.electrode_data.forEach(electrodeData => {
          switch (electrodeData.type) {
            case 'eeg_freq':
              // eeg frequency
              addDataPerDay({
                userId: userId,
                timestamp: timestamp,
                type: 'eegFrequency',
                value: electrodeData.data,
              });
              break;
            case 'd_impd':
              // skin impedance
              addDataPerDay({
                userId: userId,
                timestamp,
                type: 'skinImpedance',
                value: electrodeData.data,
              });
              break;
            case 'eeg_live':
              break;
            default:
              break;
          }
        });
        // temperature
        if (data.temperature) {
          addDataPerDay({
            userId: userId,
            timestamp,
            type: 'temperature',
            value: data.temperature,
          });
        }
      });
      streamedData.current = '';
    }
    setErrorMessage('');
    return;
  };

  const startStreamingData = async (device: Device) => {
    try {
      await device.discoverAllServicesAndCharacteristics();
      await device.services();
      if (device) {
        device.monitorCharacteristicForService(
          Config.BLE_SERVICE_UUID,
          Config.BLE_CHARACTERISTIC_TX_UUID,
          onBleUpdate,
        );
      } else {
        console.log('No Device Connected');
        setErrorMessage('No Device Connected');
      }
      if (device) {
        var time = DateTime.utc().toFormat('y-M-d|H:m:s');
        device.writeCharacteristicWithoutResponseForService(
          Config.BLE_SERVICE_UUID,
          Config.BLE_CHARACTERISTIC_RX_UUID,
          base64.encode('TSET:' + time + '\n'),
        );
      } else {
        console.log('Time Sync Failed: No Device Connected');
        setErrorMessage('Time Sync Failed: No Device Connected');
      }
    } catch (error) {
      console.log('Error startStreamingData: ' + error);
      setErrorMessage(`Error startStreamingData: ${error}`);
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    errorMessage,
  };
}

export default useBLE;
