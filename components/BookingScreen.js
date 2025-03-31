import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  Modal,
  StatusBar,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import { format, parseISO, addDays } from "date-fns";
import { useSelector } from "react-redux";
import axios from "axios";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const BookingScreen = ({ route }) => {
  const navigation = useNavigation();
  const { restaurant = {} } = route.params;
  const { booking, isEditing } = route.params || {};
  const token = useSelector((state) => state.user.token);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showPaxModal, setShowPaxModal] = useState(false);
  const [bookingSlot, setBookingSlot] = useState({
    dateIn: route.params?.booking?.bookingSlot.dateIn || null,
    timeIn: route.params?.booking?.bookingSlot.timeIn || null,
    request: route.params?.booking?.bookingSlot.request || "",
    pax: route.params?.booking?.bookingSlot.pax || "",
  });

  const getTimes = () => {
    if (!bookingSlot.dateIn) return [];
    
    // Default opening/closing times if not provided by restaurant
    const openingTime = restaurant.openingTime || 10;
    const closingTime = restaurant.closingTime || 22;
    
    const selectedDate = parseISO(bookingSlot.dateIn.dateString);
    const beginning = new Date(selectedDate);
    beginning.setHours(openingTime, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(closingTime, 0, 0);
    const interval = 30; // 30 minutes interval
    const times = [];
    for (let i = beginning; i <= end; i.setMinutes(i.getMinutes() + interval)) {
      times.push(new Date(i));
    }
    return times;
  };

  const handleConfirmBooking = async () => {
    if (!bookingSlot.dateIn || !bookingSlot.timeIn || !bookingSlot.pax) {
      alert("Please complete all required fields: Date, Time, and Number of People.");
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
        navigation.goBack();
      } else {
        navigation.navigate("ConfirmationScreen", { bookingSlot, restaurant });
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking. Please try again.");
    }
  };

  const times = getTimes();
  const formattedDate = bookingSlot.dateIn?.dateString 
    ? format(new Date(bookingSlot.dateIn.dateString), "EEE, MMM d, yyyy")
    : "Select Date";
    
  const formattedTime = bookingSlot.timeIn
    ? format(new Date(bookingSlot.timeIn), "h:mm a")
    : "Select Time";

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={16} color="#1A1A2E" />
        </TouchableOpacity>
        
        <View style={styles.headerSection}>
          <Text style={styles.title}>
            {isEditing ? "Edit Reservation" : "Make a Reservation"}
          </Text>
          <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Reservation Details</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Date <Text style={styles.requiredStar}>*</Text></Text>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                !bookingSlot.dateIn && styles.missingField,
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <FontAwesome5 name="calendar-alt" size={16} color="#6C63FF" style={styles.fieldIcon} />
              <Text style={styles.selectionButtonText}>{formattedDate}</Text>
              <FontAwesome5 name="chevron-down" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Time <Text style={styles.requiredStar}>*</Text></Text>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                !bookingSlot.timeIn && styles.missingField,
              ]}
              onPress={() => setShowTimePicker(true)}
              disabled={!bookingSlot.dateIn}
            >
              <FontAwesome5 name="clock" size={16} color="#4ECDC4" style={styles.fieldIcon} />
              <Text style={[
                styles.selectionButtonText,
                !bookingSlot.dateIn && styles.disabledText
              ]}>
                {!bookingSlot.dateIn ? "Select date first" : formattedTime}
              </Text>
              <FontAwesome5 name="chevron-down" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Number of People <Text style={styles.requiredStar}>*</Text></Text>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                !bookingSlot.pax && styles.missingField,
              ]}
              onPress={() => setShowPaxModal(true)}
            >
              <FontAwesome5 name="users" size={16} color="#FF6B6B" style={styles.fieldIcon} />
              <Text style={styles.selectionButtonText}>
                {bookingSlot.pax
                  ? `${bookingSlot.pax} ${bookingSlot.pax === "1" ? "Person" : "People"}`
                  : "Select number of people"}
              </Text>
              <FontAwesome5 name="chevron-down" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Special Requests</Text>
            <TextInput
              style={styles.input}
              value={bookingSlot.request}
              onChangeText={(text) =>
                setBookingSlot((prev) => ({ ...prev, request: text }))
              }
              multiline
              numberOfLines={4}
              placeholder="Any dietary requirements or special occasions?"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
        
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Reservation Summary</Text>
          
          <View style={styles.summaryCard}>
            {bookingSlot.dateIn && (
              <View style={styles.summaryItem}>
                <FontAwesome5 name="calendar-alt" size={16} color="#6C63FF" />
                <Text style={styles.summaryText}>{formattedDate}</Text>
              </View>
            )}
            
            {bookingSlot.timeIn && (
              <View style={styles.summaryItem}>
                <FontAwesome5 name="clock" size={16} color="#4ECDC4" />
                <Text style={styles.summaryText}>{formattedTime}</Text>
              </View>
            )}
            
            {bookingSlot.pax && (
              <View style={styles.summaryItem}>
                <FontAwesome5 name="users" size={16} color="#FF6B6B" />
                <Text style={styles.summaryText}>
                  {bookingSlot.pax} {bookingSlot.pax === "1" ? "Person" : "People"}
                </Text>
              </View>
            )}
            
            {bookingSlot.request && (
              <View style={styles.summaryItem}>
                <FontAwesome5 name="comment-alt" size={16} color="#6B7280" />
                <Text style={styles.summaryText} numberOfLines={2}>
                  {bookingSlot.request}
                </Text>
              </View>
            )}
            
            {(!bookingSlot.dateIn || !bookingSlot.timeIn || !bookingSlot.pax) && (
              <Text style={styles.incompleteText}>
                Please complete all required fields to see your reservation summary.
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmBooking}
          >
            <Text style={styles.confirmButtonText}>
              {isEditing ? "Update Reservation" : "Confirm Reservation"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <FontAwesome5 name="times" size={20} color="#1A1A2E" />
              </TouchableOpacity>
            </View>
            
            <Calendar
              minDate={new Date()}
              maxDate={addDays(new Date(), 30)}
              onDayPress={(day) => {
                setBookingSlot((prev) => ({ ...prev, dateIn: day, timeIn: null }));
                setShowDatePicker(false);
              }}
              markedDates={{
                [bookingSlot.dateIn?.dateString]: {
                  selected: true,
                  selectedColor: "#6C63FF",
                },
              }}
              theme={{
                todayTextColor: '#FF6B6B',
                selectedDayBackgroundColor: '#6C63FF',
                selectedDayTextColor: '#FFFFFF',
                arrowColor: '#6C63FF',
                monthTextColor: '#1A1A2E',
                textMonthFontWeight: 'bold',
                textDayFontSize: 14,
                textMonthFontSize: 16,
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal visible={showTimePicker} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <FontAwesome5 name="times" size={20} color="#1A1A2E" />
              </TouchableOpacity>
            </View>
            
            {times.length > 0 ? (
              <ScrollView style={styles.timeScrollView}>
                <View style={styles.timeContainer}>
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
                        {format(time, "h:mm a")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              <Text style={styles.noTimesText}>
                Please select a date first to see available times.
              </Text>
            )}
          </View>
        </View>
      </Modal>

      {/* Pax Modal */}
      <Modal visible={showPaxModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Number of People</Text>
              <TouchableOpacity onPress={() => setShowPaxModal(false)}>
                <FontAwesome5 name="times" size={20} color="#1A1A2E" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.paxContainer}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((pax) => (
                <TouchableOpacity
                  key={`pax-${pax}`}
                  style={styles.paxButton}
                  onPress={() => {
                    setBookingSlot((prev) => ({
                      ...prev,
                      pax: pax.toString(),
                    }));
                    setShowPaxModal(false);
                  }}
                >
                  <Text style={styles.paxButtonText}>{pax}</Text>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={[styles.paxButton, styles.largeGroupButton]}
                onPress={() => {
                  setBookingSlot((prev) => ({ ...prev, pax: "9+" }));
                  setShowPaxModal(false);
                }}
              >
                <Text style={styles.paxButtonText}>9+</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.paxNote}>
              For groups larger than 8, please call the restaurant directly for availability.
            </Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerSection: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 8,
    textAlign: "center",
  },
  restaurantName: {
    fontSize: 18,
    color: "#6C63FF",
    fontWeight: "600",
    textAlign: "center",
  },
  formSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4B5563",
    marginBottom: 8,
  },
  requiredStar: {
    color: "#FF6B6B",
  },
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  fieldIcon: {
    marginRight: 12,
  },
  selectionButtonText: {
    fontSize: 16,
    color: "#1A1A2E",
    flex: 1,
  },
  disabledText: {
    color: "#9CA3AF",
  },
  missingField: {
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    height: 120,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#1A1A2E",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summarySection: {
    marginBottom: 30,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 16,
    color: "#4B5563",
    marginLeft: 12,
    flex: 1,
  },
  incompleteText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontStyle: "italic",
    textAlign: "center",
    padding: 10,
  },
  actionSection: {
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cancelButtonText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    maxHeight: "80%",
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  timeScrollView: {
    maxHeight: 300,
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeButton: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    width: "48%",
    alignItems: "center",
  },
  timeButtonText: {
    color: "#1A1A2E",
    fontSize: 16,
    fontWeight: "500",
  },
  noTimesText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    padding: 20,
  },
  paxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  paxButton: {
    backgroundColor: "#F1F5F9",
    width: "23%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 12,
  },
  largeGroupButton: {
    backgroundColor: "#FFE4E6",
  },
  paxButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  paxNote: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default BookingScreen;