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

      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={userDetails.firstName}
            onChangeText={(text) => setUserDetails({ ...userDetails, firstName: text })}
          />
          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={userDetails.lastName}
            onChangeText={(text) => setUserDetails({ ...userDetails, lastName: text })}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={userDetails.email}
            onChangeText={(text) => setUserDetails({ ...userDetails, email: text })}
          />
          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            value={userDetails.mobileNumber}
            onChangeText={(text) => setUserDetails({ ...userDetails, mobileNumber: text })}
          />
        </View>

        <TouchableOpacity style={styles.updateButtonNavy} onPress={handleUpdate}>
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
    backgroundColor: '#FFF', // White background
  },
  header: {
    backgroundColor: '#FFF', // White background for the navigation bar
    paddingVertical: 15, // Reduced padding to make the header smaller
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1, // Add a border to separate the header from the content
    borderBottomColor: '#ccc',
  },
  headerTextSmall: {
    color: 'blue', // Blue text for "My Profile" and "Bookings"
    fontSize: 16, // Smaller font size
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
    marginTop: 20, // Move the form down a bit
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
    borderWidth: 1,
    borderColor: '#ccc',
  },
  updateButtonNavy: {
    backgroundColor: 'navy', // Navy blue background for the Update button
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
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