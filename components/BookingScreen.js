import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import axios from "axios";

const BookingScreen = ({ route }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPaxModal, setShowPaxModal] = useState(false);
  const [bookingSlot, setBookingSlot] = useState({
    dateIn: route.params?.booking?.bookingSlot.dateIn || null,
    timeIn: route.params?.booking?.bookingSlot.timeIn || null,
    request: route.params?.booking?.bookingSlot.request || "",
    pax: route.params?.booking?.bookingSlot.pax || "",
  });

  const navigation = useNavigation();
  const { restaurant = {} } = route.params;
  const { booking, isEditing } = route.params || {};
  const token = useSelector((state) => state.user.token);

  const handleConfirmBooking = async () => {
    if (!bookingSlot.dateIn || !bookingSlot.timeIn || !bookingSlot.pax) {
      alert("Please complete all required fields: Date, Time, and Pax.");
      return;
    }

    try {
      if (isEditing && booking) {
        await axios.put(
          `https://mpe-backend-server.onrender.com/api/actions/booking/${booking._id}`,
          { bookingSlot },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Booking updated successfully!");
      } else {
        navigation.navigate("ConfirmationScreen", { bookingSlot, restaurant });
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking. Please try again.");
    }
  };

  const getTimes = () => {
    if (!bookingSlot.dateIn) return [];
    const selectedDate = parseISO(bookingSlot.dateIn.dateString);
    const beginning = new Date(selectedDate);
    beginning.setHours(restaurant.openingTime, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(restaurant.closingTime, 0, 0);
    const interval = 30; // 30 minutes interval
    const times = [];
    for (let i = beginning; i <= end; i.setMinutes(i.getMinutes() + interval)) {
      times.push(new Date(i));
    }
    return times;
  };

  const times = getTimes();
  const formattedDate = bookingSlot.dateIn?.dateString || "Select Date";
  const formattedTime = bookingSlot.timeIn
    ? format(new Date(bookingSlot.timeIn), "hh:mm a")
    : "Select Time";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEditing ? "Edit Booking" : "New Booking"}
      </Text>
      <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>

      {/* Date, Pax, and Time Selection */}
      <View style={styles.selectionContainer}>
        <TouchableOpacity
          style={[
            styles.selectionButton,
            !bookingSlot.dateIn && styles.missingField,
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.selectionButtonText}>📅 {formattedDate}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectionButton,
            !bookingSlot.pax && styles.missingField,
          ]}
          onPress={() => setShowPaxModal(true)}
        >
          <Text style={styles.selectionButtonText}>
            👥{" "}
            {bookingSlot.pax
              ? `${bookingSlot.pax} Person${bookingSlot.pax > 1 ? "s" : ""}`
              : "Select Pax"}
          </Text>
        </TouchableOpacity>

        <Modal visible={showPaxModal} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView contentContainerStyle={styles.timeContainer}>
                {[1, 2, 3, 4, 5].map((pax) => (
                  <TouchableOpacity
                    key={`pax-${pax}`}
                    style={styles.timeButton}
                    onPress={() => {
                      setBookingSlot((prev) => ({
                        ...prev,
                        pax: pax.toString(),
                      }));
                      setShowPaxModal(false);
                    }}
                  >
                    <Text style={styles.timeButtonText}>
                      {pax} Person{pax > 1 ? "s" : ""}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => {
                    setBookingSlot((prev) => ({ ...prev, pax: "5+" }));
                    setShowPaxModal(false);
                  }}
                >
                  <Text style={styles.timeButtonText}>5+ People</Text>
                </TouchableOpacity>
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPaxModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={[
            styles.selectionButton,
            !bookingSlot.timeIn && styles.missingField,
          ]}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.selectionButtonText}>⏰ {formattedTime}</Text>
        </TouchableOpacity>
      </View>

      {/* Special Request Input */}
      <Text style={styles.label}>Special Request</Text>
      <TextInput
        style={styles.input}
        value={bookingSlot.request}
        onChangeText={(text) =>
          setBookingSlot((prev) => ({ ...prev, request: text }))
        }
        multiline
        numberOfLines={4}
        placeholder="Any special requests?"
      />

      {/* Confirm and Cancel Buttons */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmBooking}
      >
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Calendar
              minDate={new Date()}
              onDayPress={(day) => {
                setBookingSlot((prev) => ({ ...prev, dateIn: day }));
                setShowDatePicker(false);
              }}
              markedDates={{
                [bookingSlot.dateIn?.dateString]: {
                  selected: true,
                  selectedColor: "#FF6700",
                },
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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
                  <Text style={styles.timeButtonText}>
                    {format(time, "hh:mm a")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTimePicker(false)}
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
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  restaurantName: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#3A6EA5",
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  selectionButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  selectionButtonText: {
    fontSize: 16,
    color: "#333",
  },
  missingField: {
    borderColor: "red",
    borderWidth: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: "#FF6700",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
    textAlignVertical: "top",
  },
  confirmButton: {
    backgroundColor: "#FF6700",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeButton: {
    backgroundColor: "#FF6700",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: "48%",
    alignItems: "center",
  },
  timeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FF6700",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#FF6700",
    borderRadius: 10,
    color: "#333",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#FF6700",
    borderRadius: 10,
    color: "#333",
    paddingRight: 30,
  },
});

export default BookingScreen;
