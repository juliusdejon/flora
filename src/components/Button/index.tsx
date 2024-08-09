import React, { ReactNode, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button as BaseButton } from 'react-native-paper';
import { ThemeContext } from '../../contexts/ThemeContext';

type ButtonProps = {
  loading?: boolean;
  children: ReactNode;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'tertiary';
  width?: number | string;
  disabled?: boolean;
};

const Button = ({
  children,
  onPress,
  type = 'tertiary',
  width = 300,
  disabled,
  ...rest
}: ButtonProps) => {
  const { theme } = useContext(ThemeContext);

  const typeConfig: Record<string, { backgroundColor: string; color: string }> =
    {};

  // Populate typeConfig dynamically
  typeConfig['primary'] = {
    backgroundColor: theme.palette.text.primary,
    color: theme.palette.common.white,
  };

  typeConfig['secondary'] = {
    backgroundColor: theme.palette.background.secondary,
    color: theme.palette.text.primary,
  };

  typeConfig['tertiary'] = {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
  };

  const selectedType = typeConfig[type] || typeConfig['tertiary']; // Provide a default if needed

  const buttonEl = (
    <BaseButton
      mode="contained"
      style={{
        // @ts-ignore
        width: width,
        height: 46,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: disabled
          ? theme.palette.common.grey
          : selectedType.backgroundColor,
        ...(disabled ? styles.disabledButton : {}),
      }}
      {...rest}
      onPress={onPress}>
      <Text
        style={{
          ...theme.typography.default,
          color: selectedType.color,
          ...(disabled ? styles.buttonText : {}),
        }}>
        {children}
      </Text>
    </BaseButton>
  );

  if (disabled) return buttonEl;

  return (
    <TouchableOpacity
      hitSlop={{
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      }}
      onPress={onPress}>
      {buttonEl}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    backgroundColor: '#dcdcdc', // Gray background color
    opacity: 0.5, // Reduced opacity for a disabled look
  },
  buttonText: {
    color: '#a0a0a0', // Lighter text color
    textAlign: 'center',
  },
});

export default Button;
