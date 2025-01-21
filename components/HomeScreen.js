import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import Icon from 'react-native-vector-icons/FontAwesome';
import mpelogo from '../assets/Mpelogo.png';

export default function HomeScreen({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load fonts using useCallback to optimize performance
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  // Memoize the login handler
  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  // Memoize navigation handlers
  const handleBookTable = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const handleSignup = useCallback(() => {
    navigation.navigate('Signup');
  }, [navigation]);

  const handleLoginNav = useCallback(() => {
    navigation.navigate('Login');
    handleLogin();
  }, [navigation, handleLogin]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/backgroundimage.jpg')}  // Changed to local image
        style={styles.backgroundImage}
        accessibilityLabel="Background"
      />

      <View style={styles.overlay} />

      <View style={styles.contentContainer}>
        <Image 
          source={mpelogo} 
          style={styles.logo}
          accessibilityLabel="MPE Logo"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleBookTable}
          accessibilityLabel="Book Table"
          accessibilityRole="button"
        >
          <Icon name="calendar" size={20} color="white" style={styles.calendarIcon} />
          <Text style={styles.buttonText}>Book Table</Text>
        </TouchableOpacity>

        {!isLoggedIn && (
          <View style={styles.splitButton}>
            <TouchableOpacity
              style={[styles.smallButton, styles.leftButton]}
              onPress={handleSignup}
              accessibilityLabel="Sign Up"
              accessibilityRole="button"
            >
              <Text style={styles.splitButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.smallButton, styles.rightButton]}
              onPress={handleLoginNav}
              accessibilityLabel="Login"
              accessibilityRole="button"
            >
              <Text style={styles.splitButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#FF6700',

    paddingVertical: 15,
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
  calendarIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#EBEBEB',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
  },
  splitButton: {
    flexDirection: 'row',
    width: '80%',
    marginTop: 10,
  },
  smallButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  leftButton: {
    backgroundColor: '#3A6EA5',
    marginRight: 10,
  },
  rightButton: {
    backgroundColor: '#3A6EA5',

  },
  splitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
});