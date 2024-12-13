import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const BookingScreen = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [pax, setPax] = useState('2'); // Change to string
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [specialRequest, setSpecialRequest] = useState('');

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Back pressed')}>
          <Ionicons name="arrow-back" size={24} color="black" style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      {/* Restaurant Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Name of Restaurant</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter restaurant name"
          placeholderTextColor="#A9A9A9"
        />
      </View>

      {/* Date */}
      <View style={styles.section}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity 
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Pax */}
      <View style={styles.section}>
        <Text style={styles.label}>Pax</Text>
        <View style={[styles.input, { padding: 0 }]}>
          <Picker
            selectedValue={pax}
            onValueChange={(itemValue) => setPax(itemValue.toString())} // Convert to string
            style={{ height: 40 }}
          >
            {[...Array(19)].map((_, i) => (
              <Picker.Item key={i} label={`${i + 2} people`} value={(i + 2).toString()} /> // Convert to string
            ))}
          </Picker>
        </View>
      </View>

      {/* Time */}
      <View style={styles.section}>
        <Text style={styles.label}>Time</Text>
        <TouchableOpacity 
          style={styles.input}
          onPress={() => setShowTimePicker(true)}
        >
          <Ionicons name="time-outline" size={24} color="#A9A9A9" />
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="spinner"
            onChange={onTimeChange}
            minuteInterval={30}
          />
        )}
      </View>

      {/* Special Request */}
      <View style={styles.section}>
        <Text style={styles.label}>Special Request</Text>
        <TextInput
          style={[styles.input, styles.specialRequestInput]}
          placeholder="Enter special request"
          placeholderTextColor="#A9A9A9"
          multiline
          value={specialRequest}
          onChangeText={setSpecialRequest}
        />
      </View>

      {/* Confirm Booking Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    marginRight: 10,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  specialRequestInput: {
    height: 100, // Increase the height to accommodate more text
  },
  button: {
    backgroundColor: '#FF5733',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BookingScreen;