import React, { useContext } from 'react';
import {
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { INavigation } from '../../../types';
import { cljProducts } from '../partnerProducts';
import { useAuth } from '../../../contexts/AuthContext';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { Avatar } from 'react-native-elements';
import Page from '../../../components/Page';
import Product from '../../../components/Product';

interface CljhairProps extends INavigation {}

const Cljhair: React.FC<CljhairProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { authState } = useAuth();

  return (
    <>
      <Page backgroundColor={theme.palette.common.white}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 10,
            paddingBottom: 5,
          }}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => navigation.navigate('Home')}>
            <Image
              source={require('../../../../assets/company-logo.png')}
              style={{
                width: '48%',
                height: 60,
                resizeMode: 'cover',
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={{ paddingRight: 20 }}>
            <Avatar
              rounded
              source={{
                uri: `${authState?.user?.avatar_urls?.['96']}`,
              }}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ paddingTop: 10 }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image
              source={require('../../../../assets/clj-main-product.png')}
              style={{
                width: '65%',
                height: 80,
                resizeMode: 'cover',
              }}
            />
            <Image
              source={require('../../../../assets/images/partners/cj-hair-logo.jpg')}
              style={{
                width: '35%',
                height: 80,
                resizeMode: 'contain',
              }}
            />
          </View>

          {/* Wigs Carousel */}
          <ImageBackground
            source={require('../../../../assets/clj-main-item.png')}
            resizeMode="contain"
            style={{
              height: 410,
              backgroundColor: theme.palette.background.secondary,
            }}>
            <View
              style={{
                paddingTop: 20,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(240, 231, 218, 0.28)',
              }}>
              <Text
                style={{
                  ...theme.typography.h1,
                  color: theme.palette.text.primary,
                  fontFamily: theme.font.PlayfairDisplayBold,
                  paddingTop: 10,
                  paddingLeft: 10,
                  paddingRight: 100,
                }}></Text>
            </View>
          </ImageBackground>

          {/* Products Sections */}
          <View
            style={{
              height: 370,
              backgroundColor: theme.palette.background.primary,
              paddingVertical: 20,
              paddingLeft: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'baseline',
                marginBottom: 24,
              }}>
              <Text style={theme.typography.h3}>Products</Text>
              <Text
                style={{
                  marginLeft: 'auto',
                  paddingRight: 16,
                  fontSize: 14,
                  color: theme.palette.text.tertiary,
                }}>
                View all
              </Text>
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
              {cljProducts.map(product => (
                <View key={product.id}>
                  <Product
                    id={product.id}
                    onPress={() =>
                      navigation.navigate('Product', {
                        data: product,
                        showAddToCart: false,
                      })
                    }
                    imageSrc={product.images[0]?.src}
                    category={product.categories[0]?.name || ''}
                    name={product.name}
                    price={`$${product.startingPrice} - $${product.maximumPrice}`}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </Page>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 350,
  },
});
export default Cljhair;
