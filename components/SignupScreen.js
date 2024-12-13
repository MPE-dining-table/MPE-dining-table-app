import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";

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
    if (
      !userInfo.firstName ||
      userInfo.firstName.length < 3 ||
      userInfo.firstName.length > 20 ||
      /\d/.test(userInfo.firstName)
    ) {
      errors.firstName = "Name must be 3-20 letters and contain no numbers";
    }
    if (
      !userInfo.lastName ||
      userInfo.lastName.length < 3 ||
      userInfo.lastName.length > 20 ||
      /\d/.test(userInfo.lastName)
    ) {
      errors.lastName = "Surname must be 3-20 letters and contain no numbers";
    }
    if (!userInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      errors.email = "Invalid email format";
    }
    if (!userInfo.cellphone || !/^\d{10}$/.test(userInfo.cellphone)) {
      errors.cellphone = "Cell number must be 10 digits";
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!userInfo.password || !passwordRegex.test(userInfo.password)) {
      errors.password =
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      const formattedCellNumber = "+27" + userInfo.cellphone.substring(1);
      const newUser = { ...userInfo, cellphone: formattedCellNumber };

      try {
        const response = await axios.post(
          "https://mpe-backend-server.onrender.com/api/auth/register",
          newUser
        );
        Alert.alert("Success", "User registered successfully!");
        console.log("API Response:", response.data);

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
        Alert.alert(
          "Error",
          error.response?.data?.message ||
            "Something went wrong. Please try again."
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Firstname"
        onChangeText={(text) => handleChange("firstName", text)}
        value={userInfo.firstName}
      />
      {errors.firstName && (
        <Text style={styles.errorText}>{errors.firstName}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Surname"
        onChangeText={(text) => handleChange("lastName", text)}
        value={userInfo.lastName}
      />
      {errors.lastName && (
        <Text style={styles.errorText}>{errors.lastName}</Text>
      )}

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
      {errors.cellphone && (
        <Text style={styles.errorText}>{errors.cellphone}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => handleChange("password", text)}
        value={userInfo.password}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#87A2D8",
    alignItems: "center",
  },
  title: { fontSize: 20, marginBottom: 20 },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
  },
  button: { backgroundColor: "#B18D61", padding: 10, borderRadius: 5 },
  buttonText: { color: "white" },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },
});
