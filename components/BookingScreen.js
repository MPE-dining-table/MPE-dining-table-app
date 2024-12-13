import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BookingScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" style={styles.backIcon} />
        <Text style={styles.headerText}>iPhone 13 mini-6</Text>
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
        <TextInput
          style={styles.input}
          placeholder="Select date"
          placeholderTextColor="#A9A9A9"
        />
      </View>

      {/* Pax */}
      <View style={styles.section}>
        <Text style={styles.label}>Pax</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of people"
          placeholderTextColor="#A9A9A9"
        />
      </View>

      {/* Time */}
      <View style={styles.section}>
        <Text style={styles.label}>Time</Text>
        <TextInput
          style={styles.input}
          placeholder="Select time"
          placeholderTextColor="#A9A9A9"
        />
      </View>

      {/* Special Request */}
      <View style={styles.section}>
        <Text style={styles.label}>Special Request</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter special request"
          placeholderTextColor="#A9A9A9"
          multiline
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
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
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