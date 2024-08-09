import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

const TopActions = ({ navigation, onBack, rightActions = [] }: any) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          onPress={() => {
            onBack ? onBack() : navigation.pop();
          }}
          hitSlop={theme.hitSlop}>
          <Ionicons name="arrow-back" size={24} color="#472723" />
        </TouchableOpacity>
        {rightActions.map(
          (
            action: ({ key }: { key: number }) => React.ReactElement[],
            index: number,
          ) => {
            return action({ key: index });
          },
        )}
      </View>
    </View>
  );
};

export default TopActions;
