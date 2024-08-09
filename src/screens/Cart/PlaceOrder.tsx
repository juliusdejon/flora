import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Text, TouchableOpacity, View, Alert, Image } from 'react-native';
import Page from '../../components/Page';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Linking } from 'react-native';
import TopActions from '../../components/TopActions';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';

import Config from '../../config';

import { INavigation, IOrder } from '../../types';
import Button from '../../components/Button';
import { BottomSheet } from 'react-native-elements';

interface CartProps extends INavigation {}

const PlaceOrder: React.FC<CartProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { authState } = useAuth();
  const { cartData, placeOrder, removeCoupon, clearCartItems, updateOrder } =
    useCart();
  const { initPaymentSheet, presentPaymentSheet, handleURLCallback } =
    useStripe();
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState('');
  const [isVisible, setVisible] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const apiUrl = `${Config.NODE_API_URL}/api/payment/payment-sheet`;
    const email = authState?.user?.email;
    const amount = cartData?.totals?.total_price;
    const currency = cartData?.totals?.currency_code;
    try {
      const response = await axios.post(
        apiUrl,
        {
          email,
          amount,
          currency,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      const {
        paymentIntent,
        paymentIntentClientSecret,
        ephemeralKey,
        customer,
        publishableKey,
      } = await response.data;

      setPaymentIntent(paymentIntent.id);
      return {
        paymentIntentClientSecret,
        ephemeralKey,
        customer,
        publishableKey,
      };
      // Handle response here
    } catch (error) {
      console.log('Error fetching payment sheet:', error);
      // Handle error here
      return {
        paymentIntentClientSecret: '',
        ephemeralKey: '',
        customer: '',
        publishableKey: '',
      };
    }
  };

  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          // This was a Stripe URL - you can return or add extra handling here as you see fit
        } else {
          // This was NOT a Stripe URL – handle as you normally would
        }
      }
    },
    [handleURLCallback],
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    getUrlAsync();

    const deepLinkListener = Linking.addEventListener(
      'url',
      (event: { url: string }) => {
        handleDeepLink(event.url);
      },
    );

    return () => deepLinkListener.remove();
  }, [handleDeepLink]);

  const initializePaymentSheet = async () => {
    try {
      const { paymentIntentClientSecret, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Beauty Lives Here - Test',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntentClientSecret,
        // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
        // methods that complete payment after a delay, like SEPA Debit and Sofort.
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Jane Doe',
        },
        returnURL: 'your-app://stripe-redirect',
      });

      if (error) {
        // Handle error gracefully, for example:
        console.log('Error initializing Payment Sheet:', error.message);
        // Display a user-friendly error message to the user
        // or perform appropriate actions based on the error.
      } else {
        // Payment Sheet initialized successfully
        // setLoading(true);
      }
    } catch (err) {
      // Handle any unexpected errors during the initialization process
      console.log('An unexpected error occurred:', err);
      // Display a generic error message to the user
      // or perform appropriate actions based on the error.
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.log(error);

      // Alert.alert(`Error code: ${error.code}`, error.message);
      setLoading(false);
    } else {
      const shipping = authState?.user?.shipping;
      const order: IOrder = {
        shipping_address: {
          first_name: shipping?.first_name || '',
          last_name: shipping?.last_name || '',
          phone: shipping?.phone || '',
          address_1: shipping?.address_1 || '',
          address_2: shipping?.address_2 || '',
          country: shipping?.country || '',
          state: shipping?.state || '',
          postcode: shipping?.postcode || '',
          city: shipping?.city || '',
        },
        billing_address: {
          first_name: shipping?.first_name || '',
          last_name: shipping?.last_name || '',
          company: '',
          address_1: shipping?.address_1 || '',
          address_2: shipping?.address_2 || '',
          city: shipping?.city || '',
          state: shipping?.state || '',
          postcode: shipping?.postcode || '',
          country: shipping?.country || '',
          email: authState?.user?.email || '',
          phone: shipping?.phone || '',
        },
        payment_method: 'stripe_cc',
        create_account: false,
      };
      try {
        const [error, response] = await placeOrder(order);
        if (error) {
          Alert.alert('Error Order', 'Please contact the administrator');
        } else if (response) {
          console.log(response);
          console.log(response.payment_result);
          if (response.payment_result.payment_status === 'success') {
            setVisible(true);
            const [err, updateResp] = await updateOrder({
              id: response.order_id,
              set_paid: true,
              transaction_id: paymentIntent,
            });
            if (err) {
              console.log(err);
            }
            if (updateResp) {
              console.log(updateResp);
            }
            // delete all items in the cart
          }
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error Order', 'Please contact the administrator');
      }
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const onContinueShopping = async () => {
    setVisible(false);
    await clearCartItems();
    // go back to the product item
    navigation.goBack();
    navigation.goBack();
  };
  return (
    <Page backgroundColor={theme.palette.common.white}>
      <TopActions navigation={navigation} />
      {/* @ts-ignore */}
      <BottomSheet modalProps={{}} isVisible={isVisible}>
        <View
          style={{
            height: 400,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            backgroundColor: 'white',
            flex: 1,
          }}>
          <View
            style={{
              marginTop: 30,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 30,
              paddingHorizontal: 20,
            }}>
            <Image
              source={require('../../../assets/images/order-success.png')}
              style={{
                height: 100,
                width: 100,
              }}
              resizeMode="contain"
            />
            <Text style={theme.typography.h2}>Order Success</Text>
            <Text style={theme.typography.label}>
              Your order has been placed successfully! For more details check
              your account.
            </Text>
            <View style={{ width: '100%', marginTop: 'auto' }}>
              <Button
                width={'100%'}
                onPress={() => onContinueShopping()}
                type="primary">
                Continue shopping
              </Button>
            </View>
          </View>
        </View>
      </BottomSheet>
      <View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
        <View style={{ flex: 0.9 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={theme.typography.default}>Ship to</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Shipping');
              }}>
              <Text
                style={{
                  color: theme.palette.text.secondary,
                  fontFamily: theme.font.RobotoBold,
                }}>
                Change
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ paddingVertical: 10, gap: 5, flexDirection: 'column' }}>
            <Text style={{ ...theme.typography.default, fontSize: 14 }}>
              {authState?.user?.shipping.address_2},{' '}
              {authState?.user?.shipping.address_1}
            </Text>
            <Text style={{ ...theme.typography.label, fontSize: 15 }}>
              {authState?.user?.shipping.country}{' '}
              {authState?.user?.shipping.state},{' '}
              {authState?.user?.shipping.city}{' '}
              {authState?.user?.shipping.postcode}
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            {/* payment method */}
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={theme.typography.default}>Coupons</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('EnterPromoCode')}>
                <Text
                  style={{
                    color: theme.palette.text.secondary,
                    fontFamily: theme.font.RobotoBold,
                  }}>
                  Add Coupon
                </Text>
              </TouchableOpacity>
            </View>

            {cartData?.coupons.map(coupon => (
              <View
                key={coupon.code}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomColor: '#C8C7CC',
                  borderBottomWidth: 1,
                  paddingVertical: 20,
                }}>
                <Text style={theme.typography.default}>Coupon Code</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    gap: 10,
                  }}>
                  <Text
                    style={{
                      ...theme.typography.default,
                      fontFamily: theme.font.RobotoBold,
                    }}>
                    {coupon.code}
                  </Text>
                  <TouchableOpacity
                    onPress={async () => await removeCoupon(coupon.code)}>
                    <Feather name="minus-circle" size={18} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={theme.typography.default}>Subtotal</Text>
              <Text
                style={{
                  ...theme.typography.default,
                  // fontFamily: theme.font.RobotoBold,
                }}>
                {cartData?.totals.currency_symbol}
                {(
                  parseInt(cartData?.totals?.total_items || '0') /
                  Math.pow(10, cartData?.totals?.currency_minor_unit || 2)
                ).toFixed(cartData?.totals.currency_minor_unit)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={theme.typography.default}>Shipping Cost</Text>
              <Text
                style={{
                  ...theme.typography.default,
                  // fontFamily: theme.font.RobotoBold,
                }}>
                {cartData?.totals.currency_symbol}
                {(
                  parseInt(cartData?.totals?.total_shipping || '0') /
                  Math.pow(10, cartData?.totals?.currency_minor_unit || 2)
                ).toFixed(cartData?.totals.currency_minor_unit)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={theme.typography.default}>Discount</Text>
              <Text
                style={{
                  ...theme.typography.default,
                  // fontFamily: theme.font.RobotoBold,
                }}>
                -{cartData?.totals.currency_symbol}
                {(
                  parseInt(cartData?.totals?.total_discount || '0') /
                  Math.pow(10, cartData?.totals?.currency_minor_unit || 2)
                ).toFixed(cartData?.totals.currency_minor_unit)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                borderTopColor: '#C8C7CC',
                borderTopWidth: 1,
                paddingTop: 20,
              }}>
              <Text style={theme.typography.default}>Total</Text>
              <Text
                style={{
                  ...theme.typography.default,
                  fontFamily: theme.font.RobotoBold,
                  fontSize: 18,
                }}>
                {cartData?.totals.currency_symbol}
                {(
                  parseInt(cartData?.totals?.total_price || '0') /
                  Math.pow(10, cartData?.totals?.currency_minor_unit || 2)
                ).toFixed(cartData?.totals.currency_minor_unit)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 0.1 }}>
          <Button
            width={'100%'}
            loading={loading}
            type="primary"
            onPress={openPaymentSheet}>
            Select Payment Method
          </Button>
        </View>
      </View>
    </Page>
  );
};

export default PlaceOrder;
