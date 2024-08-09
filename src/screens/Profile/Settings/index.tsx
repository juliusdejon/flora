import React, { useContext } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Page from '../../../components/Page';
import TopActions from '../../../components/TopActions';
import { ThemeContext } from '../../../contexts/ThemeContext';

const faceShapeIcon = require('../../../../assets/images/face-shapes/oval.png');
const hairColorIcon = require('../../../../assets/images/hair-colors/hair-color.png');
const hairLengthIcon = require('../../../../assets/images/hair-length/medium.png');
const hairTypeIcon = require('../../../../assets/images/hair-type/hair-type.png');

import { INavigation } from '../../../types';

interface SettingsProps extends INavigation {}

const Settings: React.FC<SettingsProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);

  const icons: Record<string, any> = {
    'face-shape': faceShapeIcon,
    'hair-color': hairColorIcon,
    'hair-length': hairLengthIcon,
    'hair-type': hairTypeIcon,
  };

  const settingsCards = [
    {
      id: 1,
      name: 'Face Shape',
      image: 'face-shape',
      backgroundColor: 'secondary',
      screen: 'FaceShapeForm',
    },
    {
      id: 2,
      name: 'Hair Color',
      image: 'hair-color',
      backgroundColor: 'secondary',
      screen: 'HairColorForm',
    },
    {
      id: 3,
      name: 'Hair Length',
      image: 'hair-length',
      backgroundColor: 'secondary',
      screen: 'HairLengthForm',
    },
    {
      id: 4,
      name: 'Hair Type',
      image: 'hair-type',
      backgroundColor: 'secondary',
      screen: 'HairTypeForm',
    },
  ];

  return (
    <Page backgroundColor={theme.palette.common.white}>
      <TopActions navigation={navigation} />

      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Text style={theme.typography.h2}>Settings</Text>
        <View style={{ paddingVertical: 5 }} />
        <View
          style={{
            paddingVertical: 20,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 20,
          }}>
          {settingsCards.map((setting, index) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(setting.screen);
              }}
              key={index}>
              <View
                style={{
                  height: 160,
                  width: 160,
                  borderRadius: 10,
                  borderWidth: 0.5,
                  justifyContent: 'center',
                  gap: 5,
                  alignItems: 'center',
                }}>
                <Image
                  source={icons[setting.image]}
                  style={{
                    height: 120,
                    width: 110,
                  }}
                  resizeMode="contain"
                />
                <Text style={theme.typography.h4}>{setting.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Page>
  );
};

export default Settings;
