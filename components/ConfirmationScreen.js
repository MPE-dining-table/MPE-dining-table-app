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

      // const result = await response.json();

      if (response.ok) {
        console.log("Booking saved successfully:");
        navigation.navigate("ProfileScreen");
      } else {
        console.error("Error saving booking:", result.message);
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
    // backgroundColor: "#f9f9f9",
    padding: 16,
  },
  header: {
    // backgroundColor: "#002244",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  radioButton: {
    height: 16,
    width: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 8,
  },
  button: {
    backgroundColor: "#e63946",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
