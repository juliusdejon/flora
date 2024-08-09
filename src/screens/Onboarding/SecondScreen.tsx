import { Text, View, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext } from "react";
import Page from "../../components/Page";
import { ThemeContext } from "../../contexts/ThemeContext";

const SecondScreen = ({
  navigation
}: any) => {
  const { theme } = useContext(ThemeContext);
  const { width } = Dimensions.get("window");
  const imageWidth = width * 1; // Adjust as needed
  const imageHeight = imageWidth * (15 / 16); // Maintain the aspect ratio

  return (
    <Page
      backgroundColor={theme.palette.background.primary}
      statusBarBackgroundColor={theme.palette.common.white}
      bottomBarBackgroundColor={theme.palette.background.primary}
    >
      <View
        style={{
          flex: 0.7,
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: theme.palette.common.white,
        }}
      >
        <Image
          source={require("../../../assets/images/SecondPageImage.png")}
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />
      </View>
      <View
        style={{
          flex: 0.3,
          alignItems: "center",
          backgroundColor: theme.palette.background.primary,
        }}
      >
        <Text style={theme.typography.h1}>Exclusive Offers</Text>
        <View style={{ margin: theme.spacing.unit * 2 }}>
          <Text
            style={{
              ...theme.typography.default,
              textAlign: "center",
              paddingHorizontal: 32,
              fontSize: 16,
            }}
          >
            Get access to weekly exclusive product offers & deals
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 0.1,
          alignItems: "flex-end",
          justifyContent: "center",
          paddingRight: theme.spacing.unit,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("ThirdScreen")}
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

export default SecondScreen;
