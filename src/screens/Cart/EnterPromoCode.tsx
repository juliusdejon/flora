import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import Page from '../../components/Page';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Formik } from 'formik';
import Textfield from '../../components/Textfield';
import TopActions from '../../components/TopActions';
import { useCart } from '../../contexts/CartContext';

import { INavigation } from '../../types';
import Button from '../../components/Button';

interface CartProps extends INavigation {}

const EnterPromoCode: React.FC<CartProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { applyCouponCode } = useCart();
  const [errorMessage, setErrorMessage] = useState('');

  const onApplyCouponCode = async (values: { code: string }) => {
    try {
      await applyCouponCode(values.code);
      navigation.navigate('PlaceOrder');
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const initialValues = {
    code: '',
  };
  return (
    <Page backgroundColor={theme.palette.common.white}>
      <TopActions navigation={navigation} />
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          onApplyCouponCode(values);
        }}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          isSubmitting,
          handleSubmit,
        }) => {
          const { code } = values;
          return (
            <View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
              <View style={{ flex: 0.9 }}>
                <Text style={{ ...theme.typography.h2, marginBottom: 30 }}>
                  Enter Coupon Code
                </Text>
                {errorMessage && (
                  <Text style={{ paddingBottom: 20 }}>{errorMessage}</Text>
                )}

                <Text style={theme.typography.label}>
                  If you have a coupon code, enter it and save on your order.
                </Text>
                <Textfield
                  label="Enter coupon code"
                  onChangeText={handleChange('code')}
                  onBlur={handleBlur('code')}
                  value={code}
                  error={touched.code && errors.code}
                />
              </View>

              <View style={{ flex: 0.1 }}>
                <Button
                  width={'100%'}
                  type="primary"
                  onPress={handleSubmit}
                  loading={isSubmitting}>
                  Apply
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
    </Page>
  );
};

export default EnterPromoCode;
