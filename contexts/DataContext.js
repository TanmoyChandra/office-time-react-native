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
      const data = JSON.parse(await AsyncStorage.getItem(dateString)) || { punchInTime: null, punchOutTime: null, totalHours: 0 };
      weekData[dateString] = data;
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
      const fridayDate = format(new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000), 'do MMM'); // Add 4 days to get Friday
      const heading = `${mondayDate} - ${fridayDate}`;

      let totalTime = 0;

      // Calculate total time from Monday to Sunday
      for (let j = 0; j < 7; j++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + j);
        const dateString = format(day, 'yyyy-MM-dd'); // Use consistent date format
        const data = JSON.parse(await AsyncStorage.getItem(dateString)) || { punchInTime: null, punchOutTime: null, totalHours: 0 };
        totalTime += data.totalHours || 0;
      }

      weeksData[heading] = totalTime > 0 ? totalTime : 'N/A';
    }

    setEightWeekData(weeksData);
  };

  const updateDailyData = async (dateString, updatedData) => {
    // Update data in AsyncStorage
    await AsyncStorage.setItem(dateString, JSON.stringify(updatedData));

    // Update the local state
    await fetchWeeklyData(); // Refresh the weekly data
    await fetchEightWeekData(); // Refresh the eight week data
  };

  return (
    <DataContext.Provider value={{ weeklyData, fetchWeeklyData, eightWeekData, fetchEightWeekData, updateDailyData }}>
      {children}
    </DataContext.Provider>
  );
};
