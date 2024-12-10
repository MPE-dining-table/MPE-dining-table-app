import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';

const RestaurantScreen = ({ route }) => {
  const navigation = useNavigation();
  const { restaurant } = route.params; // Get restaurant details from route params

  const [modalVisible, setModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState('');

  // Sample images for the carousel
  const images = [
    'https://via.placeholder.com/600/92c952',
    'https://via.placeholder.com/600/771796',
    'https://via.placeholder.com/600/24f355',
    'https://via.placeholder.com/600/d32776',
  ];

  const renderCarouselItem = ({ item }) => {
    return (
      <Image
        source={{ uri: item }}
        style={styles.carouselImage}
        resizeMode="cover"
      />
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Carousel for Restaurant Images */}
      <View style={styles.carouselContainer}>
        <Carousel
          data={images}
          renderItem={renderCarouselItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width}
          loop
          autoplay
        />
      </View>

      {/* Restaurant Name and Location */}
      <View style={styles.detailsContainer}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.location}>{restaurant.location}</Text>
      </View>

      {/* About and Review Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.linkText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.linkText}>Review</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Line */}
      <View style={styles.horizontalLine} />

      {/* Contact Information */}
      <View style={styles.contactContainer}>
        <View style={styles.contactItem}>
          <Ionicons name="call-outline" size={24} color="#555" />
          <Text style={styles.contactText}>{restaurant.phone}</Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="mail-outline" size={24} color="#555" />
          <Text style={styles.contactText}>{restaurant.email}</Text>
        </View>
      </View>

      {/* Horizontal Line */}
      <View style={styles.horizontalLine} />

      {/* Restaurant Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{restaurant.description}</Text>
      </View>

      {/* Book Table Button */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => navigation.navigate('ConfirmBookingScreen')}
      >
        <Text style={styles.bookButtonText}>Book Table</Text>
      </TouchableOpacity>

      {/* Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Leave a Review</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Write your review here..."
              multiline
              value={reviewText}
              onChangeText={(text) => setReviewText(text)}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  carouselContainer: {
    height: 250,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  linkText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  horizontalLine: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 16,
  },
  contactContainer: {
    paddingHorizontal: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  bookButton: {
    backgroundColor: '#F5DEB3', // Light brown
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    minHeight: 100,
  },
  modalButton: {
    backgroundColor: '#F5DEB3',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default RestaurantScreen;