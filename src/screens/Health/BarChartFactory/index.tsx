import React, { useState, useEffect, useContext } from 'react';
import { BarChartProps } from './types';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DailyBarChart from './DailyBarChart';
import WeeklyBarChart from './WeeklyBarChart';

const BarChartFactory = (props: BarChartProps) => {
  const [viewType, setViewType] = useState<string>(props.defaultView || 'D');
  const { theme } = useContext(ThemeContext);
  const { viewTypes } = props;

  const handleButtonPress = (timeRange: string) => {
    setViewType(timeRange);
  };

  const showViewMode = viewTypes.length > 1;

  const modeType = (
    <View style={styles.buttonContainer}>
      {viewTypes.map((timeRange, index) => (
        <TouchableOpacity
          key={timeRange}
          style={[
            styles.button,
            viewType === timeRange ? styles.selectedButton : null,
            index === 0 ? styles.firstButton : null,
            index === viewTypes.length - 1 ? styles.lastButton : null,
          ]}
          onPress={() => handleButtonPress(timeRange)}>
          <Text
            style={[
              styles.buttonText,
              viewType === timeRange ? styles.selectedButtonText : null,
            ]}>
            {timeRange}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  switch (viewType) {
    case 'D':
      return (
        <View>
          {/* <Text style={[styles.temperatureLabel, theme.typography.h3]}>
            {props.title}
          </Text> */}
          {showViewMode ? modeType : null}
          <DailyBarChart {...props} />
        </View>
      );
    case 'W':
      return (
        <View>
          {/* <Text style={[styles.temperatureLabel, theme.typography.h3]}>
            {props.title}
          </Text> */}
          {showViewMode ? modeType : null}
          <WeeklyBarChart {...props} />
        </View>
      );
    // return <MonthlyBarChart />;
    default:
      throw new Error(`Invalid type: ${viewType}`);
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  temperatureLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Adjust the color as needed
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 10, // Add some spacing between the label and the chart
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
export default BarChartFactory;
