import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { DataContext } from '../contexts/DataContext';
import { format, parseISO } from 'date-fns';

const Daily = () => {
  const { weeklyData, fetchWeeklyData } = useContext(DataContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateData, setSelectedDateData] = useState(null);

  useEffect(() => {
    fetchWeeklyData(); // Fetch data when the component mounts
  }, []);

  const handleDateChange = (date) => {
    const dateString = format(date, 'yyyy-MM-dd'); // Format date to string
    setSelectedDate(dateString);
    setSelectedDateData(weeklyData[dateString]);
  };

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'MMMM d, yyyy'); // Format date string
  };

  const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'HH:mm:ss'); // Format time from timestamp
  };

  return (
    <ScrollView style={styles.breakdownContainer}>
      <CalendarPicker onDateChange={handleDateChange} />
      <View style={styles.weekDataContainer}>
        {selectedDate ? (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            {selectedDateData ? (
              <>
                <Text style={styles.timeText}>Punch In: {selectedDateData.punchInTime ? formatTime(selectedDateData.punchInTime) : 'N/A'}</Text>
                <Text style={styles.timeText}>Punch Out: {selectedDateData.punchOutTime ? formatTime(selectedDateData.punchOutTime) : 'N/A'}</Text>
                <Text style={styles.timeText}>Total Hours: {selectedDateData.totalHours ? `${selectedDateData.totalHours.toFixed(2)} hours` : 'N/A'}</Text>
              </>
            ) : (
              <Text style={styles.noDataText}>No data available for this date.</Text>
            )}
          </View>
        ) : (
          <Text style={styles.selectDateText}>Select a date to see details</Text>
        )}
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
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
    marginTop: 5,
  },
  noDataText: {
    fontSize: 16,
    color: 'red',
  },
  selectDateText: {
    fontSize: 16,
    color: '#888',
  },
});

export default Daily;
