import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Button } from 'react-native'; // Import Text and Button components
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import SignupScreen from './components/SignupScreen';
import LoginScreen from './components/LoginScreen';
import ProfileScreen from './components/ProfileScreen';
import FavoritesScreen from './components/FavoritesScreen';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faSearch, faUser, faHeart } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-native-modal';

const Stack = createStackNavigator();

// Footer Component
function Footer() {
  const navigation = useNavigation(); // Use the useNavigation hook to get the navigation object
  const [isHomeModalVisible, setHomeModalVisible] = useState(false);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isFavoritesModalVisible, setFavoritesModalVisible] = useState(false);

  const toggleHomeModal = () => setHomeModalVisible(!isHomeModalVisible);
  const toggleSearchModal = () => setSearchModalVisible(!isSearchModalVisible);
  const toggleProfileModal = () => setProfileModalVisible(!isProfileModalVisible);
  const toggleFavoritesModal = () => setFavoritesModalVisible(!isFavoritesModalVisible);

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={toggleHomeModal}>
        <FontAwesomeIcon icon={faHome} size={24} color="red" />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleSearchModal}>
        <FontAwesomeIcon icon={faSearch} size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleProfileModal}>
        <FontAwesomeIcon icon={faUser} size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleFavoritesModal}>
        <FontAwesomeIcon icon={faHeart} size={24} color="white" />
      </TouchableOpacity>

      <Modal isVisible={isHomeModalVisible} onBackdropPress={toggleHomeModal}>
        <View style={styles.modalContent}>
          <Text>Home Modal</Text>
          <Button title="Close" onPress={toggleHomeModal} />
        </View>
      </Modal>

      <Modal isVisible={isSearchModalVisible} onBackdropPress={toggleSearchModal}>
        <View style={styles.modalContent}>
          <Text>Search Modal</Text>
          <Button title="Close" onPress={toggleSearchModal} />
        </View>
      </Modal>

      <Modal isVisible={isProfileModalVisible} onBackdropPress={toggleProfileModal}>
        <View style={styles.modalContent}>
          <Text>Profile Modal</Text>
          <Button title="Close" onPress={toggleProfileModal} />
        </View>
      </Modal>

      <Modal isVisible={isFavoritesModalVisible} onBackdropPress={toggleFavoritesModal}>
        <View style={styles.modalContent}>
          <Text>Favorites Modal</Text>
          <Button title="Close" onPress={toggleFavoritesModal} />
        </View>
      </Modal>
    </View>
  );
}

// Main App
export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
        </Stack.Navigator>
        {/* Global Footer */}
        <Footer />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#F5DEB3', // Light brown
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#C0C0C0',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});