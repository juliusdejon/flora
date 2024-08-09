import { Dimensions, StyleSheet, View, Text } from 'react-native';
import React from 'react';
const screenHeight = Dimensions.get('window').height;

const BottomView = ({
  children,

  // 0.2 = 20% of the view height
  heightPercentage = 0.2,
}: any) => {
  // const desiredHeight = screenHeight * heightPercentage;
  return (
    <View
      style={{
        ...styles.bottomViewContainer,
        // height: 2,
        flex: heightPercentage,
      }}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomViewContainer: {
    width: '100%',
    backgroundColor: 'white',
    position: 'relative',
    borderRadius: 25,
  },
});

export default BottomView;
