import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DataContext } from '../contexts/DataContext';
import { Card, Title, Paragraph } from 'react-native-paper';

const Weekly = () => {
  const { eightWeekData, fetchEightWeekData } = useContext(DataContext);

  useEffect(() => {
    fetchEightWeekData();
  }, []);

  // Function to format total hours for display
  const formatTotalHours = (totalHours) => {
    return typeof totalHours === 'number'
      ? `${totalHours.toFixed(2)} Hrs`
      : totalHours;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.dataContainer}>
        {Object.keys(eightWeekData).map((week) => (
          <Card key={week} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.row}>
                <Title style={styles.dateText}>{week}</Title>
                <Paragraph style={styles.timeText}>
                  {formatTotalHours(eightWeekData[week])}
                </Paragraph>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9', // Background color for better contrast
  },
  dataContainer: {
    marginTop: 20,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    marginEnd: 3,
    marginStart: 3
  },
  cardContent: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6750A4',
  },
});

export default Weekly;
