import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';

const Card = (props: any) => {
  const { imageEl, primary, secondary, tertiary, onLike, isLiked } = props;
  const { theme } = useContext(ThemeContext);
  return (
    <View
      style={{
        height: 255,
        width: 160,
        flexDirection: 'column',
        justifyContent: 'space-around',
        gap: 4,
      }}>
      {imageEl}
      <Text
        style={{
          fontSize: 13,
          color: theme.palette.text.tertiary,
        }}>
        {primary}
      </Text>
      <Text
        style={{
          fontSize: 15,
        }}
        numberOfLines={1}>
        {secondary}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 13,
            fontFamily: theme.font.RobotoBold,
          }}>
          {tertiary}
        </Text>
        <TouchableOpacity onPress={onLike}>
          {isLiked ? (
            <Ionicons name="heart-sharp" size={20} color="#472723" />
          ) : (
            <Ionicons name="heart-outline" size={20} color="#472723" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Card;
