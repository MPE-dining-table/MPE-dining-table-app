import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { add, format, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import axios from "axios";

const BookingScreen = ({ route }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [bookingSlot, setBookingSlot] = useState({
    dateIn: booking?.bookingSlot.dateIn || null,
    timeIn: booking?.bookingSlot.timeIn || null,
    request: booking?.bookingSlot.request || "",
    pax: booking?.bookingSlot.pax || "",
  });
  const navigation = useNavigation();

  const { restaurant = {} } = route.params;

  const { booking, isEditing } = route.params || {};

  const token = useSelector((state) => state.user.token);

  const handleConfirmBooking = async () => {
    // Validation: Ensure required fields are not empty
    if (!bookingSlot.dateIn || !bookingSlot.timeIn || !bookingSlot.pax) {
      alert("Please complete all required fields: Date, Time, and Pax.");
      return;
    }

    try {
      if (isEditing && booking) {
        // Call update API
        await axios.put(
          `https://mpe-backend-server.onrender.com/api/actions/booking/${booking._id}`,
          { bookingSlot },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Booking updated successfully!");
      } else {
        // Normal booking logic
        navigation.navigate("ConfirmationScreen", { bookingSlot, restaurant });
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking. Please try again.");
    }
  };

  useEffect(() => {
    if (isEditing && booking) {
      console.log("Editing booking:", booking);
    }
  }, [isEditing, booking]);

  const getTimes = () => {
    if (!bookingSlot.dateIn) return [];

    const selectedDate = parseISO(bookingSlot.dateIn.dateString);

    const beginning = add(selectedDate, { hours: restaurant.openingTime });
    const end = add(selectedDate, { hours: restaurant.closingTime });
    const interval = 30;

    const times = [];
    for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
      times.push(i);
    }
    return times;
  };

  const times = getTimes();
  const formattedDate = bookingSlot.dateIn?.dateString || "N/A";
  const formattedTime = bookingSlot.timeIn
    ? format(new Date(bookingSlot.timeIn), "hh:mm a")
    : "N/A";
  const dateStyle = !bookingSlot.dateIn ? styles.missingField : styles.field;
  const timeStyle = !bookingSlot.timeIn ? styles.missingField : styles.field;
  const paxStyle = !bookingSlot.pax ? styles.missingField : styles.field;

  return (
    <View style={styles.container}>
     

      {/* Title */}
      <Text style={styles.title}>
        {isEditing ? "Edit Booking" : "New Booking"}
      </Text>
      <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Date */}
        <TouchableOpacity
          style={[styles.button, dateStyle]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.buttonText}>📅 Date</Text>
          <Text style={styles.buttonText}>{formattedDate}</Text>
        </TouchableOpacity>

        {/* Pax - Dropdown with Icon */}
        <View style={[styles.button, paxStyle]}>
          <Text style={styles.buttonText}>👥 Pax</Text>
          <RNPickerSelect
            onValueChange={(value) =>
              setBookingSlot((prev) => ({ ...prev, pax: value }))
            }
            items={[
              { label: "1 Person", value: "1" },
              { label: "2 People", value: "2" },
              { label: "3 People", value: "3" },
              { label: "4 People", value: "4" },
              { label: "5+ People", value: "5+" },
            ]}
            placeholder={{ label: "Choose Pax", value: bookingSlot.pax }} // Placeholder for Pax
            style={pickerSelectStyles}
            value={bookingSlot.pax}
          />
        </View>

        {/* Time */}
        <TouchableOpacity
          style={[styles.button, timeStyle]}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.buttonText}>⏰ Time</Text>
          <Text style={styles.buttonText}>{formattedTime}</Text>
        </TouchableOpacity>
      </View>

      {/* Special Request */}
      <Text style={styles.label}>Special Request</Text>
      <TextInput
        style={styles.input}
        value={bookingSlot.request}
        onChangeText={(text) =>
          setBookingSlot((prev) => ({ ...prev, request: text }))
        }
        multiline
        numberOfLines={4}
      />

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmBooking}
      >
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <Calendar
          style={styles.calendar}
          current={"2024-12-12"}
          minDate={format(new Date(), "yyyy-MM-dd")}
          onDayPress={(day) => {
            setBookingSlot({ dateIn: day });
            setShowDatePicker(false);
          }}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <ScrollView contentContainerStyle={styles.timeContainer}>
          {times.map((time, i) => (
            <TouchableOpacity
              key={`time-${i}`}
              style={styles.timeButton}
              onPress={() => {
                setBookingSlot((prev) => ({ ...prev, timeIn: time }));
                setShowTimePicker(false);
              }}
            >
              <Text style={styles.timeButtonText}>{format(time, "kk:mm")}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Light background
    padding: 20,
  },
  backArrow: {
    fontSize: 24,
    color: "#DAA520", // Gold-brown
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: "#DAA520", // Gold-brown
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  restaurantName: {
    fontSize: 20,
    color: "#333", // Dark text
    textAlign: "center",
    marginBottom: 20,
  },
  missingField: {
    borderColor: "red",
    borderWidth: 2,
  },
  field: {
    borderColor: "#DAA520", // Gold-brown
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fff", // White background
    padding: 10,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: "#333", // Dark text
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#DAA520", // Gold-brown
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: "#DAA520", // Gold-brown
    backgroundColor: "#fff", // White background
    borderRadius: 10,
    marginBottom: 20,
    textAlignVertical: "top",
    padding: 10,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#DAA520", // Gold-brown
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  confirmButtonText: {
    color: "#fff", // White text
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelText: {
    color: "#DAA520", // Gold-brown
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#DAA520", // Gold-brown
    borderRadius: 10,
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeButton: {
    backgroundColor: "#DAA520", // Gold-brown
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: "48%",
    alignItems: "center",
  },
  timeButtonText: {
    color: "#fff", // White text
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DAA520", // Gold-brown
  },
  inputAndroid: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DAA520", // Gold-brown
  },
});

export default BookingScreen;