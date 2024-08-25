import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Roboto_400Regular, Roboto_700Bold, Roboto_700Regular } from '@expo-google-fonts/roboto';
import { DataContext } from '../contexts/DataContext';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import TimeDisplay from './TimeDisplay';
import AppLoading from 'expo-app-loading';

const MAX_HOURS = 9 * 60 * 60 * 1000; // 9 hours in milliseconds

const PunchInOut = () => {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const { fetchWeeklyData, fetchEightWeekData } = useContext(DataContext);

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Regular,
    Roboto_700Bold,
  });

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

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const confirmPunchIn = () => {
    Alert.alert(
      'Punch In Confirmation',
      'Are you sure you want to punch in?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: handlePunchIn,
        },
      ]
    );
  };

  const confirmPunchOut = () => {
    Alert.alert(
      'Punch Out Confirmation',
      'Are you sure you want to punch out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: handlePunchOut,
        },
      ]
    );
  };

  const handlePunchIn = async () => {
    const currentTime = Date.now();
    setStartTime(currentTime);
    setIsPunchedIn(true);
    await AsyncStorage.setItem('punchInTime', JSON.stringify(currentTime));
  };

  const handlePunchOut = async () => {
    setIsPunchedIn(false);
    const currentDate = new Date().toISOString().split('T')[0];
    const previousTime = JSON.parse(await AsyncStorage.getItem(currentDate)) || 0;
    const newTime = previousTime + currentTime;
    await AsyncStorage.setItem(currentDate, JSON.stringify(newTime));
    setCurrentTime(0);
    await AsyncStorage.removeItem('punchInTime'); // Clear punch-in time
    fetchWeeklyData(); // Refresh the weekly data
    await fetchEightWeekData();
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
        onPress={isPunchedIn ? confirmPunchOut : confirmPunchIn}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        {isPunchedIn ? 'Punch Out' : 'Punch In'}
      </Button>
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
    fontFamily: 'Roboto_700Bold',
  },
  subHeaderText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: -7,
    color: '#6750A4',
    fontFamily: 'Roboto_700Bold',
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
    fontFamily: 'Roboto_400Regular',
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
    fontFamily: 'Roboto_700Regular',
  },
});

export default PunchInOut;
