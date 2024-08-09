import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as ExpoSplashScreen from 'expo-splash-screen';
import React, { useCallback } from 'react';
import { View, Text, Image } from 'react-native';
import * as Linking from 'expo-linking';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CartProvider } from './contexts/CartContext';
import { SnackbarProvider } from './hooks/useSnackbar';
import Category from './screens/Category';
import ForgotPassword from './screens/ForgotPassword';
import Health from './screens/Health';
import HomeStack from './screens/Home';
import Login from './screens/Login';
import Onboarding from './screens/Onboarding';
import Product from './screens/Product';
import FaceShapeForm from './screens/Profile/Settings/FaceShapeForm';
import HairColorForm from './screens/Profile/Settings/HairColorForm';
import HairLengthForm from './screens/Profile/Settings/HairLengthForm';
import HairTypeForm from './screens/Profile/Settings/HairTypeForm';
import Settings from './screens/Profile/Settings/index';
import Address from './screens/Profile/Address/index';
import Orders from './screens/Profile/Orders';
import Returns from './screens/Profile/Returns';
import Payment from './screens/Profile/Payment';
import Cart from './screens/Cart';
import Password from './screens/Profile/Password';
import ResetPassword from './screens/ResetPassword';
import Signup from './screens/Signup';
import VerifyEmail from './screens/VerifyEmail';
import VirtualCamera from './screens/VirtualCamera';
import Profile from './screens/Profile';
import Shipping from './screens/Cart/Shipping';
import PlaceOrder from './screens/Cart/PlaceOrder';
import PaymentMethods from './screens/Cart/PaymentMethods';
import AddNewCard from './screens/Cart/AddNewCard';
import EnterPromoCode from './screens/Cart/EnterPromoCode';
import Cljhair from './screens/Partners/Cljhair';
import RosaBeauty from './screens/Partners/RosaBeauty';
import { StripeProvider } from '@stripe/stripe-react-native';
import Config from './config';

const Root = () => {
  const [fontsLoaded] = useFonts({
    'PlayfairDisplay-Regular': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'PlayfairDisplay-Bold': require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const Stack = createNativeStackNavigator();

  // Theme of React Native Paper Third Party Library
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors, // Keep the existing colors
      primary: '#472723', // Brown
      secondary: '#252529', // close to black
      tertiary: '#8A8A8F', // gray
    },
  };

  // deep linking for qr routing
  const prefix = Linking.createURL('/');

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Product: 'product/:productId',
      },
    },
  };

  const authenticatedScreens = [
    { name: 'Category', component: Category },
    { name: 'VirtualCamera', component: VirtualCamera },
    { name: 'Product', component: Product },
    { name: 'Profile', component: Profile },
    { name: 'Health', component: Health },
    { name: 'Address', component: Address },
    { name: 'Orders', component: Orders },
    { name: 'Returns', component: Returns },
    { name: 'Payment', component: Payment },
    { name: 'Password', component: Password },
    { name: 'Settings', component: Settings },
    { name: 'Cart', component: Cart },
    { name: 'Cljhair', component: Cljhair },
    { name: 'RosaBeauty', component: RosaBeauty },
    { name: 'Shipping', component: Shipping },
    { name: 'PlaceOrder', component: PlaceOrder },
    { name: 'PaymentMethods', component: PaymentMethods },
    { name: 'AddNewCard', component: AddNewCard },
    { name: 'EnterPromoCode', component: EnterPromoCode },
    { name: 'FaceShapeForm', component: FaceShapeForm },
    { name: 'HairColorForm', component: HairColorForm },
    { name: 'HairLengthForm', component: HairLengthForm },
    { name: 'HairTypeForm', component: HairTypeForm },
  ];

  const publicScreens = [
    { name: 'Onboarding', component: Onboarding },
    { name: 'Product', component: Product },
    { name: 'Login', component: Login },
    { name: 'Signup', component: Signup },
    { name: 'ForgotPassword', component: ForgotPassword },
    { name: 'VerifyEmail', component: VerifyEmail },
    { name: 'ResetPassword', component: ResetPassword },
  ];

  const Layout = () => {
    const { authState } = useAuth();

    const isAuthenticated = authState?.authenticated;

    if (authState?.loading) {
      return (
        <Image
          source={require('../assets/splash.png')}
          style={{
            resizeMode: 'contain',
            height: '100%',
            width: '100%',
          }}
        />
      );
    }

    return (
      <NavigationContainer
        linking={linking}
        fallback={
          <Image
            source={require('../assets/splash.png')}
            style={{
              resizeMode: 'contain',
              height: '100%',
              width: '100%',
            }}
          />
        }>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? 'HomeStack' : 'Onboarding'}
          screenOptions={{
            gestureEnabled: true, // Enable the swipe gesture
            gestureDirection: 'horizontal', // Set the swipe direction (optional)
          }}>
          {isAuthenticated ? (
            <Stack.Group>
              <Stack.Screen
                name="HomeStack"
                component={HomeStack}
                options={{ headerShown: false, gestureEnabled: false }}
              />
              {authenticatedScreens.map(screen => (
                <Stack.Screen
                  key={screen.name}
                  name={screen.name}
                  component={screen.component}
                  options={{ headerShown: false }}
                />
              ))}
            </Stack.Group>
          ) : (
            <Stack.Group>
              {publicScreens.map(screen => (
                <Stack.Screen
                  key={screen.name}
                  name={screen.name}
                  component={screen.component}
                  options={{ headerShown: false }}
                />
              ))}
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <ThemeProvider>
          <PaperProvider theme={theme}>
            <SnackbarProvider>
              <AuthProvider>
                <StripeProvider
                  publishableKey={`${Config.STRIPE_TEST_PUBLISHABLE_KEY}`}
                  // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
                  // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
                >
                  <UserProvider>
                    <WishlistProvider>
                      <CartProvider>
                        <Layout />
                      </CartProvider>
                    </WishlistProvider>
                  </UserProvider>
                </StripeProvider>
              </AuthProvider>
            </SnackbarProvider>
          </PaperProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </View>
  );
};

export default Root;
