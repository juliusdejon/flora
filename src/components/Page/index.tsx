import { View, Platform, SafeAreaView as SafeAreaViewIOS } from "react-native";
import { SafeAreaView as SafeAreaViewAndroid } from "react-native-safe-area-context";
import React from "react";

const SafeAreaView = (props: any) => {
  // SafeAreaView of react-native is compatible with iphones
  // SafeAreaView of react-native-safe-area-context is compatible with Androids
  if (Platform.OS === "ios") {
    return <SafeAreaViewIOS {...props} />;
  } else {
    return <SafeAreaViewAndroid {...props} />;
  }
};

const Page = (props: any) => {
  const {
    backgroundColor = "white", // background color
    statusBarBackgroundColor, // status bar color
    bottomBarBackgroundColor, // bottom bar color
  } = props;

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {/* status bar */}
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: statusBarBackgroundColor || backgroundColor,
        }}
      />
      {/* content */}
      <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor }}>
        {props.children}
      </SafeAreaView>
      {/*  touch bar*/}
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: bottomBarBackgroundColor || backgroundColor,
        }}
      />
    </View>
  );
};

export default Page;
