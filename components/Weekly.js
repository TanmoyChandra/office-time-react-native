import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DataContext } from '../contexts/DataContext';
import { formatTime } from '../utils/timeUtils';

const Weekly = () => {
  const { eightWeekData, fetchEightWeekData } = useContext(DataContext);

  useEffect(() => {
    fetchEightWeekData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dataContainer}>
        {Object.keys(eightWeekData).map((week) => (
          <View key={week} style={styles.weekContainer}>
            <Text style={styles.weekText}>{week}</Text>
            <Text style={styles.timeText}>
              {typeof eightWeekData[week] === 'number'
                ? formatTime(eightWeekData[week])
                : eightWeekData[week]}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9', // Background color for better contrast
  },
  dataContainer: {
    marginTop: 20,
  },
  weekContainer: {
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-between', // Space between date and time
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  weekText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Slightly darker text color for better readability
  },
  timeText: {
    fontSize: 20, // Larger font size for the total time
    fontWeight: 'bold',
    color: '#6750A4', // Accent color for the total time
  },
});

export default Weekly;
