import React from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

const ProfileScreen = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light gray background
  },
  header: {
    backgroundColor: "#FF6347", // Tomato color for header
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  headerText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
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
    fontWeight: "bold",
    color: "#333",
  },
  form: {
    marginBottom: 30,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, // Shadow for Android
  },
  updateButton: {
    backgroundColor: "#4CAF50", // Green color for button
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
