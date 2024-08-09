import React, { useContext } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Page from '../../../components/Page';
import TopActions from '../../../components/TopActions';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { useUserData } from '../../../contexts/UserContext';
import { useSnackbar } from '../../../hooks/useSnackbar';

import { RadioButton } from 'react-native-paper';

import { INavigation } from '../../../types';

interface FaceShapeFormProps extends INavigation {}

const FaceShapeForm = ({ navigation }: FaceShapeFormProps) => {
  const { theme } = useContext(ThemeContext);
  const { user, updateUserData } = useUserData();
  const showSnackbar = useSnackbar();
  const selectedValue = user?.faceShape || '';

  const onSelect = async (faceShape: string) => {
    const [, data] = await updateUserData({ faceShape: faceShape });
    if (data) {
      const faceShapeLabel = faceShapes.find(f => f.value === faceShape)?.name;
      showSnackbar(`Updated Face Shape to ${faceShapeLabel}`);
    }
  };

  return (
    <Page backgroundColor={theme.palette.common.white}>
      <TopActions navigation={navigation} />
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Text style={theme.typography.h3}>Face Shape</Text>
        <View style={{ paddingVertical: 2 }} />
        <Text>Discover your perfect look! Choose your face shape.</Text>
        <View style={{ paddingVertical: 5 }} />
        <View style={{ paddingTop: 10 }} />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 20,
          }}>
          {faceShapes.map(faceShape => {
            const status =
              faceShape.value === selectedValue ? 'checked' : 'unchecked';
            return (
              <View key={faceShape.id}>
                <FaceShape
                  name={faceShape.name}
                  imageEl={faceShape.imageEl}
                  value={faceShape.value}
                  onSelect={onSelect}
                  status={status}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Page>
  );
};

const imageStyle = {
  width: 145,
  height: 100,
};

const faceShapes = [
  {
    id: 1,
    name: 'Oval',
    value: 'oval',
    imageEl: (
      <Image
        source={require('../../../../assets/images/face-shapes/oval.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 2,
    name: 'Round',
    value: 'round',
    imageEl: (
      <Image
        source={require('../../../../assets/images/face-shapes/round.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 3,
    name: 'Triangle',
    value: 'triangle',
    imageEl: (
      <Image
        source={require('../../../../assets/images/face-shapes/triangle.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 4,
    name: 'Heart',
    value: 'heart',
    imageEl: (
      <Image
        source={require('../../../../assets/images/face-shapes/heart.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 5,
    name: 'Square',
    value: 'square',
    imageEl: (
      <Image
        source={require('../../../../assets/images/face-shapes/square.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 6,
    name: 'Rectangle',
    value: 'rectangle',
    imageEl: (
      <Image
        source={require('../../../../assets/images/face-shapes/rectangle.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 7,
    name: 'Oblong',
    value: 'oblong',
    imageEl: (
      <Image
        source={require('../../../../assets/images/face-shapes/oblong.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 8,
    name: 'Diamond',
    value: 'diamond',
    imageEl: (
      <Image
        source={require('../../../../assets/images/face-shapes/diamond.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
];

const FaceShape = ({
  name,
  imageEl,
  value,
  onSelect,
  status,
}: {
  name: string;
  value: string;
  status: 'checked' | 'unchecked';
  imageEl: React.ReactNode;
  onSelect: (value: string) => void;
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity onPress={() => onSelect(value)}>
      <View
        style={{
          alignItems: 'center',
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
          borderColor: theme.palette.common.grey,
        }}>
        {imageEl}
        <Text style={{ ...theme.typography.h3, fontSize: 18 }}>{name}</Text>
        <RadioButton
          value={value}
          status={status}
          onPress={() => onSelect(value)}
        />
      </View>
    </TouchableOpacity>
  );
};

export default FaceShapeForm;
