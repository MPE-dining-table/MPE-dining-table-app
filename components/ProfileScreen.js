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
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { clearUser } from "../redux/userSlice";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { format } from "date-fns";
import { FontAwesome5 } from "@expo/vector-icons";

const ProfileScreen = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Local state for profile
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [cellphone, setCellphone] = useState(user?.cellphone || "");
  const [isSaving, setIsSaving] = useState(false);

  // State for bookings
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // State to control visibility of sections
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      navigation.navigate("Login");
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !cellphone.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    
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

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setIsLoadingBookings(true);
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
      Alert.alert("Error", "Failed to fetch your bookings. Please try again.");
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const confirmDeleteBooking = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    
    try {
      await axios.delete(
        `https://mpe-backend-server.onrender.com/api/actions/booking/${bookingToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setShowDeleteConfirmation(false);
      setBookingToDelete(null);
      Alert.alert("Success", "Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      Alert.alert("Error", "Failed to cancel booking. Please try again.");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            dispatch(clearUser());
            navigation.navigate("Home");
          }
        }
      ]
    );
  };

  const renderBookingItem = ({ item }) => {
    const formattedDate = item.bookingSlot.dateIn
      ? format(new Date(item.bookingSlot.dateIn.timestamp), "EEE, MMM d, yyyy")
      : "Date not set";

    const formattedTime = item.bookingSlot.timeIn
      ? format(new Date(item.bookingSlot.timeIn), "h:mm a")
      : "Time not set";

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.restaurantName}>
            {item.restaurant?.restaurantName || "Unknown Restaurant"}
          </Text>
          <View style={styles.bookingStatus}>
            <Text style={styles.statusText}>Confirmed</Text>
          </View>
        </View>
        
        <View style={styles.bookingDetails}>
          <View style={styles.bookingDetail}>
            <FontAwesome5 name="calendar-alt" size={14} color="#6C63FF" />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.bookingDetail}>
            <FontAwesome5 name="clock" size={14} color="#4ECDC4" />
            <Text style={styles.detailText}>{formattedTime}</Text>
          </View>
          
          <View style={styles.bookingDetail}>
            <FontAwesome5 name="users" size={14} color="#FF6B6B" />
            <Text style={styles.detailText}>
              {item.bookingSlot.pax || "1"} {item.bookingSlot.pax === "1" ? "Person" : "People"}
            </Text>
          </View>
          
          {item.bookingSlot.request && (
            <View style={styles.bookingDetail}>
              <FontAwesome5 name="comment-alt" size={14} color="#6B7280" />
              <Text style={styles.detailText} numberOfLines={2}>
                {item.bookingSlot.request}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.bookingActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("BookingScreen", {
                booking: item,
                restaurant: item.restaurant,
                isEditing: true,
              })
            }
          >
            <FontAwesome5 name="edit" size={14} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => confirmDeleteBooking(item)}
          >
            <FontAwesome5 name="times" size={14} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyBookings = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="calendar-times" size={50} color="#E2E8F0" />
      <Text style={styles.emptyTitle}>No Reservations</Text>
      <Text style={styles.emptyText}>
        You don't have any restaurant reservations yet.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate("SearchScreen")}
      >
        <Text style={styles.browseButtonText}>Browse Restaurants</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeSection === "profile" && styles.activeTab
          ]}
          onPress={() => setActiveSection("profile")}
        >
          <FontAwesome5 
            name="user" 
            size={16} 
            color={activeSection === "profile" ? "#6C63FF" : "#6B7280"} 
          />
          <Text style={[
            styles.tabText,
            activeSection === "profile" && styles.activeTabText
          ]}>
            Profile
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeSection === "bookings" && styles.activeTab
          ]}
          onPress={() => {
            setActiveSection("bookings");
            fetchBookings();
          }}
        >
          <FontAwesome5 
            name="calendar-check" 
            size={16} 
            color={activeSection === "bookings" ? "#6C63FF" : "#6B7280"} 
          />
          <Text style={[
            styles.tabText,
            activeSection === "bookings" && styles.activeTabText
          ]}>
            Reservations
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeSection === "settings" && styles.activeTab
          ]}
          onPress={() => setActiveSection("settings")}
        >
          <FontAwesome5 
            name="cog" 
            size={16} 
            color={activeSection === "settings" ? "#6C63FF" : "#6B7280"} 
          />
          <Text style={[
            styles.tabText,
            activeSection === "settings" && styles.activeTabText
          ]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeSection === "profile" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>First Name</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="user" size={16} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter your first name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="user" size={16} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter your last name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="envelope" size={16} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="phone-alt" size={16} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={cellphone}
                  onChangeText={setCellphone}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <FontAwesome5 name="save" size={16} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
        
        {activeSection === "bookings" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Reservations</Text>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={fetchBookings}
                disabled={isLoadingBookings}
              >
                <FontAwesome5 
                  name="sync-alt" 
                  size={14} 
                  color="#6C63FF" 
                  style={isLoadingBookings ? styles.rotating : null} 
                />
              </TouchableOpacity>
            </View>
            
            {isLoadingBookings ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6C63FF" />
                <Text style={styles.loadingText}>Loading your reservations...</Text>
              </View>
            ) : bookings.length > 0 ? (
              <FlatList
                data={bookings}
                renderItem={renderBookingItem}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
                contentContainerStyle={styles.bookingsList}
              />
            ) : (
              renderEmptyBookings()
            )}
          </View>
        )}
        
        {activeSection === "settings" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <FontAwesome5 name="bell" size={16} color="#6C63FF" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>Manage your notification preferences</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={16} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <FontAwesome5 name="lock" size={16} color="#4ECDC4" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacy</Text>
                <Text style={styles.settingDescription}>Control your privacy settings</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={16} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <FontAwesome5 name="question-circle" size={16} color="#FF6B6B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingDescription}>Get assistance or contact support</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={16} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <FontAwesome5 name="sign-out-alt" size={16} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirmation}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <View style={styles.modalIcon}>
              <FontAwesome5 name="exclamation-triangle" size={30} color="#FF6B6B" />
            </View>
            
            <Text style={styles.confirmationTitle}>Cancel Reservation</Text>
            <Text style={styles.confirmationText}>
              Are you sure you want to cancel your reservation at{" "}
              {bookingToDelete?.restaurant?.restaurantName}?
            </Text>
            
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => {
                  setShowDeleteConfirmation(false);
                  setBookingToDelete(null);
                }}
              >
                <Text style={styles.cancelModalButtonText}>Keep</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmModalButton}
                onPress={handleDeleteBooking}
              >
                <Text style={styles.confirmModalButtonText}>Cancel Reservation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A2E",
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#6C63FF",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 4,
  },
  activeTabText: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 20,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  rotating: {
    transform: [{ rotate: "45deg" }],
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4B5563",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#1A1A2E",
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
  },
  bookingsList: {
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  bookingStatus: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#166534",
  },
  bookingDetails: {
    padding: 16,
  },
  bookingDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#4B5563",
    marginLeft: 12,
  },
  bookingActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#4ECDC4",
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#FF6B6B",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A2E",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#FFFFFF",
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
  confirmationModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 12,
  },
  confirmationText: {
    fontSize: 16,
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 24,
  },
  confirmationButtons: {
    flexDirection: "row",
    width: "100%",
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  cancelModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
  },
  confirmModalButton: {
    flex: 2,
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default ProfileScreen;