import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ICartItem } from '../../types';
import HtmlView from '../../components/HtmlView';

import { Feather } from '@expo/vector-icons';

function CartItem(props: {
  item: ICartItem;
  hasBottomBorder: boolean;
  onRemove: (key: string) => void;
}) {
  const { item, hasBottomBorder, onRemove } = props;

  const rowStyles = hasBottomBorder
    ? {
        borderBottomWidth: 1,
        borderBottomColor: '#C8C7CC',
      }
    : {};

  return (
    <View
      style={{
        ...styles.col,
        ...rowStyles,
      }}>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Image
          source={{
            uri: item?.images?.[0]?.src,
          }}
          style={styles.image}
        />
        <View style={{ flexDirection: 'column', gap: 10 }}>
          {item.variation?.map((itemVar, index) => (
            <View key={`${itemVar.id}-${index}`}>
              <Text
                style={{
                  color: '#472723',
                }}>
                <HtmlView html={`${itemVar.attribute}: ${itemVar.value}`} />
              </Text>
            </View>
          ))}
        </View>
        <View>
          <Text>x {item.quantity}</Text>
        </View>
        <View>
          <Text style={{ color: '#252529', fontSize: 15 }}>
            {item.totals.currency_symbol}
            {(
              parseInt(item.totals.line_total) /
              Math.pow(10, item.totals.currency_minor_unit)
            ).toFixed(item.totals.currency_minor_unit)}
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => onRemove(item.key)}>
            <Feather name="trash-2" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default CartItem;

const styles = StyleSheet.create({
  image: {
    height: 80,
    width: 80,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  name: {
    color: '#472723',
    fontSize: 16,
    fontWeight: 'bold',
  },
  col: {
    flexDirection: 'column',
    paddingVertical: 10,
  },
});
