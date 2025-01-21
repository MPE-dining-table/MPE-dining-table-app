import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Paystack } from "react-native-paystack-webview";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function ConfirmationScreen({ route }) {
  const [makingPayment, setMakingPayment] = useState(false);
  const { restaurant = {}, bookingSlot = {} } = route.params;
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const navigation = useNavigation();

  const formattedDate = bookingSlot.dateIn?.dateString || "N/A";
  const formattedTime = bookingSlot.timeIn
    ? format(new Date(bookingSlot.timeIn), "hh:mm a")
    : "N/A";

  const sendBookingData = async () => {
    const bookingData = {
      user,
      restaurant,
      bookingSlot,
      totalPrice: restaurant.price,
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
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Booking Confirmation</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <Text style={styles.text}>{restaurant.restaurantName}</Text>
        <View style={styles.row}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.text}>{formattedDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.icon}>⏰</Text>
          <Text style={styles.text}>{formattedTime}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.text}>{bookingSlot.pax}</Text>
        </View>
        <Text style={styles.total}>Total: R{restaurant.price}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Details</Text>
        <Text style={styles.text}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.text}>{user.cellphone}</Text>
        <Text style={styles.text}>{user.email}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setMakingPayment(true);
        }}
      >
        <Text style={styles.buttonText}>Make Payment</Text>
      </TouchableOpacity>

      {makingPayment && (
        <View style={{ flex: 1 }}>
          <Paystack
            paystackKey="pk_test_b6e75075e9a5601a259702db3b9a0a18d6552c37"
            amount={restaurant.price}
            billingEmail={user.email}
            currency="ZAR"
            activityIndicatorColor="green"
            onCancel={(e) => {
              console.log("Payment cancelled", e);
              navigation.navigate("SearchScreen");
            }}
            onSuccess={(res) => {
              sendBookingData();
              console.log("Payment successful", res);
            }}
            autoStart={true}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBEBEB", // Light background

    padding: 16,
    marginTop: 20,    
  },
  header: {
    backgroundColor: "#EBEBEB", // Gold-brown header

    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerText: {
    color: "#3A6EA5", // White text

    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff", // White background for sections
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#DAA520", // Gold-brown title
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333", // Dark text
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    color: "#DAA520", // Gold-brown total
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  button: {
    backgroundColor: "#FF6700", // Gold-brown button

    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff", // White text
    fontSize: 18,
    fontWeight: "bold",
  },
});