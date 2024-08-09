import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import Page from '../../components/Page';
import { ThemeContext } from '../../contexts/ThemeContext';
import Textfield from '../../components/Textfield';
import TopActions from '../../components/TopActions';

import { INavigation } from '../../types';
import Button from '../../components/Button';

interface CartProps extends INavigation {}

const AddNewCard: React.FC<CartProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Page backgroundColor={theme.palette.common.white}>
      <TopActions navigation={navigation} />
      <View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
        <View style={{ flex: 0.9 }}>
          <Text style={{ ...theme.typography.h2, marginBottom: 30 }}>
            Add New Card
          </Text>
          <Textfield label="Card Number" />
          <View
            style={{
              flexDirection: 'row',
              gap: 35,
            }}>
            <View style={{ width: '45%' }}>
              <Textfield label="Expiration" />
            </View>
            <View style={{ width: '45%' }}>
              <Textfield label="CVC" />
            </View>
          </View>
        </View>

        <View style={{ flex: 0.1 }}>
          <Button
            width={'100%'}
            type="primary"
            onPress={() => navigation.navigate('PlaceOrder')}>
            Save
          </Button>
        </View>
      </View>
    </Page>
  );
};

export default AddNewCard;
