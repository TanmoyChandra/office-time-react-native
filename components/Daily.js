import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { DataContext } from '../contexts/DataContext';
import { formatDate } from '../utils/dateUtils'; // Import the date formatting function
import { formatTime } from '../utils/timeUtils'; // Ensure this is available

const Daily = () => {
  const { weeklyData, fetchWeeklyData } = useContext(DataContext);

  useEffect(() => {
    fetchWeeklyData(); // Fetch data when the component mounts
  }, []);

  return (
    <ScrollView style={styles.breakdownContainer}>
      <CalendarPicker />
      <View style={styles.weekDataContainer}>
        {Object.keys(weeklyData).map((date) => (
          <View key={date} style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Text style={styles.timeText}>{formatTime(weeklyData[date])}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  breakdownContainer: {
    padding: 20,
  },
  weekDataContainer: {
    marginTop: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dateText: {
    fontSize: 16,
  },
  timeText: {
    fontSize: 16,
  },
});

export default Daily;
