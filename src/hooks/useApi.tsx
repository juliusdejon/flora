import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useState } from 'react';
import { createAxiosInstance } from '../api/client';

interface UseApiProps<Data = any> {
  initialUrl: string;
  initialData?: Data | null;
}

interface UseApi<Data = any> {
  url: string;
  data: Data | null;
  loading: boolean;
  isLoaded: boolean;
  error: any; // You can replace 'any' with a more specific error type if needed
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  fetchData: () => Promise<void>;
  postData: (postData: any, config?: AxiosRequestConfig) => Promise<void>;
  refresh: () => void;
  // Add more functions for different HTTP methods as needed
}

const useApi = <Data = any,>({
  initialUrl,
  initialData = null,
}: UseApiProps<Data>): UseApi<Data> => {
  const [url, setUrl] = useState(initialUrl);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<any>(null); // Replace 'any' with a more specific error type if needed

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiClient = await createAxiosInstance();
      const response: AxiosResponse<Data> = await apiClient.get(url);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setIsLoaded(true);
    }
  };

  const refresh = () => {
    fetchData();
  };

  const postData = async (postData: any, config: AxiosRequestConfig = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<Data> = await axios.post(
        url,
        postData,
        config,
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Add more functions for different HTTP methods as needed

  return {
    url,
    data,
    isLoaded,
    loading,
    error,
    setUrl,
    fetchData,
    refresh,
    postData /* Add more functions here */,
  };
};

export default useApi;
