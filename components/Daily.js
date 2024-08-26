import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { DataContext } from '../contexts/DataContext';
import { format, subWeeks, differenceInHours, differenceInMinutes } from 'date-fns';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const Daily = () => {
  const { weeklyData, fetchWeeklyData, updateDailyData } = useContext(DataContext);
  const [lastFourWeeksData, setLastFourWeeksData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedPunchInTime, setEditedPunchInTime] = useState(null);
  const [editedPunchOutTime, setEditedPunchOutTime] = useState(null);
  const [isPunchInPickerVisible, setIsPunchInPickerVisible] = useState(false);
  const [isPunchOutPickerVisible, setIsPunchOutPickerVisible] = useState(false);

  useEffect(() => {
    fetchWeeklyData(); // Fetch data when the component mounts
  }, []);

  useEffect(() => {
    const calculateLastFourWeeksData = () => {
      const now = new Date();
      const fourWeeksAgo = subWeeks(now, 4);
      const formattedData = Object.keys(weeklyData)
        .map(dateString => {
          const date = new Date(dateString);
          if (date >= fourWeeksAgo) {
            const data = weeklyData[dateString];
            return {
              date: dateString,
              punchInTime: data.punchInTime ? new Date(data.punchInTime).toLocaleTimeString() : '-',
              punchOutTime: data.punchOutTime ? new Date(data.punchOutTime).toLocaleTimeString() : '-',
              totalHours: data.totalHours || '-',
            };
          }
          return null;
        })
        .filter(item => item !== null);
      setLastFourWeeksData(formattedData);
    };

    calculateLastFourWeeksData();
  }, [weeklyData]);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditedPunchInTime(item.punchInTime ? new Date(`1970-01-01T${item.punchInTime}:00`) : null);
    setEditedPunchOutTime(item.punchOutTime ? new Date(`1970-01-01T${item.punchOutTime}:00`) : null);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    const totalHours = calculateTotalHours(editedPunchInTime, editedPunchOutTime);
    const updatedData = {
      ...weeklyData[selectedItem.date],
      punchInTime: editedPunchInTime ? editedPunchInTime.toISOString() : null,
      punchOutTime: editedPunchOutTime ? editedPunchOutTime.toISOString() : null,
      totalHours: totalHours || 0,
    };
    await updateDailyData(selectedItem.date, updatedData);
    setIsModalVisible(false);
  };

  const calculateTotalHours = (punchInTime, punchOutTime) => {
    if (!punchInTime || !punchOutTime) return 0;
    return differenceInHours(punchOutTime, punchInTime) + (differenceInMinutes(punchOutTime, punchInTime) % 60) / 60;
  };

  const handleConfirmPunchIn = (date) => {
    setEditedPunchInTime(date);
    setIsPunchInPickerVisible(false);
  };

  const handleConfirmPunchOut = (date) => {
    setEditedPunchOutTime(date);
    setIsPunchOutPickerVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.calendarContainer}>
        <CalendarPicker
          height={300}
          width={320}
          selectedDayColor="#6750A4"
          selectedDayTextColor="#fff"
        />
      </View>
      <View style={styles.dataContainer}>
        {lastFourWeeksData.length > 0 ? (
          lastFourWeeksData.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{format(new Date(item.date), 'MMMM d, yyyy')}</Text>
              <View style={styles.row}>
                <Text style={styles.cardText}>Punch In: {item.punchInTime}</Text>
                <Button title="Edit" onPress={() => handleEdit(item)} />
              </View>
              <View style={styles.row}>
                <Text style={styles.cardText}>Punch Out: {item.punchOutTime}</Text>
                <Button title="Edit" onPress={() => handleEdit(item)} />
              </View>
              <Text style={styles.cardText}>Total Hours: {item.totalHours}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No data available for the last 4 weeks.</Text>
        )}
      </View>

      {/* Modal for Editing */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Time</Text>
          <Button title="Select Punch In Time" onPress={() => setIsPunchInPickerVisible(true)} />
          <Text>{editedPunchInTime ? editedPunchInTime.toLocaleTimeString() : 'No time selected'}</Text>
          <Button title="Select Punch Out Time" onPress={() => setIsPunchOutPickerVisible(true)} />
          <Text>{editedPunchOutTime ? editedPunchOutTime.toLocaleTimeString() : 'No time selected'}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Time Picker Modals */}
      <DateTimePickerModal
        isVisible={isPunchInPickerVisible}
        mode="time"
        onConfirm={handleConfirmPunchIn}
        onCancel={() => setIsPunchInPickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={isPunchOutPickerVisible}
        mode="time"
        onConfirm={handleConfirmPunchOut}
        onCancel={() => setIsPunchOutPickerVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  calendarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dataContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    elevation: 3, // Shadow effect for the card
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  noDataText: {
    fontSize: 16,
    color: 'red',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Daily;
