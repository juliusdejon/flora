import React, { useContext } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import Page from '../../components/Page';
import { ThemeContext } from '../../contexts/ThemeContext';

const FirstScreen = ({ navigation }: any) => {
  const { width } = Dimensions.get('window');
  const imageWidth = width * 0.8; // Adjust as needed
  const imageHeight = imageWidth * (20 / 16); // Maintain the aspect ratio

  const { theme } = useContext(ThemeContext);
  return (
    <Page
      backgroundColor={theme.palette.background.primary}
      statusBarBackgroundColor={theme.palette.background.primary}>
      <View
        style={{
          flex: 0.8,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../../assets/images/FirstPageLogo.png')}
          style={{
            width: imageWidth,
            height: imageHeight,
          }}
        />
      </View>
      <View
        style={{
          flex: 0.3,
          alignItems: 'center',
        }}>
        <Text style={theme.typography.h1}>Beauty Lives Here</Text>
        <View style={{ margin: theme.spacing.unit * 3 }}>
          <Text
            style={{
              ...theme.typography.default,
              textAlign: 'center',
              fontSize: 16,
              paddingHorizontal: 32,
            }}>
            Discover our latest beauty trends & product releases
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 0.1,
          alignItems: 'flex-end',
          justifyContent: 'center',
          marginRight: theme.spacing.unit,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SecondScreen')}
          hitSlop={theme.hitSlop}>
          <Text
            style={{
              ...theme.typography.default,
              paddingRight: 32,
            }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </Page>
  );
};

export default FirstScreen;
