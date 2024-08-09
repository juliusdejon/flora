import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { BarChart as ReactNativeBarChart } from 'react-native-chart-kit';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { getHours, startOfDay, endOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import { BarChartProps } from './types';
import { retrieveData } from '../../../firebaseHelpers';
import { useAuth } from '../../../contexts/AuthContext';
import { format } from 'date-fns';

const DailyBarChart = (props: BarChartProps) => {
  const { title, color, type } = props;
  const { theme } = useContext(ThemeContext);
  const { authState } = useAuth();
  const [averages, setAverages] = useState<number[]>([]);
  const today = format(new Date(), 'MMM dd, yyyy');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (authState?.user) {
      const { id } = authState.user;

      const dataFromDB = await retrieveData({
        userId: id,
        type: type,
        day: '2024-03-28',
      });

      const formattedData =
        dataFromDB?.map(item => ({
          hour: item.data.timestamp, // Assuming timestamp represents hours
          value: item.data.value,
        })) || [];

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const hours: { hour: number; value: number[] }[] = [];

      formattedData.forEach(date => {
        const dateObj = new Date(date.hour * 1000);
        const hour = dateObj.getHours();

        const existingEntryIndex = hours.findIndex(
          entry => entry.hour === hour,
        );

        if (existingEntryIndex !== -1) {
          //@ts-ignore
          hours[existingEntryIndex]?.value.push(date.value);
        } else {
          hours.push({
            hour: hour,
            //@ts-ignore
            value: [date.value],
          });
        }
      });

      hours.sort((a, b) => a.hour - b.hour);

      for (let hour = 0; hour < 24; hour++) {
        const existingHourIndex = hours.findIndex(entry => entry.hour === hour);
        if (existingHourIndex === -1) {
          // Hour does not exist, push a new entry with value 0
          hours.push({ hour: hour, value: [0] });
        }
      }

      const sortedHours = hours.sort((a, b) => a.hour - b.hour);
      setAverages([]);
      sortedHours.forEach(item => {
        // @ts-ignore
        const sum = item.value.flat().reduce((acc, obj) => acc + obj.data, 0);

        const average = sum / item.value.flat().length;
        if (isNaN(average)) {
          setAverages(prevAverages => [...prevAverages, 0]);
        } else {
          setAverages(prevAverages => [
            ...prevAverages,
            Math.floor(Number(average)),
          ]);
        }
      });
    }
  };

  const sum = averages
    .filter(val => val !== 0)
    .reduce((acc, currentVal) => acc + currentVal, 0);

  const totalAvg = sum / averages.length;
  const barChartData = {
    labels: [
      '12 AM',
      '',
      '',
      '',
      '',
      '',
      '6',
      '',
      '',
      '',
      '',
      '',
      '12 PM',
      '',
      '',
      '',
      '',
      '',
      '6',
      '',
      '',
      '',
      '',
      '0',
    ],

    datasets: [
      {
        data: averages,
      },
    ],
  };

  return (
    <View>
      <Text style={[styles.temperatureLabel, theme.typography.h3]}>
        {title}
      </Text>
      <Text style={styles.grayText}>AVERAGE</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingBottom: 5,
        }}>
        <Text style={styles.averageText}>{totalAvg?.toFixed(2)}Hz</Text>
        <Text style={[styles.grayText]}>{today}</Text>
      </View>
      <View style={styles.container}>
        {/* <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}> */}
        <View style={styles.chartContainer}>
          {/* @ts-ignore */}
          <ReactNativeBarChart
            data={barChartData}
            width={350}
            height={240}
            fromZero
            showValuesOnTopOfBars
            showBarTops={false}
            withInnerLines={false}
            // withHorizontalLabels={false}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              height: 800,
              fillShadowGradient: color,
              fillShadowGradientOpacity: 1,
              barRadius: 4,
              color: () => color,
              labelColor: () => '#000000',
              barPercentage: 0.2, // Adjust this value to make the bars thinner or thicker
              propsForLabels: {
                fontSize: 12, // Adjust label font size here
              },
            }}
            style={styles.chart}
          />
        </View>
        {/* </ScrollView> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  chartContainer: {
    width: 350,
    marginRight: 20, // Add some spacing between charts
  },
  temperatureLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Adjust the color as needed
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 2,
    marginBottom: 10, // Add some spacing between the label and the chart
  },
  chart: {
    // marginVertical: 8,
    // paddingRight: 6,
  },
  grayText: {
    color: '#8a8a8a',
  },
  averageText: {
    fontSize: 24, // Adjust the font size as needed
    fontWeight: 'bold',
    color: 'black',
  },
});
export default DailyBarChart;
