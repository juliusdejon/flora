import { useState } from 'react';
import Config from '../config';

const baseURL = `${Config.API_V1_URL}`;

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: any;
  isLoaded: boolean;
  fetchData: () => Promise<void>;
};

interface UseFetchProps {
  initialUrl: string;
}

const useFetch = <T,>({ initialUrl }: UseFetchProps): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`${baseURL}${initialUrl}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
      setIsLoaded(true);
    }
  };
  return { data, loading, error, isLoaded, fetchData };
};

export default useFetch;
