import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon package

const RestaurantScreen = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [pax, setPax] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPax, setSelectedPax] = useState('');

  const handleConfirmSelection = () => {
    setSelectedDate(date.toLocaleDateString());
    setSelectedTime(time.toLocaleTimeString());
    setSelectedPax(pax);
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity>
        <Text style={styles.backArrow}>{'<-'}</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Name of Restaurant</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Date */}
        <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.buttonText}>📅 Date</Text>
        </TouchableOpacity>

        {/* Pax (with 2 people icon) */}
        <View style={styles.paxContainer}>
          <Icon name="users" size={20} color="black" style={styles.paxIcon} /> {/* 2 people icon */}
          <RNPickerSelect
            onValueChange={(value) => setPax(value)}
            items={[
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
              { label: '4', value: '4' },
              { label: '5+', value: '5+' },
            ]}
            placeholder={{ label: 'Pax', value: null }}
            style={pickerSelectStyles}
          />
        </View>

        {/* Time */}
        <TouchableOpacity style={styles.button} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.buttonText}>⏰ Time</Text>
        </TouchableOpacity>
      </View>

      {/* Special Request */}
      <Text style={styles.specialRequest}>Special Request</Text>
      <TextInput style={styles.textInput} placeholder="Type here..." multiline />

      {/* Confirm and Cancel */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmSelection}>
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.cancelText}>cancel</Text>
      </TouchableOpacity>

      {/* Display selected information */}
      {selectedDate && selectedTime && selectedPax && (
        <View style={styles.selectedInfoContainer}>
          <Text style={styles.selectedInfoText}>Date: {selectedDate}</Text>
          <Text style={styles.selectedInfoText}>Time: {selectedTime}</Text>
          <Text style={styles.selectedInfoText}>Pax: {selectedPax} people</Text>
        </View>
      )}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7DA7F2',
    padding: 20,
  },
  backArrow: {
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  paxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  paxIcon: {
    marginRight: 5,
  },
  specialRequest: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    padding: 10,
  },
  confirmButton: {
    backgroundColor: '#b08968',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
  selectedInfoContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedInfoText: {
    fontSize: 16,
    color: 'black',
  },
});

const pickerSelectStyles = {
  inputIOS: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    width: '100%',
  },
  inputAndroid: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    width: '100%',
  },
};

export default RestaurantScreen;






