import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataContextProvider } from './contexts/DataContext';
import PunchInOut from './components/PunchInOut';
import Daily from './components/Daily';
import Weekly from './components/Weekly';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function App() {
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
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - i * 7);
      const weekStartString = weekStart.toISOString().split('T')[0];
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const weekEndString = weekEnd.toISOString().split('T')[0];
      let totalTime = 0;

      for (let j = 0; j < 7; j++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + j);
        const dateString = date.toISOString().split('T')[0];
        const time = JSON.parse(await AsyncStorage.getItem(dateString)) || 0;
        totalTime += time;
      }

      weeksData[`${weekStartString} - ${weekEndString}`] = totalTime > 0 ? totalTime : 'N/A';
    }
    setEightWeekData(weeksData);
  };

  useEffect(() => {
    fetchWeeklyData(); // Fetch weekly data on app load
    fetchEightWeekData(); // Fetch 8 weeks data on app load
  }, []);

  return (
    <DataContextProvider value={{ weeklyData, fetchWeeklyData, eightWeekData }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === 'Punch In/Out') {
                iconName = 'access-time'; // Icon name for Punch In/Out
              } else if (route.name === 'Daily') {
                iconName = 'today'; // Icon name for Daily
              } else if (route.name === 'Weekly') {
                iconName = 'calendar-today'; // Icon name for Weekly
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarLabelStyle: {
              fontSize: 10,
              fontWeight: 'bold',
            },
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopWidth: 0,
              elevation: 10, // Add shadow effect
              paddingBottom: 5, // Add padding at the bottom
            },
            tabBarActiveTintColor: '#6750A4', // Accent color for active tab
            tabBarInactiveTintColor: '#888', // Color for inactive tabs
          })}
        >
          <Tab.Screen name="Punch In/Out" component={PunchInOut} />
          <Tab.Screen name="Daily" component={Daily} />
          <Tab.Screen name="Weekly" component={Weekly} />
        </Tab.Navigator>
      </NavigationContainer>
    </DataContextProvider>
  );
}
