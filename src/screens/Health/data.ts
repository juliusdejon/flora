export interface ChartData {
  timestamp: number;
  value: number;
}
export const mockData = {
  id: 'BLH123',
  mode: 0,
  data: [
    {
      flags: 0,
      timestamp: '2021-03-01T00:00:00.000Z',
      timestamp_posix: 1614556800,
      temperature: 36.5,
      moisture: 0,
      gsr: 0,
      emg: 0,
      custom: 'custom data',
    },
    {
      flags: 36,
      timestamp: '2024-03-04T04:10:02.500Z',
      timestamp_posix: 1678006202,
      temperature: 36.5,
      moisture: 123,
      gsr: 1353,
      emg: 523,
      custom: 'custom data',
    },
    {
      flags: 0,
      timestamp: '2024-03-04T14:56:52.190Z',
      temperature: 36.5,
      moisture: 123,
      gsr: 1353,
      timestamp_posix: 1678042612,
      custom: 'custom data',
    },
  ],
  v_batt: 3.7,
  t_mcu: 25.2,
  uptime: 3600,
  awake_ms: 500,
  sleeptime: 2000,
  rssi: -80,
  fw_version: 'v1.2',
};

export const mockTemperatureData: {
  [key: string]: { value: number; day: string };
} = {
  '2024-03-01': { value: 22, day: 'Mon' },
  '2024-03-02': { value: 25, day: 'Tue' },
  '2024-03-03': { value: 18, day: 'Wed' },
  '2024-03-04': { value: 20, day: 'Thu' },
  '2024-03-05': { value: 23, day: 'Fri' },
  '2024-03-06': { value: 26, day: 'Sat' },
  '2024-03-07': { value: 28, day: 'Sun' },
  '2024-03-08': { value: 30, day: 'Mon' },
  '2024-03-09': { value: 32, day: 'Tue' },
  '2024-03-10': { value: 29, day: 'Wed' },
  '2024-03-11': { value: 31, day: 'Thu' },
  '2024-03-12': { value: 34, day: 'Fri' },
  '2024-03-13': { value: 36, day: 'Sat' },
  '2024-03-14': { value: 35, day: 'Sun' },
  '2024-03-15': { value: 38, day: 'Mon' },
  '2024-03-16': { value: 37, day: 'Tue' },
  '2024-03-17': { value: 39, day: 'Wed' },
  '2024-03-18': { value: 40, day: 'Thu' },
  '2024-03-19': { value: 38, day: 'Fri' },
};
