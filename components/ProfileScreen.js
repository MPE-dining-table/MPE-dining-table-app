import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from "react-native";
import { clearUser } from "../redux/userSlice";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const user = useSelector((state) => state.user.user);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login");
    }
  }, [user, navigation]); 

  const handleLogout = () => {
    dispatch(clearUser()); 
  };

  return (
    <View style={styles.container}>
      {/* Header/Navbar */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      {/* Bookings Link */}
      <TouchableOpacity
        onPress={() => setShowBookingsModal(true)}
        style={styles.bookingsLink}
      >
        <Text style={styles.bookingsLinkText}>Bookings</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {/* Form Section */}
        <View style={styles.form}>
          <Text style={styles.label}>First name</Text>
          <TextInput
            style={styles.input}
            value={user?.firstName || ""}
            placeholder="Enter your first name"
            placeholderTextColor="#888"
            editable={false}
          />

          <Text style={styles.label}>Last name</Text>
          <TextInput
            style={styles.input}
            value={user?.lastName || ""}
            placeholder="Enter your last name"
            placeholderTextColor="#888"
            editable={false}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={user?.email || ""}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            editable={false}
          />

          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            style={styles.input}
            value={user?.cellphone || ""}
            placeholder="Enter your mobile number"
            placeholderTextColor="#888"
            editable={false}
          />
        </View>

        {/* Update Button */}
        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowBookingsModal(false)}
            >
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
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#DEB887", // Light brown color
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  bookingsLink: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginRight: 20,
  },
  bookingsLinkText: {
    color: "#1E90FF", // Blue color for the link
    fontSize: 14,
    textDecorationLine: "underline",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
    elevation: 3,
  },
  updateButton: {
    backgroundColor: "#DEB887", // Light brown color
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    alignSelf: "center",
    width: 150,
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  bookingItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: "#333",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
