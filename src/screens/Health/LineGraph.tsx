import React, { useContext } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import { ThemeContext } from '../../contexts/ThemeContext';

interface LineGraphProps {
  title: string;
  value: number;
  description: string;
  dataLabels: string;
  dataValues: { data: number[] }[];
}

function LineGraph(props: LineGraphProps) {
  const { title, value, description, dataLabels, dataValues } = props;
  const { theme } = useContext(ThemeContext);

  const checkValue = (value: number) => {
    if (value) {
      if (value > 300) {
        return 'red';
      } else {
        return 'green';
      }
    }
    return 'red';
  };

  const convertTimestampToTimeString = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2); // Add leading zero if needed
    return `${hours}:${minutes}`;
  };
  const colors = ['#f1c40f', '#2ecc71', '#3498db', '#e74c3c'];
  return (
    <View style={{ marginTop: 2 }}>
      <Text
        style={{
          // @ts-ignore
          fontSize: 24,
          fontWeight: 'bold',
          // @ts-ignore
          color: '#333',
          marginBottom: 10,
          ...theme.typography.h3,
        }}>
        {title}
      </Text>

      {/* <Text style={{ marginTo p: 8 }}>{description}</Text> */}

      <LineChart
        data={{
          labels: [dataLabels],
          datasets: dataValues.map((dataset, index) => ({
            data: dataset.data,
            color: (opacity = 1) => `${colors[index]}`,
          })),
        }}
        width={Dimensions.get('screen').width - 40} // from react-native
        withShadow={false}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#F0E7DA',
          backgroundGradientTo: '#EADACF',
          decimalPlaces: 0, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(123, 87, 73, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#D19F7E',
          },
          propsForVerticalLabels: {
            dx: 65,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        {colors.map((color, index) => (
          <View
            key={index}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 15,
                height: 15,
                backgroundColor: color,
                marginRight: 5,
              }}
            />
            <Text style={{ color: '#000', fontSize: 14 }}>{`XZ ${
              index + 1
            }`}</Text>
          </View>
        ))}
      </View>
      {/* {value ? (
        <Text
          style={{
            fontFamily: theme.font.RobotoBold,
            fontSize: 18,
            paddingVertical: 12,
            color: checkValue(value ? value : 0),
          }}>
          Average {title}: {value}
        </Text>
      ) : (
        ''
      )} */}
    </View>
  );
}

export default LineGraph;
