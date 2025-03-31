import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold 
} from '@expo-google-fonts/poppins';
import Icon from 'react-native-vector-icons/FontAwesome5'; 
import mpelogo from '../assets/Mpelogo.png';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
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
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <Image
        source={require('../assets/backgroundimage.jpg')}
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

        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>Delicious Food, Memorable Experience</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleBookTable}
          accessibilityLabel="Book Table"
          accessibilityRole="button"
        >
          <Icon name="calendar-alt" size={18} color="white" style={styles.calendarIcon} />
          <Text style={styles.buttonText}>Book a Table</Text>
        </TouchableOpacity>

        {!isLoggedIn && (
          <View style={styles.authContainer}>
            <Text style={styles.authText}>Already have an account?</Text>
            <View style={styles.splitButton}>
              <TouchableOpacity
                style={[styles.smallButton, styles.leftButton]}
                onPress={handleSignup}
                accessibilityLabel="Sign Up"
                accessibilityRole="button"
              >
                <Icon name="user-plus" size={14} color="white" style={styles.buttonIcon} />
                <Text style={styles.splitButtonText}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, styles.rightButton]}
                onPress={handleLoginNav}
                accessibilityLabel="Login"
                accessibilityRole="button"
              >
                <Icon name="sign-in-alt" size={14} color="white" style={styles.buttonIcon} />
                <Text style={styles.splitButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#1A1A2E',
  },
  loadingText: {
    color: '#fff',
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 46, 0.75)', 
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  taglineContainer: {
    marginBottom: 40,
  },
  tagline: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: '#FF6B6B', 
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 40,
    elevation: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: {
    marginRight: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.5,
  },
  authContainer: {
    width: '90%',
    alignItems: 'center',
  },
  authText: {
    color: '#E2E2E2',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 16,
  },
  splitButton: {
    flexDirection: 'row',
    width: '100%',
  },
  smallButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    backgroundColor: '#4ECDC4', 
    marginRight: 10,
  },
  rightButton: {
    backgroundColor: '#6C63FF', 
  },
  splitButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
  },
});