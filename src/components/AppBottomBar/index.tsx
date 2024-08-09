import { FontAwesome5, Feather, FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';
import { Text, View, Dimensions } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';
import Home from '../../screens/Home/FirstScreen';
import Wishlist from '../../screens/Wishlist';
import Page from '../Page';
import Partners from '../../screens/Partners';
import Health from '../../screens/Health';
const Tab = createBottomTabNavigator();

interface IconConfig {
  [key: string]: () => React.ReactNode;
}

export default function AppBottomBar() {
  const { theme } = useContext(ThemeContext);

  // Calculate fontSize based on screen width
  const screenWidth = Dimensions.get('window').width;
  const fontSize = screenWidth * 0.03;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarLabel: () => null,
        tabBarIcon: ({ focused }) => {
          const size = 20;
          const color = focused
            ? theme.palette.text.primary
            : theme.palette.text.tertiary;
          const iconConfig: IconConfig = {
            Home: () => (
              <>
                <Feather name="home" size={size} color={color} />
                <Text style={{ fontSize, color }}>Home</Text>
              </>
            ),
            Shopping: () => (
              <>
                <Feather name="shopping-bag" size={size} color={color} />
                <Text style={{ fontSize, color }}>Cart</Text>
              </>
            ),
            Health: () => (
              <>
                <FontAwesome name="stethoscope" size={size} color={color} />
                <Text style={{ fontSize, color }}>Health</Text>
              </>
            ),
            Wishlist: () => (
              <>
                <Feather name="heart" size={size} color={color} />
                <Text style={{ fontSize, color }}>Wishlist</Text>
              </>
            ),
            Partners: () => (
              <>
                <FontAwesome5 name="handshake" size={size} color={color} />
                <Text style={{ fontSize: 12, color }}>Partners</Text>
              </>
            ),
          };
          const selectedIcon = iconConfig[route.name];
          return selectedIcon ? selectedIcon() : null;
        },
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      {/* <Tab.Screen
        name="Shopping"
        component={Shopping}
        options={{
          headerShown: false,
        }}
      /> */}
      <Tab.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Health"
        component={Health}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Partners"
        component={Partners}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function Shopping() {
  return (
    <Page>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Shopping</Text>
      </View>
    </Page>
  );
}
