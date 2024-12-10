import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function SignupScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TextInput style={styles.input} placeholder="Firstname" />
      <TextInput style={styles.input} placeholder="Surname" />
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="+27 Mobile Number" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#87A2D8', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  input: { backgroundColor: 'white', padding: 10, borderRadius: 5, marginBottom: 10, width: '80%' },
  button: { backgroundColor: '#B18D61', padding: 10, borderRadius: 5 },
  buttonText: { color: 'white' },
});
