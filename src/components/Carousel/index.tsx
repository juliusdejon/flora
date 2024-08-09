import React, { useState, useContext, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ThemeContext } from '../../contexts/ThemeContext';

type CarouselProps = {
  items: string[];
};

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const { theme } = useContext(ThemeContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const windowWidth = Dimensions.get('window').width;

  const handleScroll = (event: any) => {
    const slideWidth = windowWidth;
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    setActiveIndex(newIndex);
  };

  const renderItems = () => {
    return items.map((item, index) => (
      <Image
        key={`carousel-item-${index}`}
        source={{
          uri: item,
        }}
        resizeMode="cover"
        style={{
          width: windowWidth,
          height: 400,
          backgroundColor: theme.palette.background.secondary,
        }}
      />
    ));
  };

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * windowWidth,
        animated: true,
      });
    }
  };

  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}>
        {renderItems()}
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {items.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                index === activeIndex
                  ? theme.palette.text.primary
                  : theme.palette.text.tertiary,
              margin: 4,
              bottom: 30,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default Carousel;
