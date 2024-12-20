import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { clearUser } from "../redux/userSlice";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { format } from "date-fns";

const ProfileScreen = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  // Local state for profile
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [cellphone, setCellphone] = useState(user?.cellphone || "");
  const [isSaving, setIsSaving] = useState(false);

  // State for bookings
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingsModal, setShowBookingsModal] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login");
    } else {
      fetchBookings();
      // console.log(token);
    }
  }, [user, navigation]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updatedUser = { firstName, lastName, email, cellphone };

      await axios.put(
        "https://mpe-backend-server.onrender.com/api/actions/profile",
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "https://mpe-backend-server.onrender.com/api/actions/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(clearUser());
  };

  const handleDeleteBooking = async (id) => {
    // console.log("Booking ID:",id);

    try {
      await axios.delete(
        `https://mpe-backend-server.onrender.com/api/actions/booking/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Success", "Booking deleted successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  // Handle update booking
  // const handleUpdateBooking = async (id, updatedData) => {
  //   try {
  //     await axios.put(
  //       `https://mpe-backend-server.onrender.com/api/actions/booking/${id}`,
  //       updatedData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     Alert.alert("Success", "Booking updated successfully");
  //     fetchBookings(); // Refresh bookings
  //   } catch (error) {
  //     console.error("Error updating booking:", error);
  //   }
  // };

  const renderBookingItem = ({ item }) => {
    const formattedDate = item.bookingSlot.dateIn
      ? format(new Date(item.bookingSlot.dateIn.timestamp), "yyyy-MM-dd")
      : "Date not set";

    const formattedTime = item.bookingSlot.timeIn
      ? format(new Date(item.bookingSlot.timeIn), "hh:mm a")
      : "Time not set";

    return (
      <View style={styles.bookingItem}>
        <Text style={styles.bookingText}>
          {item.restaurant?.restaurantName || "Unknown Restaurant"} -{" "}
          {formattedDate} at {formattedTime}
        </Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteBooking(item._id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("BookingScreen", {
              booking: item,
              isEditing: true,
            })
          }
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
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
        {/* Profile Section */}
        <View style={styles.content}>
          {/* Profile Section */}
          <View style={styles.form}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#888"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={cellphone}
              onChangeText={setCellphone}
              placeholder="Enter your mobile number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
            />
          </View>

          {/* Save Changes Button */}
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.updateButtonText}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>

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
            <Text style={styles.modalTitle}>Your Bookings</Text>
            <FlatList
              data={bookings}
              renderItem={renderBookingItem}
              keyExtractor={(item) => item._id}
            />
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
  logoutButton: {
    backgroundColor: "#f44336", // Red color for logout
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
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
