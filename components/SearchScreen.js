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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Location from "expo-location"; // Import expo-location

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false); // Add state for permission

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

      console.log("Raw restaurant data:", response.data.restuarents[0]);
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

  // Request location permission on component mount
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
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => handleAddPress(item)}>
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/150" }}
          style={styles.image}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.restaurantName}>{item.restaurantName}</Text>
      </View>
      <View style={styles.locationContainer}>
        <TouchableOpacity
          style={styles.locationIcon}
          onPress={() => handleLocationPress(item.address)}
        >
          <Ionicons name="location-outline" size={24} color="#FF6347" />
        </TouchableOpacity>
        <Text style={styles.locationText}>{item.address}</Text>
      </View>
      <TouchableOpacity
        style={styles.addIcon}
        onPress={() => handleAddPress(item)}
      >
        <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={24}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurants..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Cuisines Filter */}
      <View style={styles.cuisinesContainer}>
        <Text style={styles.cuisineLabel}>Filter by Cuisine:</Text>
        <View style={styles.cuisinesList}>
          {cuisinesList.map((cuisine, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCuisineSelect(cuisine)}
              style={[
                styles.cuisineItem,
                selectedCuisine === cuisine && styles.selectedCuisine,
              ]}
            >
              <Text
                style={[
                  styles.cuisineText,
                  selectedCuisine === cuisine && styles.selectedCuisineText,
                ]}
              >
                {cuisine}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredRestaurants}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 16,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
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
    color: "#333",
  },
  listContainer: {
    paddingBottom: 16,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  textContainer: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  restaurantName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  locationContainer: {
    position: "absolute",
    bottom: 15,
    left: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  locationText: {
    color: "#333",
    fontSize: 16,
    marginLeft: 5,
  },
  locationIcon: {
    padding: 5,
  },
  addIcon: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
  },
  cuisinesContainer: {
    marginBottom: 20,
  },
  cuisineLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cuisinesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  cuisineItem: {
    marginRight: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCuisine: {
    backgroundColor: "#FF6347",
  },
  cuisineText: {
    color: "#333",
    fontSize: 14,
  },
  selectedCuisineText: {
    color: "white",
  },
});

export default SearchScreen;