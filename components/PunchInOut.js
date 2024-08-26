import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { DataContext } from '../contexts/DataContext';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import TimeDisplay from './TimeDisplay';

const MAX_HOURS = 9 * 60 * 60 * 1000; // 9 hours in milliseconds

const PunchInOut = () => {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isPunchOutPickerVisible, setPunchOutPickerVisibility] = useState(false);
  const { fetchWeeklyData, fetchEightWeekData } = useContext(DataContext);

  useEffect(() => {
    const loadPunchInStatus = async () => {
      const storedStartTime = await AsyncStorage.getItem('punchInTime');
      if (storedStartTime) {
        const elapsedTime = Date.now() - parseInt(storedStartTime, 10);
        setStartTime(parseInt(storedStartTime, 10));
        setCurrentTime(elapsedTime);
        setIsPunchedIn(true);
      }
    };

    loadPunchInStatus();
  }, []);

  useEffect(() => {
    let interval;
    if (isPunchedIn) {
      interval = setInterval(() => {
        setCurrentTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn, startTime]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handlePunchInConfirm = async (selectedTime) => {
    const currentTime = selectedTime.getTime();
    setStartTime(currentTime);
    setIsPunchedIn(true);
    setCurrentTime(Date.now() - currentTime);
    await AsyncStorage.setItem('punchInTime', JSON.stringify(currentTime));
    hideDatePicker();
  };

  const showPunchOutPicker = () => {
    setPunchOutPickerVisibility(true);
  };

  const hidePunchOutPicker = () => {
    setPunchOutPickerVisibility(false);
  };

  const handlePunchOutConfirm = async (selectedTime) => {
    const punchOutTime = selectedTime.getTime();
    const punchDuration = punchOutTime - startTime;
    setIsPunchedIn(false);

    const currentDate = new Date().toISOString().split('T')[0];
    const previousTime = JSON.parse(await AsyncStorage.getItem(currentDate)) || 0;
    const newTime = previousTime + punchDuration;
    
    await AsyncStorage.setItem(currentDate, JSON.stringify(newTime));
    setCurrentTime(0);
    await AsyncStorage.removeItem('punchInTime'); // Clear punch-in time
    fetchWeeklyData(); // Refresh the weekly data
    await fetchEightWeekData();
    hidePunchOutPicker();
  };

  const progress = Math.min((currentTime / MAX_HOURS) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.semiCircleContainer}>
        <AnimatedCircularProgress
          size={260} // Increased size for a bigger progress bar
          width={20} // Increase width for a thicker progress bar
          fill={progress}
          tintColor="#6750A4"
          backgroundColor="#d9d3e8"
          lineCap="round"
          arcSweepAngle={280} // Limits the arc to 180 degrees for a semi-circle
          rotation={-140} // Rotates the arc to start at the bottom and sweep upwards
          style={styles.progressBar}
        >
        </AnimatedCircularProgress>
        <View style={styles.timeDisplayContainer}>
          <TimeDisplay time={currentTime} style={styles.timeDisplay} />
        </View>
      </View>
      <Text style={styles.headerText}>OFFICE TIME</Text>
      <Text style={styles.subHeaderText}>MADE BY TANMOY CHANDRA</Text>
      <Button
        mode="contained"
        onPress={isPunchedIn ? showPunchOutPicker : showDatePicker}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        {isPunchedIn ? 'Punch Out' : 'Punch In'}
      </Button>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handlePunchInConfirm}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        isVisible={isPunchOutPickerVisible}
        mode="time"
        onConfirm={handlePunchOutConfirm}
        onCancel={hidePunchOutPicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#6750A4',
  },
  subHeaderText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: -7,
    color: '#6750A4',
  },
  semiCircleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    paddingBottom: 10,
  },
  timeDisplayContainer: {
    position: 'absolute',
    top: 90,
    alignItems: 'center',
  },
  timeDisplay: {
    paddingTop: 10,
    fontSize: 25,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 50,
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 20,
  },
});

export default PunchInOut;
