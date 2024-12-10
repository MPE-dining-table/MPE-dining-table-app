import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#87A2D8', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  input: { backgroundColor: 'white', padding: 10, borderRadius: 5, marginBottom: 10, width: '80%' },
  forgotPassword: { color: 'blue', marginBottom: 20 },
  button: { backgroundColor: '#B18D61', padding: 10, borderRadius: 5 },
  buttonText: { color: 'white' },
});
