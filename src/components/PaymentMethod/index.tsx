import React from 'react';
import { AntDesign } from '@expo/vector-icons';

import { View, Image, Text, TouchableOpacity } from 'react-native';

interface PaymentMethodProps {
  method: 'visa' | 'paypal';
  label: string;
  onPress?: () => void;
  isSelected?: boolean;
}

interface IconConfig {
  [key: string]: React.ReactNode;
}

function PaymentMethod(props: PaymentMethodProps) {
  const { method, label, onPress, isSelected = false } = props;

  const iconConfig: IconConfig = {
    paypal: (
      <Image
        source={require('../../../assets/images/payment-methods/paypal.png')}
        style={{
          width: 25,
          height: 25,
          resizeMode: 'contain',
        }}
      />
    ),
    visa: (
      <Image
        source={require('../../../assets/images/payment-methods/visa.png')}
        style={{
          width: 25,
          height: 25,
          resizeMode: 'contain',
        }}
      />
    ),
  };
  const iconEl = method ? iconConfig[method] : null;
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor: '#F6F6F6',
          borderRadius: 8,
          padding: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 15,
          }}>
          {iconEl}
          <Text>{label}</Text>
        </View>
        {isSelected ? (
          <View>
            <AntDesign name="check" size={24} color="#472723" />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default PaymentMethod;
