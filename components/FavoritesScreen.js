import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const FavoritesScreen = () => {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const navigation = useNavigation();

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://mpe-backend-server.onrender.com/api/actions/fetch-favorites",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFavoriteRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      Alert.alert(
        "Error", 
        "Unable to load your favorite restaurants. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login");
    } else {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveFavorite = async (id) => {
    try {
      await axios.delete(
        `https://mpe-backend-server.onrender.com/api/actions/remove-favorite/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the local state to remove the deleted favorite
      setFavoriteRestaurants(prevFavorites => 
        prevFavorites.filter(favorite => favorite._id !== id)
      );
      Alert.alert("Success", "Restaurant removed from favorites");
    } catch (error) {
      console.error("Error removing favorite:", error);
      Alert.alert("Error", "Failed to remove restaurant from favorites");
    }
  };

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate("Restaurant", { restaurant });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(item.restaurant)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.restaurant.image || "https://via.placeholder.com/150" }}
        style={styles.restaurantImage}
      />
      <View style={styles.cardOverlay} />
      
      <View style={styles.favoriteButton}>
        <TouchableOpacity
          onPress={() => handleRemoveFavorite(item._id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome5 name="heart" solid size={20} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.restaurant.restaurantName}</Text>
        
        {item.restaurant.cuisine && (
          <View style={styles.cuisineContainer}>
            <Text style={styles.cuisineText}>
              {Array.isArray(item.restaurant.cuisine) 
                ? item.restaurant.cuisine.join(', ') 
                : item.restaurant.cuisine}
            </Text>
          </View>
        )}
        
        {item.restaurant.address && (
          <View style={styles.locationContainer}>
            <FontAwesome5 name="map-marker-alt" size={14} color="#6B7280" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.restaurant.address}
            </Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => handleRestaurantPress(item.restaurant)}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
          <FontAwesome5 name="arrow-right" size={12} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="heart-broken" size={60} color="#E2E8F0" />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        You haven't added any restaurants to your favorites yet.
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate("Search")}
      >
        <Text style={styles.browseButtonText}>Browse Restaurants</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerSubtitle}>Your favorite restaurants</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading your favorites...</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteRestaurants}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  restaurantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  cuisineContainer: {
    marginBottom: 12,
  },
  cuisineText: {
    fontSize: 14,
    color: "#6B7280",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
    flex: 1,
  },
  viewButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  viewButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A2E",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default FavoritesScreen;