import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import * as Location from "expo-location";

const { width } = Dimensions.get("window");

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false);

  const cuisinesList = [
    "African",
    "Fast Foods",
    "Vegetarian",
    "Seafood",
    "Indian",
    "Mediterranean",
    "Healthy",
    "Grill",
    "Italian",
    "Japanese",
    "Continental",
  ];

  const fetchRes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://mpe-backend-server.onrender.com/api/actions/fetch-restuarents"
      );

      const sanitizedRestaurants = response.data.restuarents.map(
        (restaurant) => {
          let cuisineArray = [];

          if (typeof restaurant.cuisine === "string") {
            cuisineArray = restaurant.cuisine
              .split(",")
              .map((c) => c.trim().toLowerCase());
          } else if (Array.isArray(restaurant.cuisine)) {
            cuisineArray = restaurant.cuisine
              .map((c) => (typeof c === "string" ? c.trim().toLowerCase() : ""))
              .filter((c) => c);
          }

          const sanitized = {
            ...restaurant,
            cuisine: cuisineArray,
          };

          return sanitized;
        }
      );

      setRestaurants(sanitizedRestaurants);
    } catch (error) {
      console.log("Fetch Error:", error);
      Alert.alert("Error", "Failed to fetch restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRes();
  }, []);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Denied",
          "This app requires location access to find nearby restaurants."
        );
        setLocationPermission(false);
      } else {
        setLocationPermission(true);
        console.log("Location permission granted!");
      }
    };
    requestLocationPermission();
  }, []);

  useEffect(() => {
    const filtered = restaurants.filter((restaurant) => {
      const matchesSearch = restaurant.restaurantName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const cuisineToMatch = selectedCuisine.toLowerCase();
      const matchesCuisine =
        !selectedCuisine ||
        restaurant.cuisine.some(
          (c) =>
            c.toLowerCase().includes(cuisineToMatch) ||
            cuisineToMatch.includes(c.toLowerCase())
        );
      return matchesSearch && matchesCuisine;
    });

    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedCuisine, restaurants]);

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine === selectedCuisine ? "" : cuisine);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleLocationPress = (location) => {
    alert(`Restaurant Location: ${location}`);
  };

  const handleAddPress = (restaurant) => {
    navigation.navigate("Restaurant", { restaurant });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.restaurantCard}
      onPress={() => handleAddPress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.restaurantImage}
      />
      <View style={styles.cardOverlay} />
      
      <View style={styles.restaurantInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          {item.cuisine && item.cuisine.length > 0 && (
            <View style={styles.cuisineTag}>
              <Text style={styles.cuisineTagText}>
                {item.cuisine[0].charAt(0).toUpperCase() + item.cuisine[0].slice(1)}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.locationContainer}>
          <FontAwesome5 name="map-marker-alt" size={16} color="#FF6B6B" />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => handleAddPress(item)}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
          <FontAwesome5 name="arrow-right" size={12} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome5 name="search" size={50} color="#ccc" />
      <Text style={styles.emptyText}>No restaurants found</Text>
      <Text style={styles.emptySubText}>
        Try adjusting your search or cuisine filter
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Finding restaurants...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Restaurants</Text>
        <Text style={styles.headerSubtitle}>Discover delicious places to eat</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <FontAwesome5
          name="search"
          size={18}
          color="#6C63FF"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurants..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.cuisinesContainer}>
        <Text style={styles.cuisineLabel}>Cuisines</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={cuisinesList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleCuisineSelect(item)}
              style={[
                styles.cuisineItem,
                selectedCuisine === item && styles.selectedCuisine,
              ]}
            >
              <Text
                style={[
                  styles.cuisineText,
                  selectedCuisine === item && styles.selectedCuisineText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.cuisinesList}
        />
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'} found
        </Text>
      </View>

      <FlatList
        data={filteredRestaurants}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
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
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 56,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: "#1A1A2E",
  },
  cuisinesContainer: {
    marginBottom: 20,
  },
  cuisineLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 12,
  },
  cuisinesList: {
    paddingVertical: 4,
  },
  cuisineItem: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCuisine: {
    backgroundColor: "#6C63FF",
  },
  cuisineText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedCuisineText: {
    color: "white",
  },
  resultsContainer: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 20,
  },
  restaurantCard: {
    backgroundColor: "white",
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  restaurantInfo: {
    padding: 16,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  restaurantName: {
    color: "#1A1A2E",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  cuisineTag: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  cuisineTagText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationText: {
    color: "#4B5563",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  viewButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  viewButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4B5563",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
  },
});

export default SearchScreen;