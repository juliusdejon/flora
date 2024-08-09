import React, { useContext, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Page from '../../../components/Page';
import { baseURL } from '../../../api/client';

import { Formik, FormikHelpers } from 'formik';
import axios from 'axios';

import * as Yup from 'yup';

import TopActions from '../../../components/TopActions';
import Textfield from '../../../components/Textfield';
import Button from '../../../components/Button';

import { ThemeContext } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';

import { INavigation } from '../../../types';
import { useSnackbar } from '../../../hooks/useSnackbar';

interface PasswordProps extends INavigation {}

const Password: React.FC<PasswordProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { authState } = useAuth();
  const showSnackbar = useSnackbar();

  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().trim().required('Old Password is required'),
    password: Yup.string()
      .trim()
      .min(6, 'New Password must have at least 6 characters')
      .required('New Password is required'),
    confirmPassword: Yup.string()
      .trim()
      .min(6, 'Confirm New Password must have at least 6 characters')
      .oneOf([Yup.ref('password')], 'New Passwords must match')
      .required('Confirm New Password is required'),
  });

  const onChangePassword = async (
    values: {
      oldPassword: string;
      password: string;
      confirmPassword: string;
    },
    formikActions: FormikHelpers<any>,
  ) => {
    const email = authState?.user?.email;
    try {
      const response = await axios.post(
        `${baseURL}/api/auth/change-password`,
        {
          email,
          oldPassword: values.oldPassword,
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
        showSnackbar(`Successfully changed password`);
        formikActions.resetForm();
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
    formikActions.setSubmitting(false);
  };

  return (
    <Page backgroundColor={theme.palette.common.white}>
      <TopActions navigation={navigation} />

      <ScrollView style={{ paddingHorizontal: 20 }}>
        <View style={{ marginVertical: 10 }}>
          <Text style={theme.typography.h2}>Change Password</Text>
        </View>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, formikActions) => {
            onChangePassword(values, formikActions);
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
            const { oldPassword, password, confirmPassword } = values;
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  gap: 12,
                }}>
                {errorMessage && <Text>{errorMessage}</Text>}
                <Textfield
                  label="Old Password"
                  secureTextEntry
                  onChangeText={handleChange('oldPassword')}
                  onBlur={handleBlur('oldPassword')}
                  value={oldPassword}
                  error={touched.oldPassword && errors.oldPassword}
                />
                <Textfield
                  label="New Password"
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={password}
                  error={touched.password && errors.password}
                />
                <Textfield
                  label="Confirm New Password"
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
      </ScrollView>
    </Page>
  );
};

export default Password;
