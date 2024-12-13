import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://i.pinimg.com/736x/86/6c/d2/866cd2867f9f2b7e6e3594fb1b8230dd.jpg' }} 
        style={styles.backgroundImage} 
      />
      <View style={styles.overlay}>
        {/* Logo Image */}
        <Image 
          source={{ uri: 'https://i.pinimg.com/736x/15/00/17/15001709fcddb79a0e3a654d2b1934b7.jpg' }} 
          style={styles.logo} 
        />
        
        {/* Book Table Button */}
        <TouchableOpacity 
          style={[styles.button, styles.bookTableButton]} // Apply navy blue style
          onPress={() => navigation.navigate('BookTable')} // Add navigation handler
        >
          <Icon name="calendar" size={20} color="white" style={styles.calendarIcon} />
          <Text style={styles.buttonText}>Book Table</Text>
        </TouchableOpacity>

        {/* Signup Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Signup')} // Add navigation handler
        >
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')} // Add navigation handler
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  backgroundImage: { 
    width: '100%', 
    height: '100%', 
    position: 'absolute',
    resizeMode: 'cover',
  },
  overlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    marginBottom: 20, // Add margin to position it above the buttons
  },
  button: { 
    backgroundColor: 'green', 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 5, 
    marginBottom: 20,
    elevation: 3,
    width: '80%', // Match the width of the search input
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
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center', // Center the text
  },
});