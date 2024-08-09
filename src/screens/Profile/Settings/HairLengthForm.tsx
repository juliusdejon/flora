import React, { useContext } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Page from '../../../components/Page';
import TopActions from '../../../components/TopActions';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { useUserData } from '../../../contexts/UserContext';
import { useSnackbar } from '../../../hooks/useSnackbar';

import { INavigation } from '../../../types';

interface HairLengthFormProps extends INavigation {}

const HairLengthForm = ({ navigation }: HairLengthFormProps) => {
  const { theme } = useContext(ThemeContext);
  const { user, updateUserData } = useUserData();
  const showSnackbar = useSnackbar();
  const selectedValues = user?.preferredHairLengths || [];

  const onSelect = async (color: string) => {
    let updatedValues = [];
    if (selectedValues.includes(color)) {
      // If color is already checked, remove it
      updatedValues = selectedValues.filter(item => item !== color);
    } else {
      updatedValues = [...selectedValues, color];
    }
    const [, data] = await updateUserData({
      preferredHairLengths: updatedValues,
    });
    if (data) {
      showSnackbar(`Updated hair length preference`);
    }
  };

  return (
    <Page backgroundColor={theme.palette.common.white}>
      <TopActions navigation={navigation} />
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Text style={theme.typography.h3}>Preferred Hair Lengths</Text>
        <View style={{ paddingVertical: 2 }} />
        <Text>Select your preferred hair lengths </Text>
        <View style={{ paddingVertical: 5 }} />
        <View style={{ paddingTop: 10 }} />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 20,
          }}>
          {hairColors.map(hairColor => {
            return (
              <View key={hairColor.id}>
                <HairLength
                  name={hairColor.name}
                  imageEl={hairColor.imageEl}
                  value={hairColor.value}
                  selectedValue={selectedValues.includes(hairColor.value)}
                  onSelect={onSelect}
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

const hairColors = [
  {
    id: 1,
    name: 'Short',
    value: 'short',
    imageEl: (
      <Image
        source={require('../../../../assets/images/hair-length/short.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 2,
    name: 'Medium',
    value: 'medium',
    imageEl: (
      <Image
        source={require('../../../../assets/images/hair-length/medium.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 3,
    name: 'Long',
    value: 'long',
    imageEl: (
      <Image
        source={require('../../../../assets/images/hair-length/long.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
];

const HairLength = ({
  name,
  imageEl,
  selectedValue,
  value,
  onSelect,
}: {
  name: string;
  value: string;
  selectedValue: boolean;
  imageEl: React.ReactNode;
  onSelect: (color: string) => void;
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
        <Checkbox
          status={selectedValue ? 'checked' : 'unchecked'}
          onPress={() => onSelect(value)}
        />
      </View>
    </TouchableOpacity>
  );
};

export default HairLengthForm;
