import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';

// Dummy image URLs for the plate and fork/knife
const plateImage = 'https://example.com/plate.png'; // Replace with your image URL
const forkImage = 'https://example.com/fork.png'; // Replace with your image URL
const knifeImage = 'https://example.com/knife.png'; // Replace with your image URL

const ConfirmationScreen = () => {
  const [move] = useState(new Animated.Value(0)); // Animation for moving fork and knife

  // Function to animate the fork and knife
  const animateLoader = () => {
    Animated.loop(
      Animated.timing(move, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  useEffect(() => {
    animateLoader(); // Start the animation when the component mounts
  }, []);

  const translateX = move.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30], // Moving by 30 units on X axis
  });

  return (
    <View style={styles.container}>
      {/* Confirmation message */}
      <Text style={styles.confirmationText}>Your booking is confirmed!</Text>

      {/* Plate of food */}
      <View style={styles.plateContainer}>
        <Image source={{ uri: plateImage }} style={styles.plateImage} />
      </View>

      {/* Fork and Knife Loader */}
      <View style={styles.loaderContainer}>
        <Animated.Image
          source={{ uri: forkImage }}
          style={[styles.forkImage, { transform: [{ translateX }] }]}
        />
        <Animated.Image
          source={{ uri: knifeImage }}
          style={[styles.knifeImage, { transform: [{ translateX }] }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50', // Green color for confirmation
    marginBottom: 20,
  },
  plateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  plateImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  loaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150,
    marginTop: 20,
  },
  forkImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  knifeImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default ConfirmationScreen;
