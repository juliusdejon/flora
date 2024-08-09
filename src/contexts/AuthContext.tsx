import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Config from '../config';
import { IUser } from '../types';

const baseURL = `${Config.API_V1_URL}`;

type RegisterValues = {
  email: string;
  password: string;
};

type LoginValues = {
  email: string;
  password: string;
};
type AuthState = {
  user: IUser | null;
  token: string | null;
  authenticated: boolean | null;
  loading: boolean;
};
type AuthProps = {
  authState?: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  login: (values: LoginValues, formikActions: any) => Promise<void>;
  register: (
    values: RegisterValues,
    formikActions: any,
    setErrorMessage: (val: string) => void,
  ) => Promise<void>;
  logout: () => Promise<any>;
  errorMessage: string;
};

const AuthContext = createContext<AuthProps | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: null,
    user: null,
    loading: true,
  });

  // Checking if the user is authenticated
  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const [error, data] = await me(token);
        if (error) logout();
        if (data) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setAuthState({
            user: data,
            token,
            authenticated: true,
            loading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          token: null,
          authenticated: null,
          loading: false,
        });
      }
    };
    loadToken();
  }, []);

  // Decoding the token in server-side and receiving user credentials
  const me = async (token: string | null) => {
    if (token) {
      try {
        const response = await axios.get(`${baseURL}/wp-json/wp/v2/users/me`, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        const customerResponse = await axios.get(
          `${baseURL}/wp-json/wc/v2/customers/${response.data.id}?${Config.WOO_REST_API_KEY}`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: '', // Remove the default Authorization header to use the apiKey instead
              'Content-Type': 'application/json', // Set the Content-Type header
            },
          },
        );
        if (response.data) {
          return [null, { ...customerResponse.data, ...response.data }];
        }
      } catch (error) {
        return [error];
      }
    }
    return [null];
  };

  const register = async (
    values: RegisterValues,
    formikActions: any,
    setErrorMessage: (val: string) => void,
  ) => {
    setErrorMessage('');
    try {
      const username = values.email.split('@')[0];
      const registerValues = {
        ...values,
        username,
        roles: ['customer'],
      };
      const response = await axios.post(
        `${baseURL}/wp-json/wp/v2/users`,
        registerValues,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data) {
        await login(
          {
            email: values.email,
            password: values.password,
          },
          formikActions,
        );
        formikActions.resetForm();
      }
    } catch (error) {
      console.log(error);
      if (error) {
        // @ts-ignore
        const errorMsg = error?.response?.data?.errors?.[0]?.msg;
        // @ts-ignore
        const errorMessage = error?.response?.data?.message;
        if (errorMsg) {
          console.log('error', errorMsg);
          setErrorMessage(errorMsg);
        } else if (errorMessage) {
          console.log(errorMessage);
          setErrorMessage(errorMessage);
        }
      }
    }
    formikActions.setSubmitting(false);
  };

  const login = async (values: LoginValues, formikActions: any) => {
    const { email, password } = values;
    const userData = { username: email, password };
    setErrorMessage('');
    try {
      const response = await axios.post(
        `${baseURL}/wp-json/jwt-auth/v1/token`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.data) {
        const { token } = response.data;
        if (token) {
          const [, data] = await me(token);
          if (data) {
            setAuthState({
              user: data,
              token,
              authenticated: true,
              loading: false,
            });
            formikActions.resetForm();
          }
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          await AsyncStorage.setItem('authToken', token);
        }
      }
    } catch (error) {
      if (error) {
        // @ts-ignore
        const errorMsg = error?.response?.data?.errors?.[0]?.msg;
        // @ts-ignore
        const errorMessage = error?.response?.data?.message;
        if (errorMsg) {
          console.log(errorMsg);
          setErrorMessage(errorMsg);
        } else if (errorMessage) {
          console.log(errorMessage);
          setErrorMessage(errorMessage);
        }
      }
    }
    formikActions.setSubmitting(false);
  };

  const logout = async () => {
    // Delete token from storage
    await AsyncStorage.removeItem('authToken');

    // Update Http headers
    axios.defaults.headers.common['Authorization'] = '';

    // Reset Auth State
    setAuthState({
      user: null,
      token: null,
      authenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        logout,
        errorMessage,
        authState,
        setAuthState,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
