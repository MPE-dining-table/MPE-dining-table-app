import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import SignupScreen from './components/SignupScreen';
import LoginScreen from './components/LoginScreen';
import ProfileScreen from './components/ProfileScreen';
import FavoritesScreen from './components/FavoritesScreen';
import RestaurantScreen from './components/RestaurantScreen';
import BookTableScreen from './components/BookTableScreen';
import SearchScreen from './components/SearchScreen'; // Ensure SearchScreen is imported
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faSearch, faUser, faHeart } from '@fortawesome/free-solid-svg-icons';

const Stack = createStackNavigator();

// Footer component
const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <FontAwesomeIcon icon={faHome} size={24} color="red" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Search')}>
        <FontAwesomeIcon icon={faSearch} size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <FontAwesomeIcon icon={faUser} size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
        <FontAwesomeIcon icon={faHeart} size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

// Layout component to wrap all screens with the Footer
const ScreenLayout = ({ children }) => (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      {children}
    </View>
    <Footer />
  </SafeAreaView>
);

// App component
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home">
          {props => (
            <ScreenLayout>
              <HomeScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Signup">
          {props => (
            <ScreenLayout>
              <SignupScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {props => (
            <ScreenLayout>
              <LoginScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {props => (
            <ScreenLayout>
              <ProfileScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Favorites">
          {props => (
            <ScreenLayout>
              <FavoritesScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Restaurant">
          {props => (
            <ScreenLayout>
              <RestaurantScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="BookTable">
          {props => (
            <ScreenLayout>
              <BookTableScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Search">
          {props => (
            <ScreenLayout>
              <SearchScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footerContainer: {
    backgroundColor: '#F5DEB3',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#C0C0C0',
  },
});

export default App;

