import 'react-native-gesture-handler'; // Import this at the top of the file

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Text,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHome,
  faSearch,
  faUser,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import HomeScreen from "./components/HomeScreen";
import SearchScreen from "./components/SearchScreen";
import BookTableScreen from "./components/BookTableScreen";
import FavoritesScreen from "./components/FavoritesScreen";
import LoginScreen from "./components/LoginScreen";
import ProfileScreen from "./components/ProfileScreen";
import SignupScreen from "./components/SignupScreen";
import RestaurantScreen from "./components/RestaurantScreen";
import BookingScreen from "./components/BookingScreen";

import { Provider } from "react-redux";
import { initializeStore, store } from "./redux/store";

const Stack = createStackNavigator();

// Splash Screen Component
const SplashScreen = () => {
  return (
    <View style={splashStyles.container}>
      <Image
        source={require("./assets/MPEnime.gif")}
        style={splashStyles.logo}
      />
    </View>
  );
};

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DEB887",
  },
  logo: {
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
});

// Footer component
const Footer = ({ activeScreen }) => {
  const navigation = useNavigation();

  const getIconColor = (screen) => {
    return activeScreen === screen ? "#FF6347" : "#888";
  };

  return (
    <View style={styles.footerContainer}>
      {/* Home Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.footerButton}
      >
        <FontAwesomeIcon
          icon={faHome}
          size={24}
          color={getIconColor("Home")}
        />
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Search")}
        style={styles.footerButton}
      >
        <FontAwesomeIcon
          icon={faSearch}
          size={24}
          color={getIconColor("Search")}
        />
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.footerButton}
      >
        <FontAwesomeIcon
          icon={faUser}
          size={24}
          color={getIconColor("Profile")}
        />
      </TouchableOpacity>

      {/* Favorites Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Favorites")}
        style={styles.footerButton}
      >
        <FontAwesomeIcon
          icon={faHeart}
          size={24}
          color={getIconColor("Favorites")}
        />
      </TouchableOpacity>
    </View>
  );
};

// Layout component to wrap all screens with the Footer
const ScreenLayout = ({ children }) => {
  const navigation = useNavigation();
  const activeScreen = navigation.getState().routes[navigation.getState().index].name;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
      <Footer activeScreen={activeScreen} />
    </SafeAreaView>
  );
};

// MainApp component
const MainApp = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home">
          {(props) => (
            <ScreenLayout>
              <HomeScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen name="Signup">
          {(props) => (
            <ScreenLayout>
              <SignupScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen name="Login">
          {(props) => (
            <ScreenLayout>
              <LoginScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen name="Profile">
          {(props) => (
            <ScreenLayout>
              <ProfileScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen name="Favorites">
          {(props) => (
            <ScreenLayout>
              <FavoritesScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen name="Restaurant">
          {(props) => (
            <ScreenLayout>
              <RestaurantScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen name="BookTable">
          {(props) => (
            <ScreenLayout>
              <BookTableScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen name="Search">
          {(props) => (
            <ScreenLayout>
              <SearchScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen name="BookingScreen">
          {(props) => (
            <ScreenLayout>
              <BookingScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// App component
export default function App() {
  useEffect(() => {
    const prepareStore = async () => {
      await initializeStore();
    };

    prepareStore();
  }, []);

  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#DEB887",
  },
  container: {
    flex: 1,
  },
  footerContainer: {
    backgroundColor: "#DEB887",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  footerButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 40, // Adjusted for better alignment
  },
});


