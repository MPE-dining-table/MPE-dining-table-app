import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Paystack } from "react-native-paystack-webview";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { FontAwesome5 } from "@expo/vector-icons";

export default function ConfirmationScreen({ route }) {
  const [makingPayment, setMakingPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { restaurant = {}, bookingSlot = {} } = route.params;
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const navigation = useNavigation();

  const formattedDate = bookingSlot.dateIn?.dateString 
    ? format(new Date(bookingSlot.dateIn.dateString), "EEE, MMM d, yyyy")
    : "N/A";
    
  const formattedTime = bookingSlot.timeIn
    ? format(new Date(bookingSlot.timeIn), "h:mm a")
    : "N/A";

  const sendBookingData = async () => {
    setIsLoading(true);
    const bookingData = {
      user,
      restaurant,
      bookingSlot,
      totalPrice: restaurant.price || 0,
    };

    try {
      const response = await axios.post(
        "https://mpe-backend-server.onrender.com/api/actions/booking",
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Booking saved successfully:");
        navigation.navigate("ProfileScreen");
      } else {
        console.error("Error saving booking:", response.data.message);
      }
    } catch (error) {
      console.error("Error sending booking data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Confirm Reservation</Text>
          <Text style={styles.headerSubtitle}>Please review your booking details</Text>
        </View>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Reservation Details</Text>
          </View>
          
          <View style={styles.restaurantSection}>
            <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>
            {restaurant.address && (
              <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
            )}
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="calendar-alt" size={16} color="#6C63FF" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formattedDate}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="clock" size={16} color="#4ECDC4" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{formattedTime}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="users" size={16} color="#FF6B6B" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Party Size</Text>
                <Text style={styles.detailValue}>
                  {bookingSlot.pax} {bookingSlot.pax === "1" ? "Person" : "People"}
                </Text>
              </View>
            </View>
            
            {bookingSlot.request && (
              <View style={styles.detailItem}>
                <View style={styles.iconContainer}>
                  <FontAwesome5 name="comment-alt" size={16} color="#6B7280" />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Special Requests</Text>
                  <Text style={styles.detailValue}>{bookingSlot.request}</Text>
                </View>
              </View>
            )}
          </View>
          
          {restaurant.price && (
            <>
              <View style={styles.divider} />
              
              <View style={styles.priceSection}>
                <Text style={styles.priceLabel}>Reservation Fee</Text>
                <Text style={styles.priceValue}>R{restaurant.price}</Text>
              </View>
            </>
          )}
        </View>
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Contact Information</Text>
          </View>
          
          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="user" size={16} color="#6C63FF" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>
                  {user.firstName} {user.lastName}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="phone-alt" size={16} color="#4ECDC4" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{user.cellphone}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="envelope" size={16} color="#FF6B6B" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{user.email}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.policySection}>
          <FontAwesome5 name="info-circle" size={16} color="#6B7280" style={styles.policyIcon} />
          <Text style={styles.policyText}>
            By confirming this reservation, you agree to the restaurant's cancellation policy. 
            Cancellations must be made at least 24 hours in advance.
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => setMakingPayment(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <FontAwesome5 name="credit-card" size={16} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.paymentButtonText}>
                {restaurant.price ? `Pay R${restaurant.price}` : "Confirm Reservation"}
              </Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>

      {makingPayment && (
        <View style={styles.paystackContainer}>
          <Paystack
            paystackKey="pk_test_b6e75075e9a5601a259702db3b9a0a18d6552c37"
            amount={restaurant.price || 0}
            billingEmail={user.email}
            currency="ZAR"
            activityIndicatorColor="#6C63FF"
            onCancel={(e) => {
              console.log("Payment cancelled", e);
              setMakingPayment(false);
            }}
            onSuccess={(res) => {
              console.log("Payment successful", res);
              sendBookingData();
            }}
            autoStart={true}
          />
        </View>
      )}
    </View>
  );
}

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
    marginBottom: 24,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  cardHeader: {
    padding: 16,
    backgroundColor: "#F1F5F9",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  restaurantSection: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  detailsSection: {
    padding: 16,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#1A1A2E",
    fontWeight: "500",
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6B6B",
  },
  policySection: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  policyIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  policyText: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
    lineHeight: 20,
  },
  paymentButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  paymentButtonText: {
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
  paystackContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 100,
  },
});