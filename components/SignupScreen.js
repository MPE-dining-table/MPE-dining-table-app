import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import logo from "../assets/Mpelogo.png";

export default function SignupScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cellphone: "",
    password: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setUserInfo({ ...userInfo, [key]: value });
  };

  const validate = () => {
    let errors = {};
    if (!userInfo.firstName || userInfo.firstName.length < 3 || userInfo.firstName.length > 20 || /\d/.test(userInfo.firstName)) {
      errors.firstName = "Name must be 3-20 letters and contain no numbers";
    }
    if (!userInfo.lastName || userInfo.lastName.length < 3 || userInfo.lastName.length > 20 || /\d/.test(userInfo.lastName)) {
      errors.lastName = "Surname must be 3-20 letters and contain no numbers";
    }
    if (!userInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      errors.email = "Invalid email format";
    }
    if (!userInfo.cellphone || !/^\d{10}$/.test(userInfo.cellphone)) {
      errors.cellphone = "Cell number must be 10 digits";
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!userInfo.password || !passwordRegex.test(userInfo.password)) {
      errors.password = "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      const formattedCellNumber = "+27" + userInfo.cellphone.substring(1);
      const newUser = { ...userInfo, cellphone: formattedCellNumber };

      try {
        const response = await axios.post("https://mpe-backend-server.onrender.com/api/auth/register", newUser);
        Alert.alert("Success", "User registered successfully!");
        console.log("API Response:", response.data);

        // After successful registration, navigate to the login screen
        navigation.navigate('Login');

        // Reset form and errors after redirect
        setUserInfo({
          firstName: "",
          lastName: "",
          email: "",
          cellphone: "",
          password: "",
          role: "user",
        });
        setErrors({});
      } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        Alert.alert("Error", error.response?.data?.message || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.formContainer}> */}
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Signup</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Firstname"
          onChangeText={(text) => handleChange("firstName", text)}
          value={userInfo.firstName}
        />
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Surname"
          onChangeText={(text) => handleChange("lastName", text)}
          value={userInfo.lastName}
        />
        {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => handleChange("email", text)}
          value={userInfo.email}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Cellphone"
          onChangeText={(text) => handleChange("cellphone", text)}
          value={userInfo.cellphone}
        />
        {errors.cellphone && <Text style={styles.errorText}>{errors.cellphone}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => handleChange("password", text)}
          value={userInfo.password}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      {/* </View> */}
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
    elevation: 8, // Adds Android shadow
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
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
  button: {
    width: "60%", // Ensures the button width is set to 60% of its container
    alignSelf: "center", // Centers the button horizontally within its container
    backgroundColor: '#3A6EA5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#3366FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Adds Android shadow
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  errorText: {
    color: "#FF4D4F",
    fontSize: 12,
    marginBottom: 8,
    alignSelf: "flex-start",
    width: "100%",
  },
});
