import axios from 'axios';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { baseURL } from '../../api/client';
import Page from '../../components/Page';
import TopActions from '../../components/TopActions';

import { ThemeContext } from '../../contexts/ThemeContext';

const VerifyEmail = ({ navigation, route }: any) => {
  const { theme } = useContext(ThemeContext);
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']); // Initialize with empty strings for each digit
  const otpInputs = Array(4).fill(0); // An array to generate 4 OTP input fields
  const inputRefs = React.useRef(otpInputs.map(() => React.createRef()));

  const handleOtpChange = (index: number, value: string) => {
    // Update the state for the corresponding digit
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    // Move focus to the previous or next input based on the value
    if (value === '') {
      // If the value is empty, move to the previous input
      if (index > 0) {
        // @ts-ignore
        inputRefs.current[index - 1].focus();
      }
    } else if (index < otp.length - 1) {
      // If a value is entered, move to the next input
      // @ts-ignore
      inputRefs.current[index + 1].focus();
    }
  };

  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (otp.every(value => value != '')) {
      onVerify();
    }
  }, [otp]);

  const onVerify = async () => {
    try {
      setErrorMessage('');
      const response = await axios.post(
        `${baseURL}/api/auth/verify-code`,
        { email, code: otp.join('') },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      if (response.data) {
        navigation.navigate('ResetPassword', { email, code: otp.join('') });
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
      <TopActions navigation={navigation} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 30,
          flexDirection: 'column',
          gap: 12,
        }}>
        <View style={{ marginVertical: 10 }}>
          <Text style={theme.typography.h2}>Verify Email</Text>
        </View>
        {errorMessage && <Text>{errorMessage}</Text>}

        <View style={{ marginVertical: 10 }}>
          <Text style={theme.typography.default}>
            We have sent you an email with a code to {email}
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={otp[index]}
              keyboardType="numeric"
              maxLength={1}
              onChangeText={value => handleOtpChange(index, value)}
              // onFocus={() => handleOtpChange(index, '')}
              // @ts-ignore
              ref={input => (inputRefs.current[index] = input)}
            />
          ))}
        </View>
      </View>
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
    textAlign: 'center',
  },
});

export default VerifyEmail;
