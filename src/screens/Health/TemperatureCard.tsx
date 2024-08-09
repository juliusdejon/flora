import { Card, Title } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

const TemperatureCard = (props: { temp: string }) => {
  const { temp } = props;
  return (
    <Card style={{ width: '50%' }}>
      <Card.Content>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* Temperature Text */}
          <Title style={{ textAlign: 'center', fontSize: 24 }}>
            <Text>{temp}°C</Text>
          </Title>

          {/* Temperature Icon */}
          <Ionicons
            name="thermometer-outline"
            size={40}
            color="#007BFF" // Customize the color as needed
            style={{ alignSelf: 'center', marginTop: 10 }}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

export default TemperatureCard;
