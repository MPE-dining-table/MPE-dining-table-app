import React, { useState } from 'react';
import { View, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BookTableScreen = () => {
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

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: `https://via.placeholder.com/150?text=${item.name}` }}
        style={styles.image}
      />
      <TouchableOpacity
        style={styles.locationIcon}
        onPress={() => handleLocationPress(item.location)}
      >
        <Ionicons name="location-outline" size={24} color="blue" />
      </TouchableOpacity>
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
  locationIcon: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  addIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default BookTableScreen;