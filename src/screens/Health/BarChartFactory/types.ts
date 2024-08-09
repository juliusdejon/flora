export interface BarChartProps {
  title: string;
  color: string;
  viewTypes: string[];
  defaultView: string;
  type: 'eegFrequency' | 'skinImpedance' | 'temperature';
}

export interface ChartData {
  timestamp: number;
  value: number;
}
