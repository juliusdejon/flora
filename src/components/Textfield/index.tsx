import { View } from 'react-native';
import React from 'react';
import { TextInput, HelperText } from 'react-native-paper';

const Textfield = ({ label, ...rest }: any) => {
  return (
    <View style={{ width: '100%' }}>
      <TextInput
        autoCapitalize="none"
        label={label}
        {...rest}
        style={{
          backgroundColor: 'transparent',
        }}></TextInput>
      {rest.error && <HelperText type="error">{rest.error}</HelperText>}
    </View>
  );
};

export default Textfield;
