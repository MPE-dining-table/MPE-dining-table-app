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
import Svg, { Path } from "react-native-svg";
import HomeScreen from "./components/HomeScreen";
import SearchScreen from "./components/SearchScreen";
import BookTableScreen from "./components/BookTableScreen";
import FavoritesScreen from "./components/FavoritesScreen";
import LoginScreen from "./components/LoginScreen";
import ProfileScreen from "./components/ProfileScreen";
import SignupScreen from "./components/SignupScreen";
import RestaurantScreen from "./components/RestaurantScreen";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";

import { Provider } from "react-redux";
import { initializeStore, store } from "./redux/store";

const Stack = createStackNavigator();

// Splash Screen Component
const SplashScreen = () => {
  return (
    <View style={splashStyles.container}>
      <Image
        source={require("./assets/MPEnime.gif")} // Replace with your splash logo
        style={splashStyles.logo}
      />
      {/* <Text style={splashStyles.text}>Welcome to MyApp</Text> */}
    </View>
  );
};

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  logo: {
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
  text: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

// Footer component
const Footer = ({ activeScreen }) => {
  const navigation = useNavigation();

  const getIconColor = (screen) => {
    return activeScreen === screen ? "#FF6347" : "#888"; // Active: Tomato, Inactive: Gray
  };

  return (
    <View style={styles.footerContainer}>
      {/* Home Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={[
          styles.footerButton,
          activeScreen === "Home" && styles.activeButton,
        ]}
      >
        {activeScreen === "Home" && (
          <Svg height={40} width={60} viewBox="0 0 60 40">
            <Path
              d="M0 20 Q30 0 60 20 L60 40 Q30 30 0 40 Z"
              fill="#FF6347" // Tomato color for active button
              strokeWidth={0}
            />
          </Svg>
        )}
        <FontAwesomeIcon icon={faHome} size={24} color={getIconColor("Home")} />
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Search")}
        style={[
          styles.footerButton,
          activeScreen === "Search" && styles.activeButton,
        ]}
      >
        {activeScreen === "Search" && (
          <Svg height={40} width={60} viewBox="0 0 60 40">
            <Path
              d="M0 20 Q30 0 60 20 L60 40 Q30 30 0 40 Z"
              fill="#FF6347"
              strokeWidth={0}
            />
          </Svg>
        )}
        <FontAwesomeIcon
          icon={faSearch}
          size={24}
          color={getIconColor("Search")}
        />
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={[
          styles.footerButton,
          activeScreen === "Profile" && styles.activeButton,
        ]}
      >
        {activeScreen === "Profile" && (
          <Svg height={40} width={60} viewBox="0 0 60 40">
            <Path
              d="M0 20 Q30 0 60 20 L60 40 Q30 30 0 40 Z"
              fill="#FF6347"
              strokeWidth={0}
            />
          </Svg>
        )}
        <FontAwesomeIcon
          icon={faUser}
          size={24}
          color={getIconColor("Profile")}
        />
      </TouchableOpacity>

      {/* Favorites Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Favorites")}
        style={[
          styles.footerButton,
          activeScreen === "Favorites" && styles.activeButton,
        ]}
      >
        {activeScreen === "Favorites" && (
          <Svg height={40} width={60} viewBox="0 0 60 40">
            <Path
              d="M0 20 Q30 0 60 20 L60 40 Q30 30 0 40 Z"
              fill="#FF6347"
              strokeWidth={0}
            />
          </Svg>
        )}
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
  const activeScreen =
    navigation.getState().routes[navigation.getState().index].name;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>{children}</View>
      <Footer activeScreen={activeScreen} />
    </SafeAreaView>
  );
};

// App component
const MainApp = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay for the splash screen
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds
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
        {/* Home Screen */}
        <Stack.Screen name="Home">
          {(props) => (
            <ScreenLayout>
              <HomeScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        {/* Signup Screen */}
        <Stack.Screen name="Signup">
          {(props) => (
            <ScreenLayout>
              <SignupScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        {/* Login Screen */}
        <Stack.Screen name="Login">
          {(props) => (
            <ScreenLayout>
              <LoginScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        {/* Profile Screen */}
        <Stack.Screen name="Profile">
          {(props) => (
            <ScreenLayout>
              <ProfileScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        {/* Favorites Screen */}
        <Stack.Screen name="Favorites">
          {(props) => (
            <ScreenLayout>
              <FavoritesScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        {/* Restaurant Screen */}
        <Stack.Screen name="Restaurant">
          {(props) => (
            <ScreenLayout>
              <RestaurantScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        {/* BookTable Screen */}
        <Stack.Screen name="BookTable">
          {(props) => (
            <ScreenLayout>
              <BookTableScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>

        {/* Search Screen */}
        <Stack.Screen name="Search">
          {(props) => (
            <ScreenLayout>
              <SearchScreen {...props} />
            </ScreenLayout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

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
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
  },

  footerContainer: {
    backgroundColor: "#F5F5F5", // Light gray background
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
    height: 60,
    position: "relative",
  },
  activeButton: {
    position: "relative",
    zIndex: 1,
  },
});
