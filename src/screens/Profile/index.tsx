import React, { useContext } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Button from '../../components/Button';
import Page from '../../components/Page';
import TopActions from '../../components/TopActions';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { INavigation } from '../../types';

interface NavigationProps extends INavigation {}

function Profile({ navigation }: NavigationProps) {
  const { theme } = useContext(ThemeContext);

  const { logout, authState } = useAuth();
  return (
    <Page backgroundColor={theme.palette.background.primary}>
      <TopActions navigation={navigation} />
      <ScrollView style={styles.container}>
        {/* Cover Photo */}
        <View style={styles.coverPhoto} />

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            style={{
              width: 100,
              height: 100,
            }}
            resizeMode="cover"
            source={{
              uri: `${authState?.user?.avatar_urls?.['96']}`,
            }}
          />
          {/* <Avatar.Text size={100} label="JD" style={styles.avatar} /> */}
        </View>

        {/* Name and Email */}
        <View style={styles.infoContainer}>
          <Text style={theme.typography.h2}>{`${authState?.user?.name}`}</Text>
          <Text style={theme.typography.label}>{authState?.user?.email}</Text>
        </View>
        <View style={styles.profileRowContainer}>
          {/* <ProfileRow
            label="My medical"
            value=""
            onPress={() => {
              navigation.navigate('Health');
            }}
          /> */}
          <ProfileRow
            label="My address"
            value=""
            onPress={() => {
              navigation.navigate('Address');
            }}
          />
          <ProfileRow
            label="My orders"
            value="2 Orders"
            onPress={() => {
              navigation.navigate('Orders');
            }}
          />
          <ProfileRow
            label="My returns"
            value="1 Return"
            onPress={() => {
              navigation.navigate('Returns');
            }}
          />
          <ProfileRow
            label="Payment"
            value=""
            onPress={() => {
              navigation.navigate('Payment');
            }}
          />
          <ProfileRow
            label="Change Password"
            value=""
            onPress={() => {
              navigation.navigate('Password');
            }}
          />
          <ProfileRow
            label="Settings"
            value=""
            onPress={() => {
              navigation.navigate('Settings');
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button type="secondary" width={100} onPress={logout}>
            Logout
          </Button>
        </View>
      </ScrollView>
    </Page>
  );
}

interface IProfileRow {
  label: string;
  value: string;
  onPress?: () => void;
}

const ProfileRow = ({ label, value, onPress }: IProfileRow) => {
  const { theme } = useContext(ThemeContext);

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          ...styles.row,
          borderBottomColor: theme.palette.text.secondary,
        }}>
        <Text style={theme.typography.default}>{label}</Text>
        <Text style={theme.typography.default}>{value}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverPhoto: {
    width: '100%',
    backgroundColor: '#cecece',
    height: 100, // Adjust the height as needed
    resizeMode: 'cover',
  },
  avatarContainer: {
    position: 'absolute',
    top: 50, // Adjust the top position to center the avatar
    alignSelf: 'center',
    borderRadius: 75, // 1/4 of the cover photo height
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#fff', // Optional: add a border to the avatar
  },
  avatar: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  infoContainer: {
    marginTop: 65,
    gap: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: 'gray',
  },
  profileRowContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
});
export default Profile;
