import React, { useContext } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Page from '../../components/Page';
import SearchBar from '../../components/SearchBar';

import { ThemeContext } from '../../contexts/ThemeContext';

const wigIcon = require('../../../assets/images/wig-icon.png');
const clipInsIcon = require('../../../assets/images/clip-ins-icon.png');
const bundles = require('../../../assets/images/bundles-icon.png');
const medical = require('../../../assets/images/medical-icon.png');
const hair = require('../../../assets/images/hair-products-icon.png');
const accessories = require('../../../assets/images/accessories-icon.png');

const icons: Record<string, any> = {
  wig: wigIcon,
  bundles: bundles,
  'clip-ins': clipInsIcon,
  'hair-care': hair,
  medical: medical,
  accessories: accessories,
};

type CategoryProps = {
  navigation: any; // You can replace 'any' with a specific navigation prop type
};

const Category: React.FC<CategoryProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);

  const categories = [
    {
      id: 1,
      name: 'Wigs',
      image: 'wig',
      backgroundColor: 'secondary',
    },
    {
      id: 2,
      name: 'Bundles',
      image: 'bundles',
      backgroundColor: 'tertiary',
    },
    {
      id: 3,
      name: 'Clip-ins',
      image: 'clip-ins',
      backgroundColor: 'tertiary',
    },
    {
      id: 4,
      name: 'Medical',
      image: 'medical',
      backgroundColor: 'secondary',
    },
    {
      id: 5,
      name: 'Hair Care',
      image: 'hair-care',
      backgroundColor: 'secondary',
    },
    {
      id: 6,
      name: 'Accessories',
      image: 'accessories',
      backgroundColor: 'tertiary',
    },
  ];

  return (
    <Page backgroundColor={theme.palette.common.white}>
      <ScrollView style={{ marginTop: 40, paddingHorizontal: 20 }}>
        <SearchBar />
        <Text style={{ ...theme.typography.h2, marginTop: 20 }}>Category</Text>
        <View
          style={{
            paddingVertical: 20,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 20,
          }}>
          {categories.map((category, index) => (
            <TouchableOpacity
              onPress={() => {
                if (category.name === 'Medical') {
                  navigation.navigate('Health');
                } else {
                  navigation.navigate('HomeStack');
                }
              }}
              key={index}>
              <View
                style={{
                  backgroundColor: (theme.palette.background as any)[
                    category.backgroundColor
                  ],
                  height: 165,
                  width: 165,
                  borderRadius: 10,
                  justifyContent: 'center',
                  gap: 5,
                  alignItems: 'center',
                }}>
                <Image
                  source={icons[category.image]}
                  style={{
                    height: 120,
                    width: 80,
                  }}
                  resizeMode="contain"
                />
                <Text style={theme.typography.h4}>{category.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Page>
  );
};

export default Category;
