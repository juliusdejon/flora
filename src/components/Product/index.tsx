import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import Card from '../Card';

interface ProductProps {
  id: string;
  onPress: any;
  style?: any;
  imageSrc?: string;
  category: string;
  name: string;
  price: string;
  onLike?: any;
  isLiked?: boolean;
}

const Product = (props: ProductProps) => {
  const {
    id,
    onPress,
    style,
    imageSrc,
    category,
    name,
    price,
    onLike = () => {},
    isLiked,
  } = props;
  return (
    <TouchableOpacity
      key={id}
      style={{ ...style, marginRight: 12 }}
      onPress={onPress}>
      <Card
        imageEl={
          <Image
            style={{
              width: 160,
              height: 190,
              borderRadius: 8,
            }}
            resizeMode="cover"
            source={{
              uri: `${imageSrc}`,
            }}
          />
        }
        primary={category}
        secondary={name}
        tertiary={price}
        onLike={onLike}
        isLiked={isLiked}
      />
    </TouchableOpacity>
  );
};

export default Product;
