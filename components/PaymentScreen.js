import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PaystackWebView from 'react-native-paystack-webview';

const PaymentScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Example payment details
  const paymentDetails = {
    amount: 5000, // Amount in kobo, Paystack uses kobo (100 kobo = 1 Naira)
    email: 'user@example.com', // User's email
    reference: `payment_${new Date().getTime()}`, // Unique payment reference
    currency: 'NGN', // Currency code
  };

  // Function to handle payment success
  const handlePaymentSuccess = (response) => {
    if (response.status === 'success') {
      Alert.alert('Payment Successful', 'Your payment was successful!', [
        { text: 'OK', onPress: () => navigation.navigate('ConfirmationScreen') },
      ]);
    } else {
      Alert.alert('Payment Failed', 'There was an issue with the payment. Please try again.');
    }
  };

  // Function to handle payment error
  const handlePaymentError = (error) => {
    Alert.alert('Payment Error', error.message || 'An error occurred during payment.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Page</Text>
      <Text style={styles.amount}>Amount: ₦{paymentDetails.amount / 100}</Text>

      <PaystackWebView
        paystackKey="pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXX" // Use your Paystack public test key here
        amount={paymentDetails.amount}
        billingEmail={paymentDetails.email}
        currency={paymentDetails.currency}
        reference={paymentDetails.reference}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentError}
      />

      {/* Optional: Add a loading indicator */}
      {loading && <Text>Loading payment...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  amount: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default PaymentScreen;
