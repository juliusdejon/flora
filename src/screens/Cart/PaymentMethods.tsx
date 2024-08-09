import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Page from '../../components/Page';
import { ThemeContext } from '../../contexts/ThemeContext';
import TopActions from '../../components/TopActions';

import { INavigation } from '../../types';
import { Entypo } from '@expo/vector-icons';

import PaymentMethod from '../../components/PaymentMethod';

interface CartProps extends INavigation {}

const PaymentMethods: React.FC<CartProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Page backgroundColor={theme.palette.common.white}>
      <TopActions navigation={navigation} />
      <View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
        <Text style={theme.typography.h2}>Payment Methods</Text>
        <View style={{ marginTop: 20 }}>
          <View style={{ marginVertical: 10 }}>
            <PaymentMethod method="visa" label="**** **** *** 2233" />
          </View>
          <View style={{ marginVertical: 10 }}>
            <PaymentMethod method="paypal" label="jane@gmail.com" isSelected />
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('AddNewCard')}>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
            }}>
            <Entypo name="plus" size={24} color="#472723" />
            <Text style={theme.typography.default}>Add New Card</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Page>
  );
};

export default PaymentMethods;
