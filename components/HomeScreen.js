import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import Icon from 'react-native-vector-icons/FontAwesome';
import mpelogo from '../assets/Mpelogo.png';

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={{ uri: 'https://i.pinimg.com/736x/86/6c/d2/866cd2867f9f2b7e6e3594fb1b8230dd.jpg' }}
        style={styles.backgroundImage}
      />

      {/* Gradient Overlay */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Logo */}
        <Image source={mpelogo} style={styles.logo} />

        {/* Search Input
        <View style={styles.inputContainer}>
          <Icon name="search" size={20} color="#555" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search Restaurants"
            placeholderTextColor="#555"
          />
        </View> */}

        {/* Book Table Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BookTable')}
        >
          <Icon name="calendar" size={20} color="white" style={styles.calendarIcon} />
          <Text style={styles.buttonText}>Book Table</Text>
        </TouchableOpacity>

        {/* Split Buttons */}
        <View style={styles.splitButton}>
          <TouchableOpacity
            style={[styles.smallButton, styles.leftButton]}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.splitButtonText}>Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.smallButton, styles.rightButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.splitButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Gradient overlay for better readability
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 30,
    width: '80%',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    padding: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FF6347', // Tomato color for a modern look
    paddingVertical: 15,
    bottom: 30,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#FF6347',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookTableButton: {
    backgroundColor: 'navy', // Navy blue color for the Book Table button
  },
  calendarIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
  },
  splitButton: {
    flexDirection: 'row',
    width: '80%',
  },
  smallButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  leftButton: {
    backgroundColor: '#4CAF50', // Green color
    marginRight: 10,
  },
  rightButton: {
    backgroundColor: '#2196F3', // Blue color
  },
  splitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
});