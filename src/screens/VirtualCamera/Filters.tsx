import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function Filters() {
  const [activeColor, setActiveColor] = React.useState('');
  const [activePart, setActivePart] = React.useState('Lid');
  const onSelectPalette = (color: any) => {
    setActiveColor(color);
  };
  const onSelectPart = (part: any) => {
    setActivePart(part);
  };
  return (
    <View style={styles.bottomDrawer}>
      <Text
        style={{
          fontSize: 15,
          marginTop: 10,
        }}>
        Color palettes
      </Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ maxHeight: 100 }}>
        {colors.map((color, index) => (
          <ColorCircle
            // @ts-expect-error TS(2322): Type '{ onPress: () => void; activeColor: string; ... Remove this comment to see the full error message
            onPress={() => onSelectPalette(color)}
            activeColor={activeColor}
            key={index}
            color={color}
          />
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingRight: 10,
        }}>
        {parts.map((part, index) => (
          // @ts-expect-error TS(2322): Type '{ children: string; key: number; onPress: ()... Remove this comment to see the full error message
          <WigPartLabel
            key={index}
            onPress={() => onSelectPart(part)}
            activePart={activePart}>
            {part}
          </WigPartLabel>
        ))}
      </View>
    </View>
  );
}

export default Filters;

const parts = ['Lid', 'Crease', 'Outer Corner'];
// @ts-expect-error TS(2339): Property 'children' does not exist on type '{}'.
const WigPartLabel = React.memo(({ children, activePart, onPress }) => {
  const isActive = activePart === children;
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          height: 40,
          width: 120,
          backgroundColor: isActive ? '#472723' : 'white',
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ color: isActive ? 'white' : 'black', fontSize: 15 }}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const colors = [
  '#7B5749',
  '#D19F7E',
  '#F3D6D0',
  '#E5AD7C',
  '#B79182',
  '#F5DAC5',
];

const ColorCircle = React.memo(props => {
  // @ts-expect-error TS(2339): Property 'color' does not exist on type '{}'.
  const { color, onPress, activeColor } = props;
  const activeColorProps = {
    borderColor: 'white',
    borderWidth: 7,
    width: 67,
    height: 67,
    shadowOffset: {
      width: 1, // Horizontal offset
      height: 1, // Vertical offset
    },
    shadowColor: 'rgba(0, 0, 0, 0.2)', // Shadow color and opacity
    shadowOpacity: 1, // Shadow opacity (0 to 1)
    shadowRadius: 5, // Blur radius
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          marginRight: 10,
          marginTop: 20,
          width: 60,
          height: 60,
          borderRadius: 50,
          backgroundColor: color,
          ...(activeColor === color ? { ...activeColorProps } : {}),
        }}></View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  bottomDrawer: {
    height: 220,
    marginTop: -30,
    backgroundColor: '#FBF7F2',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    paddingTop: 20,
    paddingLeft: 20,
  },
  camera: {
    flex: 1,
  },
  colorsContainer: {
    flex: 1,
  },
  iconContainer: {
    backgroundColor: '#F3D6D0',
    borderRadius: 25,
    height: 50,
    width: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 44,
    right: 24,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
});
