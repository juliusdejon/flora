import axios, { AxiosResponse } from 'axios';
import { createAxiosInstance } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../hooks/useSnackbar';
import Config from '../config';

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ICart, IOrder } from '../types';

type Variation = {
  attribute: string;
  value: string;
};

type AddToCartProps = {
  id: number;
  quantity: number;
  variations?: Variation[];
};

type UpdateOrderProps = {
  id: number;
  set_paid: boolean;
  transaction_id: string;
};

interface CartContextProps {
  cartData: ICart | undefined;
  loading: boolean;
  error: Error | null | unknown;
  addToCart: (addToCartProps: AddToCartProps) => Promise<void>;
  removeCoupon: (couponCode: string) => Promise<void>;
  applyCouponCode: (couponCode: string) => Promise<void>;
  placeOrder: (order: IOrder) => Promise<[Error | null, any]>;
  updateOrder: (updateOrder: UpdateOrderProps) => Promise<[Error | null, any]>;
  removeFromCart(key: string): Promise<void>;
  clearCartItems(): Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { authState } = useAuth();
  const userId = authState?.user?.id;
  const showSnackbar = useSnackbar();

  const [cartData, setCartData] = useState<ICart>();
  const [nonce, setNonce] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null | unknown>(null);

  const fetchCartItems = async () => {
    try {
      const apiClient = await createAxiosInstance();
      const response: AxiosResponse<ICart> = await apiClient.get(
        `/wp-json/wc/store/cart`,
      );
      setNonce(response.headers.nonce);
      setCartData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [userId, loading]);

  const addToCart = async (addToCart: AddToCartProps) => {
    try {
      const apiClient = await createAxiosInstance();

      const formData = new FormData();
      formData.append('id', addToCart.id);
      formData.append('quantity', addToCart.quantity);

      const response = await apiClient.post(
        `/wp-json/wc/store/cart/add-item`,
        formData,
        {
          headers: {
            'X-WC-Store-API-Nonce': nonce,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.data) {
        // showSnackbar('Added to cart');
        fetchCartItems();
      }
    } catch (error) {
      console.log('Error: ' + error);
      // @ts-ignore
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        showSnackbar(errorMessage);
      } else {
        // @ts-ignore
        showSnackbar(error?.message);
      }
    }
  };

  const applyCouponCode = async (code: string) => {
    try {
      const apiClient = await createAxiosInstance();
      const formData = new FormData();
      formData.append('code', code);
      const response = await apiClient.post(
        `/wp-json/wc/store/cart/apply-coupon`,
        formData,
        {
          headers: {
            'X-WC-Store-API-Nonce': nonce,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.data) {
        // showSnackbar('Added to cart');
        fetchCartItems();
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        showSnackbar(errorMessage);
        throw new Error(errorMessage);
      } else {
        // @ts-ignore
        showSnackbar(error?.message);
        // @ts-ignore
        throw new Error(error?.message);
      }
    }
  };

  const removeCoupon = async (code: string) => {
    try {
      const apiClient = await createAxiosInstance();
      const response = await apiClient.delete(
        `/wp-json/wc/store/cart/coupons/${code}`,
        {
          headers: {
            'X-WC-Store-API-Nonce': nonce,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.status == 204) {
        fetchCartItems();
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        showSnackbar(errorMessage);
        throw new Error(errorMessage);
      } else {
        // @ts-ignore
        showSnackbar(error?.message);
        // @ts-ignore
        throw new Error(error?.message);
      }
    }
  };

  const clearCartItems = async () => {
    try {
      const apiClient = await createAxiosInstance();
      const response = await apiClient.delete(`/wp-json/wc/store/cart/items`, {
        headers: {
          'X-WC-Store-API-Nonce': nonce,
        },
      });
      if (response.status == 200) {
        fetchCartItems();
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        showSnackbar(errorMessage);
        throw new Error(errorMessage);
      } else {
        // @ts-ignore
        showSnackbar(error?.message);
        // @ts-ignore
        throw new Error(error?.message);
      }
    }
  };

  const removeFromCart = async (key: string) => {
    try {
      const apiClient = await createAxiosInstance();
      const response = await apiClient.post(
        `/wp-json/wc/store/cart/remove-item`,
        { key },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-WC-Store-API-Nonce': nonce,
          },
        },
      );
      if (response.data) {
        // showSnackbar('Removed from cart');
        fetchCartItems();
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        showSnackbar(errorMessage);
      } else {
        // @ts-ignore
        showSnackbar(error?.message);
      }
    }
  };

  const placeOrder = async (order: IOrder): Promise<[Error | null, any]> => {
    try {
      const apiClient = await createAxiosInstance();
      const response = await apiClient.post(
        `/wp-json/wc/store/checkout`,
        { ...order },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-WC-Store-API-Nonce': nonce,
          },
        },
      );
      if (response.data) {
        return [null, response.data];
      } else {
        throw new Error('No response data');
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        return [errorMessage, null];
      } else {
        // @ts-ignore
        return [error?.message, null];
      }
    }
  };

  const updateOrder = async (
    updateOrder: UpdateOrderProps,
  ): Promise<[Error | null, any]> => {
    try {
      const response = await axios.put(
        `${Config.API_V1_URL}/wp-json/wc/v3/orders/${updateOrder.id}?${Config.WOO_REST_API_KEY}`,
        {
          set_paid: updateOrder.set_paid,
          transaction_id: updateOrder.transaction_id,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-WC-Store-API-Nonce': nonce,
            Authorization: '', // Remove the default Authorization header to use the apiKey instead
          },
        },
      );
      if (response.data) {
        return [null, response.data];
      } else {
        throw new Error('No response data');
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        return [errorMessage, null];
      } else {
        // @ts-ignore
        return [error?.message, null];
      }
    }
  };

  const contextValue: CartContextProps = {
    cartData,
    loading,
    addToCart,
    applyCouponCode,
    removeFromCart,
    removeCoupon,
    clearCartItems,
    placeOrder,
    updateOrder,
    error,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

export { CartProvider, useCart };
