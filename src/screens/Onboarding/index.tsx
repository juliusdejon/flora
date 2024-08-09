import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

import FirstScreen from "./FirstScreen";
import SecondScreen from "./SecondScreen";
import ThirdScreen from "./ThirdScreen";
import FourthScreen from "./FourthScreen";

function OnboardingSubStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true, // Enable the swipe gesture
        gestureDirection: "horizontal", // Set the swipe direction (optional)
      }}
    >
      <Stack.Screen
        name="FirstScreen"
        component={FirstScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SecondScreen"
        component={SecondScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ThirdScreen"
        component={ThirdScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FourthScreen"
        component={FourthScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default OnboardingSubStackScreen;
