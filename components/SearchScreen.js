import React, { useState } from 'react';
import { View, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([
    { id: '1', name: 'Restaurant 1', location: 'Location 1' },
    { id: '2', name: 'Restaurant 2', location: 'Location 2' },
    { id: '3', name: 'Restaurant 3', location: 'Location 3' },
  ]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    // Implement search logic here if needed
  };

  const handleLocationPress = (location) => {
    alert(`Restaurant Location: ${location}`);
  };

  const handleAddPress = (restaurant) => {
    navigation.navigate('RestaurantScreen', { restaurant });
  };

  const handleImagePress = (restaurant) => {
    // Show an alert asking to sign up or log in
    Alert.alert(
      'Authentication Required',
      'Please sign up or log in to continue.',
      [
        {
          text: 'Sign Up',
          onPress: () => navigation.navigate('SignupScreen'), // Navigate to SignupScreen
        },
        {
          text: 'Log In',
          onPress: () => navigation.navigate('LoginScreen'), // Navigate to LoginScreen
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      {/* Wrap the Image in a TouchableOpacity for navigation */}
      <TouchableOpacity onPress={() => handleImagePress(item)}>
        <Image
          source={{ uri: `https://via.placeholder.com/150?text=${item.name}` }}
          style={styles.image}
        />
      </TouchableOpacity>

      {/* Restaurant Name */}
      <View style={styles.textContainer}>
        <Text style={styles.restaurantName}>{item.name}</Text>
      </View>

      {/* Location Icon with Location Name */}
      <View style={styles.locationContainer}>
        <TouchableOpacity
          style={styles.locationIcon}
          onPress={() => handleLocationPress(item.location)}
        >
          <Ionicons name="location-outline" size={24} color="#FF6347" />
        </TouchableOpacity>
        <Text style={styles.locationText}>{item.location}</Text>
      </View>

      {/* Add Icon */}
      <TouchableOpacity
        style={styles.addIcon}
        onPress={() => handleAddPress(item)}
      >
        <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurants..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={restaurants}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light gray background
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 16,
    marginBottom: 20,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  textContainer: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  restaurantName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationContainer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  locationText: {
    color: '#333', // Dark gray color for the location name
    fontSize: 16,
    marginLeft: 5,
  },
  locationIcon: {
    padding: 5,
  },
  addIcon: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default SearchScreen;