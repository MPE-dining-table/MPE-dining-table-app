import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const ProfileScreen = ({ route }) => {
  // Fetch user details from SignupScreen (passed via navigation params)
  const { userDetails: initialUserDetails } = route.params || {
    userDetails: {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
    },
  };

  const [userDetails, setUserDetails] = useState(initialUserDetails);
  const [showBookingsModal, setShowBookingsModal] = useState(false);

  useEffect(() => {
    // Update user details if they change
    setUserDetails(initialUserDetails);
  }, [initialUserDetails]);

  const handleUpdate = () => {
    // Add your update logic here
    Alert.alert('Profile updated successfully!');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTextSmall}>My Profile</Text>
        <TouchableOpacity onPress={() => setShowBookingsModal(true)} style={styles.bookingsLink}>
          <Text style={styles.headerTextSmall}>Bookings</Text>
        </TouchableOpacity>
        {/* Settings Icon on the top-right corner */}
        <TouchableOpacity style={styles.settingsIcon}>
          <Icon name="cog" size={24} color="black" /> {/* Black settings icon */}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Bookings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bookings</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <Text style={styles.label}>First name</Text>
          <TextInput style={styles.input} placeholder="Enter your first name" placeholderTextColor="#888" />

          <Text style={styles.label}>Last name</Text>
          <TextInput style={styles.input} placeholder="Enter your last name" placeholderTextColor="#888" />

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor="#888" />

          <Text style={styles.label}>Mobile number</Text>
          <TextInput style={styles.input} placeholder="Enter your mobile number" placeholderTextColor="#888" />
        </View>

        {/* Update Button */}
        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Bookings */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showBookingsModal}
        onRequestClose={() => setShowBookingsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Booking History</Text>
            <Text style={styles.bookingItem}>Booking 1: Completed</Text>
            <Text style={styles.bookingItem}>Booking 2: Pending</Text>
            <Text style={styles.bookingItem}>Booking 3: Uncompleted</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowBookingsModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light gray background
  },
  header: {
    backgroundColor: '#FF6347', // Tomato color for header
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bookingsLink: {
    alignItems: 'flex-end',
    marginRight: 40, // Move "Bookings" to the left to avoid overlapping with the settings icon
  },
  settingsIcon: {
    position: 'absolute', // Position the settings icon absolutely
    right: 20, // Align to the right
    top: 15, // Align to the top
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // Shadow for Android
  },
  updateButton: {
    backgroundColor: '#4CAF50', // Green color for button
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for modal
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  bookingItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;