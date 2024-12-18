import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';

const RestaurantScreen = () => {
  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backArrow}>
        <Text style={styles.arrow}>&#8592;</Text>
      </TouchableOpacity>

      {/* Restaurant Name */}
      <Text style={styles.title}>Name of Restaurant</Text>

      {/* Buttons: Date, Pax, Time */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/747/747310.png' }}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Date</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Pax</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1038/1038870.png' }}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Time</Text>
        </TouchableOpacity>
      </View>

      {/* Special Request */}
      <Text style={styles.specialRequestLabel}>Special Request</Text>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder=""
      />

      {/* Confirm Booking Button */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Cornfim Booking</Text>
      </TouchableOpacity>

      {/* Cancel Link */}
      <TouchableOpacity>
        <Text style={styles.cancelText}>cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#759edb',
    padding: 20,
    justifyContent: 'flex-start',
  },
  backArrow: {
    marginBottom: 10,
  },
  arrow: {
    fontSize: 24,
    color: 'black',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    padding: 10,
    borderRadius: 8,
    width: '30%',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  specialRequestLabel: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textArea: {
    height: 120,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    textAlignVertical: 'top',
    padding: 10,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#b38e5d',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default RestaurantScreen;

