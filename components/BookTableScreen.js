import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const BookTableScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://mpe-backend-server.onrender.com/api/actions/fetch-restuarents"
      );
      setRestaurants(response.data.restuarents); // Set restaurants data
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRes();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    // Implement search logic here if needed
  };

  const handleLocationPress = (location) => {
    alert(`Restaurant Location: ${location}`);
  };

  const handleAddPress = (restaurant) => {
    navigation.navigate("RestaurantScreen", { restaurant });
  };

  const handleImagePress = (restaurant) => {
    // console.log("Navigating to RestaurantScreen with:", restaurant);
    navigation.navigate("Restaurant", { restaurant });
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity
        accessibilityLabel={`View details of ${item.restuarentName}`}
        onPress={() => handleImagePress(item)}
      >
        <Image
          source={{ uri: item.image || "https://via.placeholder.com/150" }}
          style={styles.image}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.restaurantName}>{item.restuarentName}</Text>
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
    return <ActivityIndicator size="large" color="#FF6347" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={24}
          color="gray"
          style={styles.searchIcon}
        />
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
    backgroundColor: "#fff",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
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
    position: "relative",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  locationIcon: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  addIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default BookTableScreen;
