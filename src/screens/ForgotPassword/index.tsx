import axios from 'axios';
import { Formik } from 'formik';
import React, { useContext } from 'react';
import { Image, View } from 'react-native';
import { Modal, PaperProvider, Portal, Text } from 'react-native-paper';
import * as Yup from 'yup';
import { baseURL } from '../../api/client';
import Button from '../../components/Button';
import Page from '../../components/Page';
import Textfield from '../../components/Textfield';
import TopActions from '../../components/TopActions';
import { ThemeContext } from '../../contexts/ThemeContext';

const ForgotPassword = ({ navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const [visible, setVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [email, setEmail] = React.useState('');

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const initialValues = {
    email: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email('Invalid Email')
      .required('Email is required'),
  });

  const onForgotPassword = async (email: string) => {
    try {
      setEmail(email);
      const response = await axios.post(
        `${baseURL}/api/auth/forgot-password`,
        { email },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      if (response.data) {
        showModal();
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

  const onSendCode = () => {
    navigation.navigate('VerifyEmail', { email });
  };

  return (
    <PaperProvider>
      <Page backgroundColor={theme.palette.background.primary}>
        <TopActions navigation={navigation} />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async values => {
            const email = values.email.trim();
            onForgotPassword(email);
          }}>
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => {
            const { email } = values;
            return (
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 30,
                  flexDirection: 'column',
                  gap: 12,
                }}>
                <View style={{ flex: 1 }}>
                  <View style={{ marginVertical: 10 }}>
                    <Text style={theme.typography.h2}>Forgot Password?</Text>
                  </View>
                  {errorMessage && <Text>{errorMessage}</Text>}
                  <Textfield
                    label="Your Email"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={email}
                    error={touched.email && errors.email}
                  />
                </View>
                <View style={{ flex: 3 }}>
                  <Button
                    loading={isSubmitting}
                    type="primary"
                    width="100%"
                    onPress={handleSubmit}>
                    Send me now
                  </Button>
                </View>
              </View>
            );
          }}
        </Formik>
        <Portal>
          <Modal
            dismissable={false}
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{
              backgroundColor: 'white',
              marginLeft: 30,
              marginRight: 30,
              borderRadius: 20,
              height: 400,
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'space-evenly',
                padding: 24,
              }}>
              <Image
                source={require('../../../assets/images/reset-password.png')}
                style={{
                  width: 120,
                  height: 120,
                }}
              />
              <Text
                style={{
                  ...theme.typography.h4,
                  fontFamily: theme.font.RobotoBold,
                }}>
                You'll shortly receive an email with a code to setup a new
                password.
              </Text>
              <Button type="primary" onPress={onSendCode}>
                Enter Code
              </Button>
            </View>
          </Modal>
        </Portal>
      </Page>
    </PaperProvider>
  );
};

export default ForgotPassword;
