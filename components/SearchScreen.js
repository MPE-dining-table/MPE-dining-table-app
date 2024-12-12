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
          <Ionicons name="location-outline" size={24} color="blue" />
        </TouchableOpacity>
        <Text style={styles.locationText}>{item.location}</Text>
      </View>

      {/* Add Icon */}
      <TouchableOpacity
        style={styles.addIcon}
        onPress={() => handleAddPress(item)}
      >
        <Ionicons name="add-circle-outline" size={24} color="green" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
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
    backgroundColor: '#fff',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    top: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  listContainer: {
    paddingBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  textContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  restaurantName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: 'darkred', // Dark red color for the location name
    fontSize: 16,
    marginLeft: 5,
  },
  locationIcon: {
    padding: 5,
  },
  addIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default SearchScreen;