import React, { useContext } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Page from '../../components/Page';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import TopActions from '../../components/TopActions';
import { useAuth } from '../../contexts/AuthContext';
import CartItem from './CartItem';

import { INavigation } from '../../types';
import Button from '../../components/Button';

interface CartProps extends INavigation {}

const Cart: React.FC<CartProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { authState } = useAuth();
  const { cartData, removeFromCart } = useCart();
  const shipping = authState?.user?.shipping;

  const onCheckout = () => {
    if ((shipping?.country || '').length > 0) {
      navigation.navigate('PlaceOrder');
    } else {
      navigation.navigate('Shipping');
    }
  };
  return (
    <Page backgroundColor={theme.palette.common.white}>
      <TopActions navigation={navigation} />
      <View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{ ...theme.typography.h2 }}>My Cart</Text>
          <Text style={{ fontSize: 13 }}>
            {cartData?.items.length || 0} Items
          </Text>
        </View>

        {cartData?.items.length ? (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <ScrollView style={{ flex: 0.9 }}>
              {cartData.items.map((item, index) => (
                <CartItem
                  key={`cart-item-${index}`}
                  item={item}
                  hasBottomBorder={index !== cartData.items.length - 1}
                  onRemove={removeFromCart}
                />
              ))}
            </ScrollView>
            <View
              style={{
                borderTopColor: '#252529',
                borderTopWidth: 1,
                flexDirection: 'row',
                paddingTop: 20,
                justifyContent: 'space-between',
                flex: 0.1,
              }}>
              <Text>Total amount</Text>
              <Text style={{ fontFamily: theme.font.RobotoBold, fontSize: 18 }}>
                {cartData?.totals.currency_symbol}
                {(
                  parseInt(cartData.totals.total_items) /
                  Math.pow(10, cartData.totals.currency_minor_unit)
                ).toFixed(cartData.totals.currency_minor_unit)}
              </Text>
            </View>
            <View style={{ paddingVertical: 20 }}>
              <Button
                width={'100%'}
                type="primary"
                onPress={() => onCheckout()}>
                Checkout
              </Button>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
            }}>
            <Text>Empty Cart</Text>
          </View>
        )}
      </View>
    </Page>
  );
};

export default Cart;
