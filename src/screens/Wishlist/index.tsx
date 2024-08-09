import React, { useContext } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Page from '../../components/Page';
import Product from '../../components/Product';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useWishlistData } from '../../contexts/WishlistContext';

import { INavigation } from '../../types';

interface WishlistProps extends INavigation {}

const Wishlist: React.FC<WishlistProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { wishlistData, onLike, isLiked } = useWishlistData();

  return (
    <Page backgroundColor={theme.palette.common.white}>
      <ScrollView style={{ paddingTop: 20, paddingHorizontal: 20 }}>
        <Text style={{ ...theme.typography.h2 }}>Wishlist</Text>
        <Text style={{ marginTop: 25, fontSize: 13, marginBottom: 25 }}>
          {wishlistData.length} Items
        </Text>
        <View
          style={{
            flex: 1,
            flexWrap: 'wrap',
            flexDirection: 'row',
          }}>
          {wishlistData.map(product => {
            const currency = product.prices.currency_symbol;
            const startingPrice = (
              parseInt(product.prices.price_range.min_amount) /
              Math.pow(10, product.prices.currency_minor_unit)
            ).toFixed(product.prices.currency_minor_unit);

            const maximumPrice = (
              parseInt(product.prices.price_range.max_amount) /
              Math.pow(10, product.prices.currency_minor_unit)
            ).toFixed(product.prices.currency_minor_unit);

            return (
              <View key={product.id}>
                <Product
                  id={product.id}
                  onPress={() =>
                    navigation.navigate('Product', { data: product })
                  }
                  imageSrc={product.images[0]?.src}
                  category={product.categories[0]?.name || ''}
                  name={product.name}
                  price={`${currency}${startingPrice} - ${currency}${maximumPrice}`}
                  onLike={() => onLike(product)}
                  isLiked={isLiked(product.id)}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Page>
  );
};

export default Wishlist;
