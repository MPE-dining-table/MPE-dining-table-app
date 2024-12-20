import React, { useState } from "react";
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
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import Slider from "@react-native-community/slider";
import axios from "axios";

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

  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  // Review States
  const [reviewText, setReviewText] = useState("");
  const [restaurantRating, setRestaurantRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);

  const handleAddToFavorites = async () => {
    try {
      await axios.post(
        "https://mpe-backend-server.onrender.com/api/actions/add-favorites",
        { 
          ...restaurant 
        },        {
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

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: restaurant.image || "https://via.placeholder.com/150" }}
        style={styles.image}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>
        <Button title="Add to Favorites" onPress={handleAddToFavorites} />

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

      {/* Book Table Button */}
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
            <Text style={styles.modalTitle}>About {restaurant.name}</Text>
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

            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setReviewModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", marginTop: 30 },
  detailsContainer: { padding: 16 },
  restaurantName: { fontSize: 24, fontWeight: "bold", color: "#333" },
  location: { fontSize: 16, color: "#555", marginTop: 8 },
  cuisine: { fontSize: 16, color: "#555", marginTop: 8 },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  linkText: { fontSize: 16, color: "blue", textDecorationLine: "underline" },
  horizontalLine: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginVertical: 16,
  },
  contactContainer: { paddingHorizontal: 16 },
  contactItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  contactText: { fontSize: 16, color: "#555", marginLeft: 8 },
  contactLink: { color: "blue" }, // Set contact text color to blue
  bookButton: {
    backgroundColor: "#F5DEB3",
    padding: 16,
    alignItems: "center",
    margin: 16,
    borderRadius: 8,
  },
  bookButtonText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  modalText: { fontSize: 16, color: "#333", marginBottom: 8 },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    height: 100,
    marginTop: 8,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  modalButton: {
    backgroundColor: "#F5DEB3",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  modalButtonText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  modalCloseButton: { marginTop: 8 },
  modalCloseButtonText: { fontSize: 14, color: "red" },
  starContainer: { flexDirection: "row", marginVertical: 8 },
  ratingLabel: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  image: { width: "100%", height: 200, resizeMode: "cover" },
});

export default RestaurantScreen;
