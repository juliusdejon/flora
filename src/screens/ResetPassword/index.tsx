import axios from 'axios';
import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import * as Yup from 'yup';
import { baseURL } from '../../api/client';
import Button from '../../components/Button';
import Page from '../../components/Page';
import Textfield from '../../components/Textfield';
import { ThemeContext } from '../../contexts/ThemeContext';

const ResetPassword = ({ navigation, route }: any) => {
  const { theme } = useContext(ThemeContext);
  const { email, code } = route.params;
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .trim()
      .min(6, 'Password must have at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .trim()
      .min(6, 'Confirm Password must have at least 6 characters')
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const onResetPassword = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await axios.post(
        `${baseURL}/api/auth/reset-password`,
        {
          email,
          code,
          password: values.password,
          confirmPassword: values.confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      if (response.data) {
        navigation.navigate('Login');
      }
    } catch (error) {
      if (error) {
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
        }
      }
    }
  };

  return (
    <Page backgroundColor={theme.palette.background.primary}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={values => {
          onResetPassword(values);
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
          const { password, confirmPassword } = values;
          return (
            <View
              style={{
                flex: 1,
                paddingHorizontal: 30,
                flexDirection: 'column',
                gap: 12,
              }}>
              <View style={{ marginVertical: 10 }}>
                <Text style={theme.typography.h2}>Reset Password</Text>
              </View>
              {errorMessage && <Text>{errorMessage}</Text>}
              <Textfield
                label="Password"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={password}
                error={touched.password && errors.password}
              />
              <Textfield
                label="Confirm Password"
                secureTextEntry
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={confirmPassword}
                error={touched.confirmPassword && errors.confirmPassword}
              />

              <View style={{ marginVertical: 20 }}>
                <Button
                  width={'100%'}
                  loading={isSubmitting}
                  type="primary"
                  onPress={handleSubmit}>
                  Submit
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
    </Page>
  );
};

export default ResetPassword;
