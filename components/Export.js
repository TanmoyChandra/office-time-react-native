import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DataContext } from '../contexts/DataContext';
import { format, subMonths, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Card, Title, Paragraph } from 'react-native-paper';

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
            punchInTime: data.punchInTime ? format(new Date(data.punchInTime), 'HH:mm') : '-',
            punchOutTime: data.punchOutTime ? format(new Date(data.punchOutTime), 'HH:mm') : '-',
            totalHours: data.totalHours ? data.totalHours.toFixed(2) : '-',
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
          <Title style={[styles.headerCell, styles.boldText]}>Date</Title>
          <Title style={[styles.headerCell, styles.boldText]}>In</Title>
          <Title style={[styles.headerCell, styles.boldText]}>Out</Title>
          <Title style={[styles.headerCell, styles.boldText]}>Total</Title>
        </View>
        {/* Table Rows */}
        {tableData.map((item, index) => (
          <View key={index} style={styles.row}>
            <Paragraph style={styles.cell}>{item.date}</Paragraph>
            <Paragraph style={styles.cell}>{item.punchInTime}</Paragraph>
            <Paragraph style={styles.cell}>{item.punchOutTime}</Paragraph>
            <Paragraph style={styles.cell}>{item.totalHours}</Paragraph>
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
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Export;
