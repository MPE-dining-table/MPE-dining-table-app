import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ScrollView
} from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import logo from "../assets/Mpelogo.png";
import Fontisto from '@expo/vector-icons/Fontisto';

export default function LoginScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false); // Forgot password modal state
  const [emailForReset, setEmailForReset] = useState(""); // State to hold email input for reset

  const dispatch = useDispatch();

  const handleChange = (key, value) => {
    setUserInfo({ ...userInfo, [key]: value });
  };

  const validate = () => {
    let errors = {};
    if (!userInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      errors.email = "Invalid email format";
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!userInfo.password || !passwordRegex.test(userInfo.password)) {
      errors.password =
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character.";
    }
    if (!isChecked) {
      errors.terms = "You must accept the terms and conditions";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const response = await axios.post(
          "https://mpe-backend-server.onrender.com/api/auth/login",
          userInfo
        );

        const { user, token } = response.data;

        dispatch(setUser({ user, token }));

        Alert.alert("Success", "User login successfully!");
        navigation.navigate('BookTable');
        setUserInfo({
          email: "",
          password: "",
        });
        setErrors({});
      } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        Alert.alert(
          "Error",
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    }
  };

  const handleForgotPasswordSubmit = () => {
    if (emailForReset) {
      // API call to send reset link to email (replace with actual logic)
      Alert.alert("Success", "A password reset link has been sent to your email.");
      setForgotPasswordModal(false);
      setEmailForReset(""); // Clear email field
    } else {
      Alert.alert("Error", "Please enter a valid email address.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Image source={logo} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => handleChange("email", text)}
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => handleChange("password", text)}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        <TouchableOpacity onPress={() => setForgotPasswordModal(true)}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Terms and Conditions Section */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
            <Fontisto
              name={isChecked ? "checkbox-active" : "checkbox-passive"}
              size={24}
              color={isChecked ? "#3366FF" : "black"}
            />
          </TouchableOpacity>
          <Text style={styles.termsText}>
            I accept the{" "}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.termsLink}>Terms & Conditions</Text>
            </TouchableOpacity>
          </Text>
        </View>
        {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Terms & Conditions */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Terms & Conditions</Text>
              <Text style={styles.modalContent}>
                {/* Your Terms and Conditions content goes here */}
                By using this app, you agree to the following terms and conditions:
                1. You must be 18 years or older.
                2. You agree to provide accurate information when booking.
                3. Any abuse of the booking system may result in a ban.
                4. Payments for reservations are non-refundable.
                {/* Add more terms as necessary */}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Forgot Password */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={forgotPasswordModal}
        onRequestClose={() => setForgotPasswordModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Forgot Password?</Text>
            <Text style={styles.modalContent}>
              Please provide your email address. We will send you a link to reset your password.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={emailForReset}
              onChangeText={setEmailForReset}
              keyboardType="email-address"
            />
            <TouchableOpacity
              style={styles.button2}
              onPress={handleForgotPasswordSubmit}
            >
              <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setForgotPasswordModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 20,
  },
  formContainer: {
    width: "100%",
    height: "95%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F9F9F9",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
  forgotPassword: {
    color: "#3366FF",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "right",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  termsText: {
    fontSize: 14,
    color: "#555",
  },
  termsLink: {
    color: "#3366FF",
    textDecorationLine: "underline",
  },
  button: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: "#3366FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#3366FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  button2: {
    width: "60%",
    alignSelf: "center",
    backgroundColor: "#3366FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#3366FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    bottom:5
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    alignContent:"space-around",
    
  },
  errorText: {
    color: "#FF4D4F",
    fontSize: 12,
    marginBottom: 8,
    alignSelf: "flex-start",
    width: "100%",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    paddingHorizontal: 20, // Padding for responsiveness
  },
  modalContainer: {
    width: "85%", // Adjusted to make it responsive
    backgroundColor: "#FFF",
    borderRadius: 15, // Slightly rounded corners
    padding: 25, // Adjusted padding for better spacing
    alignItems: "center",
    shadowColor: "#000", // Shadow effect for depth
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5, // Android shadow
  },
  modalTitle: {
    fontSize: 20, // Increased font size for title
    fontWeight: "bold",
    color: "#333", // Darker color for better readability
    marginBottom: 15, // Increased spacing below the title
  },
  modalContent: {
    fontSize: 16, // Slightly larger font for content
    color: "#666", // Lighter text color for content
    textAlign: "center", // Centering the content
    marginBottom: 25, // Increased spacing for better separation
  },
  closeButton: {
    backgroundColor: "#3366FF",
    paddingVertical: 12, // Larger padding for better touch target
    paddingHorizontal: 20, // Added horizontal padding for button
    borderRadius: 8, // Rounded corners for button
    alignItems: "center",
    width: "100%", // Full width for the close button
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 18, // Larger font for button text
    fontWeight: "600", // Slightly bolder text
  },
});
