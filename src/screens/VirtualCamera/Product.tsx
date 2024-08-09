import { AntDesign, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { IProduct } from '../../types';

function Product(props: { data: IProduct }) {
  const { data } = props;
  return (
    <View style={styles.product}>
      <View style={styles.productContainer}>
        <Image
          source={{
            uri: `${data.images?.[0]?.src}`,
          }}
          style={styles.image}
        />
        <View style={{ flexDirection: 'column', flex: 1, gap: 10 }}>
          <Text style={styles.name}>{data.name}</Text>
          <Text
            style={{
              color: '#472723',
            }}>
            {data.categories?.[0]?.name}
          </Text>
          <View style={styles.row}>
            <Text style={styles.price}>
              {' '}
              {data.prices.currency_symbol}
              {(
                parseInt(data.prices.price) /
                Math.pow(10, data.prices.currency_minor_unit)
              ).toFixed(data.prices.currency_minor_unit)}
            </Text>
            <Ionicons name="heart-outline" size={24} color="#472723" />
            <AntDesign name="plus" size={24} color="#472723" />
          </View>
        </View>
      </View>
    </View>
  );
}

export default Product;

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  productContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  product: {
    height: 130,
    paddingHorizontal: 20,
    backgroundColor: '#FBF7F2',
  },
  price: {
    color: '#472723',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 'auto',
  },
  name: {
    color: '#472723',
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
});
