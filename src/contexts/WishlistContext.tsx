import { AxiosResponse } from 'axios';
import { baseURL, createAxiosInstance } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../hooks/useSnackbar';

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IProduct, IWishlist } from '../types';

interface WishlistContextProps {
  wishlistData: IProduct[];
  loading: boolean;
  error: Error | null | unknown;
  isLiked: (productId: string) => boolean;
  onLike: (product: IProduct) => Promise<void>;
  refetchWishlistData: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextProps | undefined>(
  undefined,
);

interface WishlistProviderProps {
  children: ReactNode;
}

const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { authState } = useAuth();
  const userId = authState?.user?.id;
  const showSnackbar = useSnackbar();

  const [wishlistData, setWishlistData] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null | unknown>(null);

  const fetchWishlistData = async () => {
    try {
      // const apiClient = await createAxiosInstance();
      // const response: AxiosResponse<IWishlist> = await apiClient.get(
      //   `/api/users/wishlist/${userId}`,
      // );
      // console.log(response);
      setWishlistData([]);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWishlistData();
      console.log(wishlistData);
    }
  }, [userId, loading]); // Fetch Wishlist data when the component mounts

  const onLike = async (product: IProduct) => {
    try {
      let nextProductsWishlist = [...wishlistData];
      if (wishlistData.some(productWish => productWish.id === product.id)) {
        nextProductsWishlist = nextProductsWishlist.filter(
          productWish => productWish.id !== product.id,
        );
        showSnackbar('Removed from wishlist');
      } else {
        nextProductsWishlist.push(product);
        showSnackbar('Added to wishlist');
      }

      // const apiClient = await createAxiosInstance();
      // const response = await apiClient.post(
      //   `${baseURL}/api/users/wishlist/${authState?.user?.id}`,
      //   { wishlists: nextProductsWishlist.map(p => p.id) },
      //   {
      //     headers: {
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //   },
      // );
      // console.log(response);
      // if (response.data) {
      setWishlistData(nextProductsWishlist);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const isLiked = (productId: string) => {
    if (productId) {
      return wishlistData.some(product => product.id === productId);
    }
    return false;
  };

  const contextValue: WishlistContextProps = {
    wishlistData,
    loading,
    error,
    refetchWishlistData: fetchWishlistData,
    isLiked,
    onLike,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

const useWishlistData = (): WishlistContextProps => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlistData must be used within a WishlistProvider');
  }
  return context;
};

export { WishlistProvider, useWishlistData };
