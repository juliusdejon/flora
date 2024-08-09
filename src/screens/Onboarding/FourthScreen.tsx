import { Text, View, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import Page from "../../components/Page";
import Button from "../../components/Button";
import { ThemeContext } from "../../contexts/ThemeContext";

const FourthScreen = ({
  navigation
}: any) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Page backgroundColor={theme.palette.common.white}>
      <View
        style={{
          flex: 0.05,
          justifyContent: "flex-start",
          alignItems: "flex-end",
          padding: 20,
        }}
      >
        <TouchableOpacity
          hitSlop={theme.hitSlop}
          onPress={() => navigation.navigate("Login")}
        >
          <Text>Log in</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 0.9,
          justifyContent: "center",
          gap: 50,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            ...theme.typography.default,
            color: theme.palette.text.primary,
            textAlign: "center",
          }}
        >
          Discover and shop
        </Text>
        <Text
          style={{
            ...theme.typography.h1,
            fontFamily: theme.font.PlayfairDisplayBold,
            color: theme.palette.text.primary,
            textAlign: "center",
            paddingHorizontal: 20,
          }}
        >
          The Best Beauty Trends
        </Text>
        <View
          style={{
            gap: 15,
          }}
        >
          <Button
            type="secondary"
            disabled
            onPress={() => {}}
          >
            Continue with Facebook
          </Button>
          <Button onPress={() => navigation.navigate("Signup")} type="primary">
            Continue with email
          </Button>
        </View>
      </View>
    </Page>
  );
};

export default FourthScreen;
