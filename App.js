import "react-native-gesture-handler";

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Text,
  StatusBar,
  Platform,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome5 } from "@expo/vector-icons";

import HomeScreen from "./components/HomeScreen";
import SearchScreen from "./components/SearchScreen";
import BookTableScreen from "./components/BookTableScreen";
import FavoritesScreen from "./components/FavoritesScreen";
import LoginScreen from "./components/LoginScreen";
import ProfileScreen from "./components/ProfileScreen";
import SignupScreen from "./components/SignupScreen";
import RestaurantScreen from "./components/RestaurantScreen";
import BookingScreen from "./components/BookingScreen";
import ConfirmationScreen from "./components/ConfirmationScreen";
import PaymentScreen from "./components/PaymentScreen";

import { Provider } from "react-redux";
import { initializeStore, store } from "./redux/store";

const Stack = createStackNavigator();

// Splash Screen Component
const SplashScreen = () => {
  return (
    <View style={splashStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" translucent />
      <Image
        source={require("./assets/MPEnime.gif")}
        style={splashStyles.logo}
      />
      <Text style={splashStyles.tagline}>Delicious Food, Memorable Experience</Text>
    </View>
  );
};

// Footer component
const Footer = ({ activeScreen }) => {
  const navigation = useNavigation();

  const getIconColor = (screen) => {
    return activeScreen === screen ? "#6C63FF" : "#9CA3AF";
  };

  const getIconBackground = (screen) => {
    return activeScreen === screen ? styles.activeIconBackground : {};
  };

  const getIconLabel = (screen) => {
    return activeScreen === screen ? styles.activeIconLabel : styles.iconLabel;
  };

  return (
    <View style={styles.footerContainer}>
      {/* Home Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.footerButton}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, getIconBackground("Home")]}>
          <FontAwesome5 name="home" size={18} color={getIconColor("Home")} />
        </View>
        <Text style={getIconLabel("Home")}>Home</Text>
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Search")}
        style={styles.footerButton}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, getIconBackground("Search")]}>
          <FontAwesome5 name="search" size={18} color={getIconColor("Search")} />
        </View>
        <Text style={getIconLabel("Search")}>Search</Text>
      </TouchableOpacity>

      {/* Favorites Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Favorites")}
        style={styles.footerButton}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, getIconBackground("Favorites")]}>
          <FontAwesome5 name="heart" size={18} color={getIconColor("Favorites")} />
        </View>
        <Text style={getIconLabel("Favorites")}>Favorites</Text>
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.footerButton}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, getIconBackground("Profile")]}>
          <FontAwesome5 name="user" size={18} color={getIconColor("Profile")} />
        </View>
        <Text style={getIconLabel("Profile")}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

// Layout component to wrap all screens with the Footer
const ScreenLayout = ({ children, hideFooter = false }) => {
  const navigation = useNavigation();
  const activeScreen =
    navigation.getState().routes[navigation.getState().index].name;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <View style={styles.container}>{children}</View>
      {!hideFooter && <Footer activeScreen={activeScreen} />}
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

  // Define screens that should hide the footer
  const screensWithoutFooter = ["BookingScreen", "ConfirmationScreen", "PaymentScreen"];

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
            <ScreenLayout hideFooter={true}>
              <BookingScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        {/* Payment and Confirmation Screens */}
        <Stack.Screen name="PaymentScreen">
          {(props) => (
            <ScreenLayout hideFooter={true}>
              <PaymentScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        <Stack.Screen name="ConfirmationScreen">
          {(props) => (
            <ScreenLayout hideFooter={true}>
              <ConfirmationScreen {...props} />
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

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  tagline: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 20,
    textAlign: "center",
  }
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },
  footerButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  activeIconBackground: {
    backgroundColor: "#EEF2FF",
  },
  iconLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  activeIconLabel: {
    fontSize: 12,
    color: "#6C63FF",
    fontWeight: "500",
  },
});