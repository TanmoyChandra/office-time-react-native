import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
  const [weeklyData, setWeeklyData] = useState({});
  const [eightWeekData, setEightWeekData] = useState({});

  const fetchWeeklyData = async () => {
    const currentDate = new Date();
    const weekData = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const time = JSON.parse(await AsyncStorage.getItem(dateString)) || 0;
      weekData[dateString] = time;
    }
    setWeeklyData(weekData);
  };

const fetchEightWeekData = async () => {
  const currentDate = new Date();
  const weeksData = {};

  for (let i = 0; i < 8; i++) {
    // Determine the start of the week (Monday) and end of the week (Sunday)
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1) - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday

    // Format the heading to show Monday to Friday only
    const mondayDate = format(weekStart, 'do MMM');
    const fridayDate = format(new Date(weekStart.setDate(weekStart.getDate() + 4)), 'do MMM');
    const heading = `${mondayDate} - ${fridayDate}`;

    let totalTime = 0;

    // Calculate total time from Monday to Sunday
    for (let j = 0; j < 7; j++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + j);
      const dateString = date.toISOString().split('T')[0];
      const time = JSON.parse(await AsyncStorage.getItem(dateString)) || 0;
      totalTime += time;
    }

    weeksData[heading] = totalTime > 0 ? totalTime : 'N/A';
  }

  setEightWeekData(weeksData);
};



  return (
    <DataContext.Provider value={{ weeklyData, fetchWeeklyData, eightWeekData, fetchEightWeekData }}>
      {children}
    </DataContext.Provider>
  );
};
