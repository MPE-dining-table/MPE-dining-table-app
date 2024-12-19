import React, { useState } from "react";
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

const BookingScreen = ({ route }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [bookingSlot, setBookingSlot] = useState({
    dateIn: null,
    timeIn: null,
    request: "",
    pax: "",
  });
  const navigation = useNavigation();

  const { restaurant = {} } = route.params;

  const handleAddPress = () => {
    navigation.navigate("ConfirmationScreen", { restaurant, bookingSlot });
  };

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

  // if (bookingSlot.dateIn && bookingSlot.timeIn) {
  //   console.log("booking info: ", bookingSlot);
  // }

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity>
        <Text style={styles.backArrow}>{"<-"}</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{restaurant.restaurantName}</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Date */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.buttonText}>📅 Date</Text>
          <Text style={styles.buttonText}>{formattedDate}</Text>
        </TouchableOpacity>

        {/* Pax - Dropdown with Icon */}
        <View style={styles.paxContainer}>
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
          style={styles.button}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.buttonText}>⏰ Time</Text>
          <Text style={styles.buttonText}>{formattedTime}</Text>
        </TouchableOpacity>
      </View>

      {/* Special Request */}
      <Text style={styles.specialRequest}>Special Request</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Type here..."
        multiline
        value={bookingSlot.request}
        onChangeText={(text) =>
          setBookingSlot((prev) => ({ ...prev, request: text }))
        }
      />

      {/* Confirm and Cancel */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleAddPress}>
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <Calendar
          style={{
            borderWidth: 1,
            borderColor: "gray",
            height: 350,
          }}
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
            <Button
              key={`time-${i}`}
              title={format(time, "kk:mm")}
              onPress={() => {
                setBookingSlot((prev) => ({ ...prev, timeIn: time }));
                setShowTimePicker(false);
              }}
              style={styles.timeButton}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7DA7F2",
    padding: 20,
  },
  backArrow: {
    fontSize: 20,
    color: "black",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
  },
  paxContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    borderWidth: 1, // Adds a border to the Pax container
    borderRadius: 10,
    backgroundColor: "#f0f0f0", // Background color for the Pax box
    padding: 10,
  },
  specialRequest: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#d3d3d3",
    borderRadius: 10,
    marginBottom: 20,
    textAlignVertical: "top",
    padding: 10,
  },
  confirmButton: {
    backgroundColor: "#b08968",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
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
    borderColor: "gray",
  },
  inputAndroid: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
  },
});

export default BookingScreen;
