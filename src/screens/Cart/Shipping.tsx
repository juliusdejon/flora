import React, { useContext, useState } from 'react';
import { Formik } from 'formik';
import { Text, View } from 'react-native';
import Page from '../../components/Page';
import * as Yup from 'yup';
import { ThemeContext } from '../../contexts/ThemeContext';
import Textfield from '../../components/Textfield';
import TopActions from '../../components/TopActions';
import HtmlView from '../../components/HtmlView';

import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

import { INavigation, ShippingAddress } from '../../types';
import Button from '../../components/Button';
import Config from '../../config';

const baseUrl = Config.API_V1_URL;

const apiKey = Config.WOO_REST_API_KEY;

interface CartProps extends INavigation {}

const Shipping: React.FC<CartProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [errorMessage, setErrorMessage] = useState('');
  const { authState, setAuthState } = useAuth();
  const shipping = authState?.user?.shipping;

  const userId = authState?.user?.id;

  const initialValues = {
    first_name: shipping?.first_name || '',
    last_name: shipping?.last_name || '',
    phone: shipping?.phone || '',
    address_1: shipping?.address_1 || '',
    address_2: shipping?.address_2 || '',
    country: shipping?.country || '',
    state: shipping?.state || '',
    postcode: shipping?.postcode || '',
    city: shipping?.city || '',
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().trim().required('First Name is required'),
    last_name: Yup.string().trim().required('Last Name is required'),
    phone: Yup.string().trim().required('Phone No is required'),
    address_1: Yup.string().trim().required('Address 1 is required'),
    address_2: Yup.string().trim().required('Address 2 is required'),
    country: Yup.string().trim().required('Country is required'),
    state: Yup.string().trim().required('State is required'),
    postcode: Yup.string().trim().required('Postcode is required'),
    city: Yup.string().trim().required('City is required'),
  });

  const onSaveShipping = async (
    values: ShippingAddress,
    formikActions: any,
  ) => {
    setErrorMessage('');
    try {
      const response = await axios.patch(
        `${baseUrl}/wp-json/wc/v2/customers/${userId}?${apiKey}`,
        {
          shipping: values,
        },
        {
          headers: {
            Accept: 'application/json',
            Authorization: '', // Remove the default Authorization header to use the apiKey instead
            'Content-Type': 'application/json', // Set the Content-Type header
          },
        },
      );
      if (response.data) {
        // @ts-ignore
        setAuthState(prev => {
          return {
            ...prev,
            user: { ...prev.user, shipping: values },
          };
        });
        navigation.navigate('PlaceOrder');
      }
    } catch (error) {
      if (error) {
        console.log(error);
        // @ts-ignore
        const errorMsg = error?.response?.data?.errors?.[0]?.msg;
        // @ts-ignore
        const errorMessage = error?.response?.data?.message;
        if (errorMsg) {
          console.log('error', errorMsg);
          setErrorMessage(errorMsg);
        } else if (errorMessage) {
          console.log(errorMessage);
          setErrorMessage(errorMessage);
        } else {
          // @ts-ignore
          setErrorMessage(error);
        }
      }
    } finally {
      formikActions.setSubmitting(false);
    }
  };

  return (
    <Page backgroundColor={theme.palette.common.white}>
      <TopActions navigation={navigation} />
      <View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, formikActions) => {
            onSaveShipping(values, formikActions);
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
            const {
              first_name,
              last_name,
              phone,
              address_1,
              address_2,
              country,
              state,
              postcode,
              city,
            } = values;

            return (
              <View style={{ flex: 1 }}>
                <View style={{ flex: 0.9 }}>
                  <Text style={{ ...theme.typography.h2, marginBottom: 30 }}>
                    Shipping
                  </Text>
                  <View>
                    {errorMessage && <HtmlView html={`${errorMessage}`} />}

                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 35,
                      }}>
                      <View style={{ width: '45%' }}>
                        <Textfield
                          label="First Name"
                          onChangeText={handleChange('first_name')}
                          onBlur={handleBlur('first_name')}
                          value={first_name}
                          error={touched.first_name && errors.first_name}
                        />
                      </View>
                      <View style={{ width: '45%' }}>
                        <Textfield
                          label="Last Name"
                          onChangeText={handleChange('last_name')}
                          onBlur={handleBlur('last_name')}
                          value={last_name}
                          error={touched.last_name && errors.last_name}
                        />
                      </View>
                    </View>

                    <Textfield
                      label="Phone"
                      onChangeText={handleChange('phone')}
                      onBlur={handleBlur('phone')}
                      value={phone}
                      error={touched.phone && errors.phone}
                    />
                    <Textfield
                      label="Address Line 1"
                      onChangeText={handleChange('address_1')}
                      onBlur={handleBlur('address_1')}
                      value={address_1}
                      error={touched.address_1 && errors.address_1}
                    />
                    <Textfield
                      label="Address Line 2"
                      onChangeText={handleChange('address_2')}
                      onBlur={handleBlur('address_2')}
                      value={address_2}
                      error={touched.address_2 && errors.address_2}
                    />
                    <Textfield
                      label="Country"
                      onChangeText={handleChange('country')}
                      onBlur={handleBlur('country')}
                      value={country}
                      error={touched.country && errors.country}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 35,
                      }}>
                      <View style={{ width: '45%' }}>
                        <Textfield
                          label="State"
                          onChangeText={handleChange('state')}
                          onBlur={handleBlur('state')}
                          value={state}
                          error={touched.state && errors.state}
                        />
                      </View>
                      <View style={{ width: '45%' }}>
                        <Textfield
                          label="Postcode"
                          onChangeText={handleChange('postcode')}
                          onBlur={handleBlur('postcode')}
                          value={postcode}
                          error={touched.postcode && errors.postcode}
                        />
                      </View>
                    </View>
                    <Textfield
                      label="City"
                      onChangeText={handleChange('city')}
                      onBlur={handleBlur('city')}
                      value={city}
                      error={touched.city && errors.city}
                    />
                  </View>
                </View>
                <View style={{ flex: 0.1 }}>
                  <Button
                    loading={isSubmitting}
                    width={'100%'}
                    type="primary"
                    onPress={handleSubmit}>
                    Continue
                  </Button>
                </View>
              </View>
            );
          }}
        </Formik>
      </View>
    </Page>
  );
};

export default Shipping;
