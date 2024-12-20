import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";

const StarRating = ({ rating, setRating }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={28}
            color="#FFD700"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const RestaurantScreen = ({ route }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const { restaurant = {} } = route.params || {
    restaurant: {
      name: "Unknown Restaurant",
      address: "No location provided",
      telephone: "No phone available",
      email: "No email available",
      about: "No description available.",
      image: "https://via.placeholder.com/150",
      cuisine: "Various",
    },
  };

  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  // Review States
  const [reviewText, setReviewText] = useState("");
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);

  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://geocode.xyz/${address}?json=1&auth=114163668033352e15780839x4681`
      );
      const data = response.data;

      if (data.error) {
        console.error("Geocoding error:", data.error.description);
      } else {
        const { latt, longt } = data;
        setCoordinates({
          latitude: parseFloat(latt),
          longitude: parseFloat(longt),
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      await axios.post(
        "https://mpe-backend-server.onrender.com/api/actions/add-favorites",
        {
          ...restaurant,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert(`${restaurant.restaurantName} added to favorites!`);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("Failed to add to favorites. Please try again.");
    }
  };

  const handleBookTablePress = () => {
    if (user) {
      navigation.navigate("BookingScreen", { restaurant });
    } else {
      navigation.navigate("Login");
    }
  };

  const handleSubmitReview = () => {
    console.log("Review Submitted:", {
      reviewText,
      restaurantRating,
      serviceRating,
      staffRating,
    });
    // Reset Review Fields
    setReviewText("");
    setRestaurantRating(0);
    setServiceRating(0);
    setStaffRating(0);
    setReviewModalVisible(false);
    alert("Thank you for your review!");
  };

  const openPhone = () => {
    Linking.openURL(`tel:${restaurant.telephone}`);
  };

  const openEmail = () => {
    Linking.openURL(`mailto:${restaurant.email}`);
  };

  useEffect(() => {
    if (restaurant.address && restaurant.address !== "No location provided") {
      fetchCoordinates(restaurant.address);
    }
  }, [restaurant.address]);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: restaurant.image || "https://via.placeholder.com/150" }}
        style={styles.image}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleAddToFavorites}
        >
          <Ionicons name="heart" size={24} color="#FF6347" />
          <Text style={styles.favoriteButtonText}>Add to Favorites</Text>
        </TouchableOpacity>

        <Text style={styles.location}>{restaurant.address}</Text>
        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
      </View>

      {/* About and Review Buttons */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => setAboutModalVisible(true)}>
          <Text style={styles.linkText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setReviewModalVisible(true)}>
          <Text style={styles.linkText}>Review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.horizontalLine} />

      {/* Contact Info */}
      <View style={styles.contactContainer}>
        <TouchableOpacity style={styles.contactItem} onPress={openPhone}>
          <Ionicons name="call-outline" size={24} color="#555" />
          <Text style={[styles.contactText, styles.contactLink]}>
            {restaurant.telephone}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactItem} onPress={openEmail}>
          <Ionicons name="mail-outline" size={24} color="#555" />
          <Text style={[styles.contactText, styles.contactLink]}>
            {restaurant.email}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.horizontalLine} />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.activityIndicator}
        />
      ) : (
        coordinates && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={coordinates}
              title={restaurant.name}
              description={restaurant.address}
            />
          </MapView>
        )
      )}

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBookTablePress}
      >
        <Text style={styles.bookButtonText}>Book Table</Text>
      </TouchableOpacity>

      {/* About Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={aboutModalVisible}
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              About {restaurant.restaurantName}
            </Text>
            <Text style={styles.modalText}>{restaurant.about}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setAboutModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write a Review</Text>

            {/* Ratings */}
            <Text style={styles.ratingLabel}>Restaurant Rating:</Text>
            <StarRating
              rating={restaurantRating}
              setRating={setRestaurantRating}
            />

            <Text style={styles.ratingLabel}>Service Rating:</Text>
            <StarRating rating={serviceRating} setRating={setServiceRating} />

            <Text style={styles.ratingLabel}>Staff Rating:</Text>
            <StarRating rating={staffRating} setRating={setStaffRating} />

            {/* Review Text */}
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review here..."
              multiline
              value={reviewText}
              onChangeText={(text) => setReviewText(text)}
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSubmitReview}
            >
              <Text style={styles.modalButtonText}>Submit Review</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setReviewModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 20,
  },
  detailsContainer: {
    marginVertical: 16,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButtonText: {
    fontSize: 16,
    color: "#FF6347",
    marginLeft: 8,
  },
  location: {
    fontSize: 16,
    color: "#777",
    marginVertical: 4,
  },
  cuisine: {
    fontSize: 16,
    color: "#444",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  linkText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 16,
  },
  contactContainer: {
    marginVertical: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#555",
  },
  contactLink: {
    color: "#007BFF",
  },
  activityIndicator: {
    marginVertical: 16,
  },
  map: {
    width: "100%",
    height: 250,
    borderRadius: 12,
  },
  bookButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555",
  },
  modalButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    height: 100,
    backgroundColor: "#fff",
  },
  ratingLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});

export default RestaurantScreen;