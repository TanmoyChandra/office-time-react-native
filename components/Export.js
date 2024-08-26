import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DataContext } from '../contexts/DataContext';
import { format, subMonths, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

const Export = () => {
  const { weeklyData } = useContext(DataContext);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const filterData = () => {
      const now = new Date();
      const twoMonthsAgo = subMonths(now, 2);

      const filteredData = Object.keys(weeklyData)
        .map(dateString => {
          const date = new Date(dateString);
          const data = weeklyData[dateString];
          return {
            date: dateString,
            punchInTime: data.punchInTime ? new Date(data.punchInTime).toLocaleTimeString() : '-',
            punchOutTime: data.punchOutTime ? new Date(data.punchOutTime).toLocaleTimeString() : '-',
            totalHours: data.totalHours || '-',
          };
        })
        .filter(item => {
          const itemDate = new Date(item.date);
          return isWithinInterval(itemDate, {
            start: startOfDay(twoMonthsAgo),
            end: endOfDay(now),
          });
        });

      setTableData(filteredData);
    };

    filterData();
  }, [weeklyData]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.row}>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>Punch In</Text>
          <Text style={styles.headerCell}>Punch Out</Text>
          <Text style={styles.headerCell}>Total Hours</Text>
        </View>
        {/* Table Rows */}
        {tableData.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{item.date}</Text>
            <Text style={styles.cell}>{item.punchInTime}</Text>
            <Text style={styles.cell}>{item.punchOutTime}</Text>
            <Text style={styles.cell}>{item.totalHours}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default Export;
