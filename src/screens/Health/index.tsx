import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Page from '../../components/Page';

import { ThemeContext } from '../../contexts/ThemeContext';
import BarChart from './BarChartFactory';
import LineGraph from './LineGraph';
import { format } from 'date-fns';

import useBLE from '../../hooks/useBle';
import Button from '../../components/Button';
import DeviceModal from './DeviceModal';
import { utcToZonedTime } from 'date-fns-tz';

function Health({ navigation }: { navigation: any }) {
  const { theme } = useContext(ThemeContext);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [dataLabels, setDataLabels] = useState<string>('');
  const [randomDataSets, setRandomDataSets] = useState<{ data: number[] }[]>(
    [],
  );

  const generateRandomDataSet = () => {
    const dataSet = [];
    for (let i = 0; i < 8; i++) {
      dataSet.push(Math.floor(Math.random() * 2201));
    }
    return { data: dataSet };
  };

  useEffect(() => {
    // Initialize random datasets
    const initialDataSets = [];
    for (let i = 0; i < 4; i++) {
      initialDataSets.push(generateRandomDataSet());
    }
    setRandomDataSets(initialDataSets);

    // Update datasets every second
    const interval = setInterval(() => {
      const updatedDataSets = [];
      for (let i = 0; i < 4; i++) {
        updatedDataSets.push(generateRandomDataSet());
      }
      setRandomDataSets(updatedDataSets);
      setDataLabels(format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // const scanForDevices = async () => {
  //   const isPermissionsEnabled = await requestPermissions();
  //   if (isPermissionsEnabled) {
  //     scanForPeripherals();
  //   }
  // };
  // const hideModal = () => {
  //   setIsModalVisible(false);
  // };
  // const openModal = async () => {
  //   scanForDevices();
  //   setIsModalVisible(true);
  // };
  // const {
  //   requestPermissions,
  //   scanForPeripherals,
  //   allDevices,
  //   connectToDevice,
  //   connectedDevice,
  //   disconnectFromDevice,
  //   errorMessage,
  // } = useBLE();

  return (
    <Page backgroundColor={theme.palette.background.primary}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Text style={theme.typography.h2}>Devices</Text>
        {connectedDevice ? (
          <Text>Sensor device is connected</Text>
        ) : (
          <View>
            <Text>Please connect to a wig sensor</Text>
          </View>
        )}
        {errorMessage ? (
          <Text style={{ color: 'red' }}>{errorMessage}</Text>
        ) : (
          <View />
        )}
        <View style={{ marginVertical: 8 }}>
          <Button
            type="primary"
            // @ts-ignore
            style={{ width: '100%' }}
            onPress={connectedDevice ? disconnectFromDevice : openModal}>
            <Text>{connectedDevice ? 'Disconnect' : 'Connect'}</Text>
          </Button>
        </View>
        <DeviceModal
          closeModal={hideModal}
          visible={isModalVisible}
          connectToPeripheral={connectToDevice}
          devices={allDevices}
        /> */}
        <Text style={theme.typography.h2}>Health & Wellness</Text>
        <View style={{ marginTop: 16 }} />
        <BarChart
          title={'Temperature'}
          type="temperature"
          viewTypes={['W']}
          defaultView="W"
          color={'#FF530A'}
        />
        <View style={{ marginBottom: 16 }} />
        <BarChart
          type="eegFrequency"
          title={'EEG Frequency'}
          viewTypes={['D']}
          defaultView="D"
          color={'#AFE1AF'}
        />
        <View style={{ marginBottom: 16 }} />
        <BarChart
          type="skinImpedance"
          viewTypes={['W']}
          defaultView="W"
          title={'Skin Impedance'}
          color={'#273c75'}
        />
        <View style={{ marginBottom: 16 }} />

        <LineGraph
          title={'Electrical Activity'}
          value={0}
          description="This line chart depicts emg level variations over time."
          dataLabels={dataLabels}
          dataValues={
            randomDataSets.length > 0 ? randomDataSets : [{ data: [] }]
          }
        />
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',

    marginTop: 10,
    paddingHorizontal: 0, // Remove horizontal padding
    marginBottom: 10, // Add margin bottom for spacing
  },
  button: {
    flex: 1,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  selectedButton: {
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 14,
    color: 'gray',
  },
  selectedButtonText: {
    color: 'black',
  },
  firstButton: {
    borderTopLeftRadius: 6, // Rounded corners on the first button
    borderBottomLeftRadius: 6,
  },
  lastButton: {
    borderTopRightRadius: 6, // Rounded corners on the last button
    borderBottomRightRadius: 6,
  },
});

export default Health;
