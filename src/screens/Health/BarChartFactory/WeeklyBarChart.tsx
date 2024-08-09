import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BarChart as ReactNativeBarChart } from 'react-native-chart-kit';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { subDays, format, max } from 'date-fns';
import { useAuth } from '../../../contexts/AuthContext';
import { retrieveAverageData } from '../../../firebaseHelpers';

import { BarChartProps } from './types';

const WeeklyBarChart = (props: BarChartProps) => {
  const { title, color, type } = props;
  const { theme } = useContext(ThemeContext);
  const { authState } = useAuth();
  const [weeklyAvgData, setWeeklyAvgData] = useState<number[]>([]);
  const [dateLabel, setDateLabel] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);
  const currentDate = new Date();

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const currentDateFormat = currentDate.toLocaleDateString('en-CA', options);

  const dates = [currentDateFormat];

  // Subtract one day and add the previous date for the next six days
  for (let i = 1; i <= 6; i++) {
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - i);
    const previousDateFormat = previousDate.toLocaleDateString(
      'en-CA',
      options,
    );
    dates.push(previousDateFormat);
  }

  const fetchData = async () => {
    if (authState?.user) {
      const { id } = authState.user;

      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      const formattedDates = dates.map(dateString => {
        const date = new Date(dateString);
        const dayOfWeek = weekdays[date.getDay()];
        return dayOfWeek;
      });

      //@ts-ignore
      setDateLabel(formattedDates.reverse());

      const weeklyAvg = await retrieveAverageData({
        userId: id,
        type: type,
        dates: dates,
      });
      if (Array.isArray(weeklyAvg)) {
        setWeeklyAvgData(weeklyAvg);
      } else {
        console.error('Weekly average data is not an array:', weeklyAvg);
      }
    }
  };

  const barChartData = {
    labels: dateLabel,

    datasets: [
      {
        data: weeklyAvgData,
      },
    ],
  };

  const average =
    weeklyAvgData.length > 0
      ? Math.floor(
          weeklyAvgData
            .filter(Boolean)
            .reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0,
            ) / weeklyAvgData.filter(Boolean).length,
        )
      : '';

  const firstDate = dates[dates.length - 1] || '';
  const lastDate = dates[0] || '';

  const startDate = firstDate.length ? new Date(firstDate) : new Date();
  const endDate = lastDate.length ? new Date(lastDate) : new Date();

  // // Format the start and end dates
  const formattedStartDate = startDate ? format(startDate, 'MMM dd') : '';
  const formattedEndDate = endDate ? format(endDate, 'dd, yyyy') : '';
  const dateRange = `${formattedStartDate}-${formattedEndDate}`;

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
        <View>
          <Text style={[styles.temperatureLabel, theme.typography.h3]}>
            {title}
          </Text>
          <Text style={styles.grayText}>AVERAGE</Text>
          <Text style={styles.averageText}>
            {type === 'temperature'
              ? `${average ? average : 0}°C`
              : average
              ? average
              : 0}
            {type !== 'temperature' ? 'kHz' : ''}
          </Text>
        </View>
        <View>
          <Text style={[styles.grayText]}>{dateRange}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <View>
          {/* @ts-ignore */}
          <ReactNativeBarChart
            data={barChartData}
            width={350}
            height={240}
            showValuesOnTopOfBars
            showBarTops={false}
            withInnerLines={false}
            {...(type === 'temperature'
              ? {
                  fromNumber: 50,
                  fromZero: true,
                }
              : {
                  fromZero: true,
                })}
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
              barPercentage: 0.8, // Adjust this value to make the bars thinner or thicker
              propsForLabels: {
                fontSize: 12, // Adjust label font size here
              },
            }}
            style={styles.chart}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  temperatureLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Adjust the color as needed
    marginBottom: 10,
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 2,
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
export default WeeklyBarChart;
