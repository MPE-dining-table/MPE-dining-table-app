import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const FavoritesScreen = () => {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFavorites = async () => {
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
        Alert.alert("Error fetching favorites", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      navigation.navigate("Login");
    } else {
      fetchFavorites();
    }
  }, [user]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderItem = ({ item }) => (
    <View style={styles.restaurantItem}>
      <Image
        source={{ uri: item.restaurant.image }}
        style={styles.restaurantImage}
      />
      <View style={styles.restaurantDetails}>
        <Text style={styles.restaurantName}>{item.restaurant.restaurantName}</Text>
        {/* <View style={styles.ratingContainer}>
          {[...Array(item.restaurant.rating)].map((_, index) => (
            <FontAwesomeIcon key={index} icon={faStar} size={20} color="gold" />
          ))}
        </View> */}
      </View>
      <FontAwesomeIcon
        icon={faHeart}
        size={24}
        color="red"
        style={styles.heartIcon}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteRestaurants}
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
    backgroundColor: "#EBEBEB",
    marginTop: 20,
  },
  listContainer: {
    padding: 16,
  },
  restaurantItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
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
    fontWeight: "bold",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  heartIcon: {
    marginLeft: 16,
  },
});

export default FavoritesScreen;
