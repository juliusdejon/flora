import { Feather, Octicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Page from '../../components/Page';
import Product from '../../components/Product';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useWishlistData } from '../../contexts/WishlistContext';
import useFetch from '../../hooks/useFetch';
import { INavigation, IProduct } from '../../types';
import { Avatar } from 'react-native-elements';
import { useAuth } from '../../contexts/AuthContext';

interface HomeProps extends INavigation {}

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const { onLike, isLiked } = useWishlistData();
  const [latestProducts, setLatestProducts] = useState<IProduct[]>([]);
  const [wigs, setWigs] = useState<IProduct[]>([]);
  const { authState } = useAuth();

  const {
    data: newArrivalsData,
    fetchData: fetchNewArrivals,
    isLoaded: isLoadedNewArrivals,
  } = useFetch<IProduct[]>({
    initialUrl: '/wp-json/wc/store/products?orderby=date&per_page=4',
  });

  const {
    data: wigsData,
    fetchData: fetchWigs,
    isLoaded: isLoadedWigs,
  } = useFetch<IProduct[]>({
    initialUrl: '/wp-json/wc/store/products?category=276',
  });

  useEffect(() => {
    setLatestProducts(newArrivalsData || []);
    fetchNewArrivals();
  }, [isLoadedNewArrivals]);

  useEffect(() => {
    setWigs(wigsData || []);
    fetchWigs();
  }, [isLoadedWigs]);

  return (
    <Page backgroundColor={theme.palette.common.white}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Navigation Bar*/}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 10,
            paddingBottom: 5,
          }}>
          <Image
            source={require('../../../assets/company-logo.png')}
            style={{
              width: '48%',
              height: 60,
              resizeMode: 'cover',
            }}
          />
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

        {/* Wigs Carousel */}
        <ImageBackground
          source={require('../../../assets/images/Page6Face.png')}
          resizeMode="cover"
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
                ...theme.typography.default,
                color: theme.palette.text.primary,
                paddingLeft: 10,
                paddingTop: 10,
              }}>
              {/* Featured collection */}
            </Text>
            <Text
              style={{
                ...theme.typography.h1,
                color: theme.palette.text.primary,
                fontFamily: theme.font.PlayfairDisplayBold,
                paddingTop: 10,
                paddingLeft: 10,
                paddingRight: 100,
              }}>
              {/* Lace Front Wigs */}
            </Text>
          </View>
        </ImageBackground>
        {/* New Arrivals Sections */}
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
            <Text style={theme.typography.h3}>New Arrivals</Text>
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
            {latestProducts.map(product => {
              const currency = product.prices.currency_symbol;
              const startingPrice = (
                parseInt(product.prices.price_range.min_amount) /
                Math.pow(10, product.prices.currency_minor_unit)
              ).toFixed(product.prices.currency_minor_unit);

              const maximumPrice = (
                parseInt(product.prices.price_range.max_amount) /
                Math.pow(10, product.prices.currency_minor_unit)
              ).toFixed(product.prices.currency_minor_unit);

              return (
                <View key={product.id}>
                  <Product
                    id={product.id}
                    onPress={() =>
                      navigation.navigate('Product', { data: product })
                    }
                    imageSrc={product.images[0]?.src}
                    category={product.categories[0]?.name || ''}
                    name={product.name}
                    price={`${currency}${startingPrice} - ${currency}${maximumPrice}`}
                    onLike={() => onLike(product)}
                    isLiked={isLiked(product.id)}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>
        {/* Medical Wigs Section */}
        <View
          style={{
            height: 370,
            backgroundColor: 'rgba(234, 218, 207, 0.5)',
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
            <Text style={theme.typography.h3}>Wigs</Text>
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
            {wigs
              .filter(
                product =>
                  product.prices &&
                  product.prices.price_range &&
                  product.prices.price_range.min_amount !== null,
              )
              .map(product => {
                const currency = product.prices.currency_symbol;
                const startingPrice = (
                  parseInt(product.prices.price_range.min_amount) /
                  Math.pow(10, product.prices.currency_minor_unit)
                ).toFixed(product.prices.currency_minor_unit);

                return (
                  <View key={product.id}>
                    <Product
                      id={product.id}
                      onPress={() =>
                        navigation.navigate('Product', { data: product })
                      }
                      imageSrc={product.images[0]?.src}
                      category={product.categories[0]?.name || ''}
                      name={product.name}
                      price={`${currency}${startingPrice}`}
                      onLike={() => onLike(product)}
                      isLiked={isLiked(product.id)}
                    />
                  </View>
                );
              })}
          </ScrollView>
        </View>
        {/* Feed Section */}
        <View
          style={{
            backgroundColor: theme.palette.common.white,
            padding: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'baseline',
              marginBottom: 24,
            }}>
            <Text style={{ ...theme.typography.h3, paddingLeft: 10 }}>
              Your Feed
            </Text>
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
          <Image
            source={require('../../../assets/images/Page6Section3.png')}
            style={{ width: '100%', height: 350 }}
          />
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 20,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: theme.palette.text.tertiary,
              }}>
              1 day ago | Trends
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, paddingRight: 2 }}>
              <Feather
                name="heart"
                size={20}
                color={theme.palette.text.tertiary}
              />
              <Text
                style={{
                  color: theme.palette.text.tertiary,
                }}>
                680
              </Text>
              <Octicons
                name="comment"
                size={20}
                color={theme.palette.text.tertiary}
              />
              <Text
                style={{
                  color: theme.palette.text.tertiary,
                }}>
                99
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Page>
  );
};

export default Home;
