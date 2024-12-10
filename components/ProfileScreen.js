import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bookings</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>First name</Text>
          <TextInput style={styles.input} placeholder="Enter your first name" />
          <Text style={styles.label}>Last name</Text>
          <TextInput style={styles.input} placeholder="Enter your last name" />
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="Enter your email" />
          <Text style={styles.label}>Mobile number</Text>
          <TextInput style={styles.input} placeholder="Enter your mobile number" />
        </View>
        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#333',
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  updateButton: {
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;