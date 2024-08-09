import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { Text, View } from 'react-native';
import * as Yup from 'yup';
import Button from '../../components/Button';
import Page from '../../components/Page';
import Textfield from '../../components/Textfield';
import TopActions from '../../components/TopActions';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import HtmlView from '../../components/HtmlView';

const Signup = ({ navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const { register } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    // firstName: '',
    // lastName: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    // firstName: Yup.string().trim().required('First name is required'),
    // lastName: Yup.string().trim().required('Last name is required'),
    email: Yup.string()
      .trim()
      .email('Invalid Email')
      .required('Email is required'),
    password: Yup.string()
      .trim()
      .min(6, 'Password must have at least 6 characters')
      .required('Password is required'),
  });
  return (
    <Page backgroundColor={theme.palette.background.primary}>
      <TopActions navigation={navigation} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, formikActions) => {
          register(values, formikActions, setErrorMessage);
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
          const { email, password } = values;
          return (
            <View
              style={{
                flex: 1,
                paddingHorizontal: 30,
                flexDirection: 'column',
                gap: 12,
              }}>
              <View style={{ marginVertical: 10 }}>
                <Text style={theme.typography.h2}>Sign up</Text>
              </View>

              {errorMessage && <HtmlView html={`${errorMessage}`} />}
              {/* <Textfield
                label="First name"
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={firstName}
                error={touched.firstName && errors.firstName}
              />
              <Textfield
                label="Last name"
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={lastName}
                error={touched.lastName && errors.lastName}
              /> */}
              <Textfield
                label="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={email}
                error={touched.email && errors.email}
              />
              <Textfield
                label="Password"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={password}
                error={touched.password && errors.password}
              />

              <View style={{ marginVertical: 20 }}>
                <Button
                  loading={isSubmitting}
                  type="primary"
                  width="100%"
                  onPress={handleSubmit}>
                  Create account
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
      <View
        style={{
          flex: 0.07,
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: theme.palette.text.tertiary,
            paddingHorizontal: 50,
            textAlign: 'center',
          }}>
          By signing up, you agreed to our Terms of Use and Privacy Policy
        </Text>
      </View>
    </Page>
  );
};

export default Signup;
