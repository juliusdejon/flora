import { AxiosResponse } from 'axios';
import { createAxiosInstance } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IUser } from '../types';

interface UserContextProps {
  user: IUser | null;
  updateUserData: (user: any) => Promise<unknown[]>;
  loading: boolean;
  error: Error | null | unknown;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { authState } = useAuth();
  const userId = authState?.user?.id;

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null | unknown>(null);

  const fetchUserData = async () => {
    try {
      const apiClient = await createAxiosInstance();
      const response: AxiosResponse<IUser> = await apiClient.get(
        `/api/users/${userId}`,
      );
      setUser(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (data: any) => {
    try {
      const apiClient = await createAxiosInstance();
      const response: AxiosResponse<IUser> = await apiClient.patch(
        `/api/users/${userId}`,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      setUser(response.data);
      return [null, response.data];
    } catch (error) {
      console.log('error updating user', error);
      setError(error);
      return [error, null];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId, loading]);

  const contextValue: UserContextProps = {
    user,
    updateUserData,
    loading,
    error,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

const useUserData = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUserData };
