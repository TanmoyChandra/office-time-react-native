import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TimeDisplay = ({ time }) => {
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
      <Text style={styles.timeText}>{formatTime(time)}</Text>
  );
};

const styles = StyleSheet.create({
  timeText: {
    paddingTop: 12,
    fontSize: 42,
    color: '#6750A4',
    fontWeight: 'bold',
  },
});

export default TimeDisplay;
