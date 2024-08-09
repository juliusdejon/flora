import React, { useContext } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import Page from '../../../components/Page';
import TopActions from '../../../components/TopActions';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { useUserData } from '../../../contexts/UserContext';
import { useSnackbar } from '../../../hooks/useSnackbar';

import { INavigation } from '../../../types';

interface HairColorFormProps extends INavigation {}

const HairColorForm = ({ navigation }: HairColorFormProps) => {
  const { theme } = useContext(ThemeContext);
  const { user, updateUserData } = useUserData();
  const showSnackbar = useSnackbar();
  const selectedValues = user?.preferredHairColors || [];

  const onSelect = async (color: string) => {
    let updatedValues = [];
    if (selectedValues.includes(color)) {
      // If color is already checked, remove it
      updatedValues = selectedValues.filter(item => item !== color);
    } else {
      updatedValues = [...selectedValues, color];
    }
    const [, data] = await updateUserData({
      preferredHairColors: updatedValues,
    });
    if (data) {
      showSnackbar(`Updated hair color preference`);
    }
  };

  return (
    <Page backgroundColor={theme.palette.common.white}>
      <TopActions navigation={navigation} />
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Text style={theme.typography.h3}>Preferred Hair Colors</Text>
        <View style={{ paddingVertical: 2 }} />
        <Text>Select your preferred hair colors </Text>
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
                <HairColor
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
    name: 'Black',
    value: 'black',
    imageEl: (
      <Image
        source={require('../../../../assets/images/hair-colors/black.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 2,
    name: 'Brown',
    value: 'brown',
    imageEl: (
      <Image
        source={require('../../../../assets/images/hair-colors/brown.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 3,
    name: 'Blonde',
    value: 'blonde',
    imageEl: (
      <Image
        source={require('../../../../assets/images/hair-colors/blonde.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 4,
    name: 'Platinum',
    value: 'platinum',
    imageEl: (
      <Image
        source={require('../../../../assets/images/hair-colors/platinum.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 5,
    name: 'Grey',
    value: 'grey',
    imageEl: (
      <Image
        source={require('../../../../assets/images/hair-colors/grey.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
  {
    id: 6,
    name: 'Red',
    value: 'red',
    imageEl: (
      <Image
        source={require('../../../../assets/images/hair-colors/red.png')}
        style={imageStyle}
        resizeMode="contain"
      />
    ),
  },
];

const HairColor = ({
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

export default HairColorForm;
