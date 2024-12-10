import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faStar } from '@fortawesome/free-solid-svg-icons';

const FavoritesScreen = () => {
  // Sample data for favorite restaurants
  const favoriteRestaurants = [
    { id: '1', name: 'Restaurant 1', image: 'https://via.placeholder.com/150', rating: 5 },
    { id: '2', name: 'Restaurant 2', image: 'https://via.placeholder.com/150', rating: 5 },
    { id: '3', name: 'Restaurant 3', image: 'https://via.placeholder.com/150', rating: 5 },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.restaurantItem}>
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantDetails}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(item.rating)].map((_, index) => (
            <FontAwesomeIcon key={index} icon={faStar} size={20} color="gold" />
          ))}
        </View>
      </View>
      <FontAwesomeIcon icon={faHeart} size={24} color="red" style={styles.heartIcon} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteRestaurants}
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
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  heartIcon: {
    marginLeft: 16,
  },
});

export default FavoritesScreen;