import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { DataContext } from '../contexts/DataContext';
import { format, subWeeks } from 'date-fns';

const Daily = () => {
  const { weeklyData, fetchWeeklyData } = useContext(DataContext);
  const [lastFourWeeksData, setLastFourWeeksData] = useState([]);

  useEffect(() => {
    fetchWeeklyData(); // Fetch data when the component mounts
  }, []);

  useEffect(() => {
    const calculateLastFourWeeksData = () => {
      const now = new Date();
      const fourWeeksAgo = subWeeks(now, 4);
      const formattedData = Object.keys(weeklyData)
        .map(dateString => {
          const date = new Date(dateString);
          if (date >= fourWeeksAgo) {
            const data = weeklyData[dateString];
            return {
              date: dateString,
              punchInTime: data.punchInTime ? new Date(data.punchInTime).toLocaleTimeString() : '-',
              punchOutTime: data.punchOutTime ? new Date(data.punchOutTime).toLocaleTimeString() : '-',
              totalHours: data.totalHours || '-',
            };
          }
          return null;
        })
        .filter(item => item !== null);
      setLastFourWeeksData(formattedData);
    };

    calculateLastFourWeeksData();
  }, [weeklyData]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.calendarContainer}>
        <CalendarPicker
          height={300}
          width={320}
          selectedDayColor="#6750A4"
          selectedDayTextColor="#fff"
        />
      </View>
      <View style={styles.dataContainer}>
        {lastFourWeeksData.length > 0 ? (
          lastFourWeeksData.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{format(new Date(item.date), 'MMMM d, yyyy')}</Text>
              <Text style={styles.cardText}>Punch In: {item.punchInTime}</Text>
              <Text style={styles.cardText}>Punch Out: {item.punchOutTime}</Text>
              <Text style={styles.cardText}>Total Hours: {item.totalHours}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No data available for the last 4 weeks.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  calendarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dataContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    elevation: 3, // Shadow effect for the card
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  noDataText: {
    fontSize: 16,
    color: 'red',
  },
});

export default Daily;
