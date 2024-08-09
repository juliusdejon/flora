import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Config from '../config';

export const baseURL = `${Config.API_V1_URL}`;
export const imageUrl = `${baseURL}/images`;

export const createAxiosInstance = async () => {
  const token = await AsyncStorage.getItem('authToken');

  const instance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return instance;
};
