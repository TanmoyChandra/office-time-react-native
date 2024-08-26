import React, { useContext } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { DataContext } from '../contexts/DataContext';

const Export = () => {
  return (
    <ScrollView style={styles.container}>
      <Text>Test</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },

});

export default Export;
