import React, { useContext } from 'react';
import { Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';
import Page from '../../components/Page';
import { INavigation } from '../../types';

type ImageName = 'cjHair' | 'rosaBeauty';

interface NavigationProps extends INavigation {}

const Partners = ({ navigation }: NavigationProps) => {
  const { theme } = useContext(ThemeContext);

  const scaleValues: Record<ImageName, Animated.Value> = {
    cjHair: new Animated.Value(1),
    rosaBeauty: new Animated.Value(1),
  };

  const handleImagePress = (imageName: ImageName) => {
    Animated.sequence([
      Animated.timing(scaleValues[imageName], {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValues[imageName], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (imageName === 'rosaBeauty') {
      navigation.navigate('RosaBeauty');
    } else if (imageName == 'cjHair') {
      navigation.navigate('Cljhair');
    }
  };

  return (
    <>
      <Page backgroundColor={theme.palette.background.primary}>
        <ScrollView style={{ paddingTop: 20, paddingHorizontal: 20 }}>
          <Text style={{ ...theme.typography.h2 }}>Partners</Text>

          <TouchableOpacity onPress={() => handleImagePress('cjHair')}>
            <Animated.Image
              source={require('../../../assets/images/partners/cj-hair-logo.jpg')}
              style={{
                width: '100%',
                height: 125,
                resizeMode: 'contain',
                borderRadius: 40,
                marginTop: 30,
                transform: [{ scale: scaleValues['cjHair'] }],
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleImagePress('rosaBeauty')}>
            <Animated.Image
              source={require('../../../assets/images/partners/rosa-beauty-logo.jpg')}
              style={{
                width: '100%',
                height: 125,
                resizeMode: 'contain',
                borderRadius: 40,
                marginTop: 10,
                transform: [{ scale: scaleValues['rosaBeauty'] }],
              }}
            />
          </TouchableOpacity>
        </ScrollView>
      </Page>
    </>
  );
};

export default Partners;
