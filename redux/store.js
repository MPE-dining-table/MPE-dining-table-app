import { configureStore } from '@reduxjs/toolkit';
import userReducer, { loadUser } from './userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export const initializeStore = async () => {
  const userData = await AsyncStorage.getItem('user');
  if (userData) {
    const parsedData = JSON.parse(userData);
    store.dispatch(loadUser(parsedData));
  }
};
