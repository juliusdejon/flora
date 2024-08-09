import { Feather } from '@expo/vector-icons';
import { Formik } from 'formik';
import React, { useContext, useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';
import Button from '../../components/Button';
import Page from '../../components/Page';
import Textfield from '../../components/Textfield';
import TopActions from '../../components/TopActions';
import { useAuth } from '../../contexts/AuthContext';
import HtmlView from '../../components/HtmlView';
import { ThemeContext } from '../../contexts/ThemeContext';

const Login = ({ navigation }: any) => {
  const { login, errorMessage } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: '',
    password: '',
    rememberMe: false,
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email('Invalid Email')
      .required('Email is required'),
    password: Yup.string().trim().required('Password is required'),
    rememberMe: Yup.bool(),
  });

  const onLogin = async (values: any, formikActions: any) => {
    await login(values, formikActions);
  };

  return (
    <Page backgroundColor={theme.palette.background.primary}>
      <TopActions navigation={navigation} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, formikActions) => {
          const email = values.email.trim();
          await onLogin({ ...values, email }, formikActions);
        }}>
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
        }) => {
          const { email, password, rememberMe } = values;
          return (
            <View
              style={{
                flex: 1,
                paddingHorizontal: 30,
                flexDirection: 'column',
                gap: 12,
              }}>
              <View style={{ marginVertical: 10 }}>
                <Text style={theme.typography.h2}>Log in</Text>
              </View>
              {errorMessage && <HtmlView html={`${errorMessage}`} />}
              <Textfield
                label="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={email}
                error={touched.email && errors.email}
              />
              <View>
                <Textfield
                  label="Password"
                  secureTextEntry={!showPassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={password}
                  error={touched.password && errors.password}
                  right={
                    password.length > 0 && (
                      <TouchableOpacity
                        hitSlop={theme.hitSlop}
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: 15,
                        }}
                        onPress={() => setShowPassword(!showPassword)}>
                        <Feather
                          name={showPassword ? 'eye-off' : 'eye'}
                          size={20}
                          color="black"
                        />
                      </TouchableOpacity>
                    )
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                  <Switch
                    style={{
                      marginLeft: -6,
                      transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
                    }}
                    trackColor={{
                      false: theme.palette.common.black,
                      true: theme.palette.background.secondary,
                    }}
                    thumbColor={theme.palette.common.white}
                    ios_backgroundColor={theme.palette.common.black}
                    onValueChange={val => {
                      setFieldValue('rememberMe', val);
                    }}
                    value={rememberMe}
                  />
                  <Text>Remember</Text>
                </View>
                <TouchableOpacity
                  hitSlop={theme.hitSlop}
                  onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginVertical: 20 }}>
                <Button
                  loading={isSubmitting}
                  type="primary"
                  width="100%"
                  onPress={handleSubmit}>
                  Log in
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
    </Page>
  );
};

export default Login;
