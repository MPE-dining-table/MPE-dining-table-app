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
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {  FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import axios from "axios";

const { width } = Dimensions.get("window");

const StarRating = ({ rating, setRating, size = 28, interactive = true }) => {
  return (
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity 
          key={star} 
          onPress={() => interactive && setRating(star)}
          disabled={!interactive}
        >
          <FontAwesome5
            name={star <= rating ? "star" : "star"}
            solid={star <= rating}
            size={size}
            color={star <= rating ? "#FFD700" : "#E2E8F0"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const RestaurantScreen = ({ route }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user) || null;
  const token = useSelector((state) => state.user.token) || "";

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
  const [loading, setLoading] = useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
          ...restaurant,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFavorite(true);
      Alert.alert("Success", `${restaurant.restaurantName} added to favorites!`);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      Alert.alert("Error", "Unable to add to favorites. Please try again.");
    }
  };

  const handleBookTablePress = () => {
    if (user) {
      navigation.navigate("BookingScreen", { restaurant });
    } else {
      Alert.alert(
        "Sign In Required",
        "Please sign in to book a table",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => navigation.navigate("Login") }
        ]
      );
    }
  };

  const handleSubmitReview = () => {
    if (restaurantRating === 0) {
      Alert.alert("Error", "Please provide at least a restaurant rating");
      return;
    }
    
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
    
    Alert.alert("Thank You", "Your review has been submitted successfully!");
  };

  const openPhone = () => {
    if (restaurant.telephone && restaurant.telephone !== "No phone available") {
      Linking.openURL(`tel:${restaurant.telephone}`);
    } else {
      Alert.alert("Error", "No phone number available");
    }
  };

  const openEmail = () => {
    if (restaurant.email && restaurant.email !== "No email available") {
      Linking.openURL(`mailto:${restaurant.email}`);
    } else {
      Alert.alert("Error", "No email address available");
    }
  };

  const openMap = () => {
    if (restaurant.address && restaurant.address !== "No location provided") {
      const url = `https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`;
      Linking.openURL(url);
    } else {
      Alert.alert("Error", "No address available");
    }
  };

  const formatCuisine = (cuisine) => {
    if (!cuisine) return "Various";
    
    if (Array.isArray(cuisine)) {
      return cuisine.map(c => 
        typeof c === 'string' ? c.charAt(0).toUpperCase() + c.slice(1) : ''
      ).join(', ');
    }
    
    if (typeof cuisine === 'string') {
      return cuisine.split(',').map(c => 
        c.trim().charAt(0).toUpperCase() + c.trim().slice(1)
      ).join(', ');
    }
    
    return "Various";
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: restaurant.image || "https://via.placeholder.com/150" }}
            style={styles.image}
          />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5 name="arrow-left" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerSection}>
            <View style={styles.nameRow}>
              <Text style={styles.restaurantName}>{restaurant.restaurantName}</Text>
              <TouchableOpacity
                style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
                onPress={handleAddToFavorites}
              >
                <FontAwesome5 
                  name="heart" 
                  solid={isFavorite} 
                  size={18} 
                  color={isFavorite ? "#FFFFFF" : "#FF6B6B"} 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cuisineContainer}>
              <Text style={styles.cuisineText}>{formatCuisine(restaurant.cuisine)}</Text>
            </View>
            
            <View style={styles.ratingRow}>
              <StarRating rating={4} setRating={() => {}} size={16} interactive={false} />
              <Text style={styles.ratingText}>4.0 (120 reviews)</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Information</Text>
            
            <TouchableOpacity style={styles.infoItem} onPress={openMap}>
              <View style={styles.infoIconContainer}>
                <FontAwesome5 name="map-marker-alt" size={16} color="#6C63FF" />
              </View>
              <Text style={styles.infoText}>{restaurant.address}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.infoItem} onPress={openPhone}>
              <View style={styles.infoIconContainer}>
                <FontAwesome5 name="phone-alt" size={16} color="#4ECDC4" />
              </View>
              <Text style={styles.infoText}>{restaurant.telephone}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.infoItem} onPress={openEmail}>
              <View style={styles.infoIconContainer}>
                <FontAwesome5 name="envelope" size={16} color="#FF6B6B" />
              </View>
              <Text style={styles.infoText}>{restaurant.email}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutPreview} numberOfLines={3}>
              {restaurant.about || "No description available."}
            </Text>
            <TouchableOpacity 
              style={styles.readMoreButton}
              onPress={() => setAboutModalVisible(true)}
            >
              <Text style={styles.readMoreText}>Read More</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.actionSection}>
            <TouchableOpacity 
              style={styles.reviewButton}
              onPress={() => setReviewModalVisible(true)}
            >
              <FontAwesome5 name="star" size={16} color="#FFFFFF" />
              <Text style={styles.reviewButtonText}>Write a Review</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={handleBookTablePress}
            >
              <FontAwesome5 name="calendar-alt" size={16} color="#FFFFFF" />
              <Text style={styles.bookButtonText}>Book a Table</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* About Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={aboutModalVisible}
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About {restaurant.restaurantName}</Text>
              <TouchableOpacity onPress={() => setAboutModalVisible(false)}>
                <FontAwesome5 name="times" size={20} color="#1A1A2E" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.modalText}>{restaurant.about || "No description available."}</Text>
            </ScrollView>
            
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <FontAwesome5 name="times" size={20} color="#1A1A2E" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <Text style={styles.ratingLabel}>Restaurant Rating <Text style={styles.requiredStar}>*</Text></Text>
              <StarRating rating={restaurantRating} setRating={setRestaurantRating} />

              <Text style={styles.ratingLabel}>Service Rating</Text>
              <StarRating rating={serviceRating} setRating={setServiceRating} />

              <Text style={styles.ratingLabel}>Staff Rating</Text>
              <StarRating rating={staffRating} setRating={setStaffRating} />

              <Text style={styles.ratingLabel}>Your Review</Text>
              <TextInput
                style={styles.reviewInput}
                placeholder="Share your experience at this restaurant..."
                multiline
                value={reviewText}
                onChangeText={(text) => setReviewText(text)}
              />
            </ScrollView>
            
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSubmitReview}
            >
              <Text style={styles.modalButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A2E",
    flex: 1,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  favoriteButtonActive: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  cuisineContainer: {
    marginBottom: 12,
  },
  cuisineText: {
    fontSize: 16,
    color: "#6B7280",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#4B5563",
    flex: 1,
  },
  aboutSection: {
    marginBottom: 20,
  },
  aboutPreview: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
  },
  readMoreButton: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  readMoreText: {
    fontSize: 14,
    color: "#6C63FF",
    fontWeight: "500",
  },
  actionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reviewButton: {
    flex: 1,
    backgroundColor: "#4ECDC4",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  reviewButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  bookButton: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    maxHeight: "80%",
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalText: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A2E",
    marginTop: 16,
    marginBottom: 8,
  },
  requiredStar: {
    color: "#FF6B6B",
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    height: 120,
    textAlignVertical: "top",
    fontSize: 15,
    color: "#4B5563",
    backgroundColor: "#F8F9FA",
  },
});

export default RestaurantScreen;