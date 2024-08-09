import React, { useContext } from 'react';
import { ScrollView, Text } from 'react-native';
import Page from '../../../components/Page';
import TopActions from '../../../components/TopActions';
import { ThemeContext } from '../../../contexts/ThemeContext';

import { INavigation } from '../../../types';

interface AddressProps extends INavigation {}

const Address: React.FC<AddressProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Page backgroundColor={theme.palette.common.white}>
      <TopActions navigation={navigation} />

      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Text style={theme.typography.h2}>My Address</Text>
      </ScrollView>
    </Page>
  );
};

export default Address;
