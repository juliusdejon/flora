import { Text, View, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext } from "react";
import Page from "../../components/Page";
import { ThemeContext } from "../../contexts/ThemeContext";

const ThirdScreen = ({
  navigation
}: any) => {
  const { theme } = useContext(ThemeContext);
  const { width } = Dimensions.get("window");
  const imageWidth = width * 1; // Adjust as needed
  const imageHeight = imageWidth * (20 / 16); // Maintain the aspect ratio

  return (
    <Page backgroundColor={theme.palette.background.primary}>
      <View
        style={{
          flex: 0.7,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../../assets/images/ThirdPageImage.jpg")}
          style={{
            width: imageWidth,
            height: imageHeight,
            overflow: "visible",
          }}
        />
      </View>
      <View
        style={{
          flex: 0.3,
          marginTop: 40,
          alignItems: "center",
        }}
      >
        <Text style={theme.typography.h1}>Virtually Try-on</Text>
        <View style={{ margin: theme.spacing.unit * 2 }}>
          <Text
            style={{
              ...theme.typography.default,
              textAlign: "center",
              paddingHorizontal: 32,
              fontSize: 16,
            }}
          >
            Try out the very best products anywhere in real-time
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 0.1,
          alignItems: "flex-end",
          justifyContent: "center",
          marginRight: theme.spacing.unit,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("FourthScreen")}
          hitSlop={theme.hitSlop}
        >
          <Text style={{ ...theme.typography.default, paddingRight: 32 }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </Page>
  );
};

export default ThirdScreen;
