import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { DataContext } from '../contexts/DataContext';
import { format, subWeeks, differenceInHours, differenceInMinutes } from 'date-fns';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Card, Title, Paragraph, Button as PaperButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure you have this library installed

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
              punchInTime: data.punchInTime ? format(new Date(data.punchInTime), 'HH:mm') : '-',
              punchOutTime: data.punchOutTime ? format(new Date(data.punchOutTime), 'HH:mm') : '-',
              totalHours: data.totalHours ? data.totalHours.toFixed(2) : '',
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
    return (differenceInHours(punchOutTime, punchInTime) + (differenceInMinutes(punchOutTime, punchInTime) % 60) / 60).toFixed(2);
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
          selectedDayTextColor="#6750A4"
        />
      </View>
      <View style={styles.dataContainer}>
        {lastFourWeeksData.length > 0 ? (
          lastFourWeeksData.map((item, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Title style={styles.date}>{format(new Date(item.date), 'd')}</Title>
                    <Title style={styles.belowDate}>{format(new Date(item.date), 'MMM').toUpperCase()}</Title>
                  </View>
                  <View style={styles.column}> 
                    <Paragraph style={styles.greyText}>{`In: ${item.punchInTime}`}</Paragraph>
                    <Paragraph style={styles.greyText}>{`Out: ${item.punchOutTime}`}</Paragraph>
                  </View>
                  <View style={styles.column}>
                    <Paragraph style={styles.bigText}>{item.totalHours} {item.totalHours>0?"hrs":"N/A"}</Paragraph>
                  </View>
                </View>
                <TouchableOpacity style={styles.editIcon} onPress={() => handleEdit(item)}>
                  <Icon name="edit" size={24} color="#6750A4" />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.noDataText}>No data available for the last 4 weeks.</Text>
        )}
      </View>

      {/* Modal for Editing */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Time</Text>
          <PaperButton mode="contained" onPress={() => setIsPunchInPickerVisible(true)}>
            Select Punch In Time
          </PaperButton>
          <Text>{editedPunchInTime ? editedPunchInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time selected'}</Text>
          <PaperButton mode="contained" onPress={() => setIsPunchOutPickerVisible(true)}>
            Select Punch Out Time
          </PaperButton>
          <Text>{editedPunchOutTime ? editedPunchOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time selected'}</Text>
          <View style={styles.buttonContainer}>
            <PaperButton mode="outlined" onPress={() => setIsModalVisible(false)}>Cancel</PaperButton>
            <PaperButton mode="contained" onPress={handleSave}>Save</PaperButton>
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
    padding: 15,
  },
  calendarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dataContainer: {
    flex: 1,
  },
  card: {
    marginBottom: 10,
    marginLeft: 2,
    marginRight: 2
  },
  cardContent: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  date: {
    fontWeight: 'bold',
    color: '#6750A4',
    marginBottom: -5,
    marginLeft: 5,
  },
  belowDate: {
    fontWeight: 'bold',
    color: '#6750A4',
    marginBottom: 5,
    marginLeft: 5,
  },
  bigText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6750A4',
  },
  greyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#808080',
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
    marginTop: 20,
  },
  noDataText: {
    fontSize: 16,
    color: 'red',
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});


export default Daily;
