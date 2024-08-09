import { Feather, FontAwesome } from '@expo/vector-icons';
import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import HtmlView from '../../components/HtmlView';
import BottomView from '../../components/BottomView';
import Button from '../../components/Button';
import Carousel from '../../components/Carousel';
import { TextInput } from 'react-native-paper';
// import ExpandableText from '../../components/ExpandableText';
import RNPickerSelect from 'react-native-picker-select';
import Page from '../../components/Page';
import TopActions from '../../components/TopActions';
import { useWishlistData } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useSnackbar } from '../../hooks/useSnackbar';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Image, IProduct, Variation, Term, Bundle } from '../../types';
import { partnerProducts } from '../Partners/partnerProducts';

import Config from '../../config';

// @ts-ignore
const Product = ({ navigation, route }) => {
  const data: IProduct = route.params.data;
  const { productId } = route.params;
  const showAddToCart = route.params.showAddToCart === false ? false : true;

  const { theme } = useContext(ThemeContext);
  const showSnackbar = useSnackbar();
  const { onLike, isLiked } = useWishlistData();
  const { cartData, addToCart } = useCart();

  const [stockStatus, setStockStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [variationId, setVariationId] = useState(0);
  const [variataionList, setVariationList] = useState<Bundle[]>([]);
  const [prevSelection, setPrevSelection] = useState<
    { id: Number; name: string; option: string; slug: string }[]
  >([]);
  const [resetValue, setResetValue] = useState(false);
  const [oneVariationSelected, setOneVariationSelected] = useState(false);

  useEffect(() => {
    const partnerProduct = partnerProducts.filter(p => p.id === productId);
    const actualProduct = partnerProduct?.[0];

    if (actualProduct) {
      route.params.data = actualProduct;
    }
  }, [productId]);

  useEffect(() => {
    fetchProductFirstCall();
  }, []);

  const startingPrice = (
    parseInt(data?.prices?.price_range.min_amount) /
    Math.pow(10, data?.prices?.currency_minor_unit)
  ).toFixed(data?.prices?.currency_minor_unit);

  const maximumPrice = (
    parseInt(data?.prices?.price_range.max_amount) /
    Math.pow(10, data?.prices?.currency_minor_unit)
  ).toFixed(data?.prices?.currency_minor_unit);

  const currency = data?.prices?.currency_symbol;
  const fetchProductFirstCall = () => {
    // Fetch the variation data

    fetch(
      `${Config.API_V1_URL}/wp-json/wc/v3/products/${data.id}/variations?per_page=100&${Config.WOO_REST_API_KEY}`,
    )
      .then(response => response.json())
      .then(variations => {
        const newObjArray: Bundle[] = [];

        // Create an object to store bundles
        const bundles: { [key: string]: Bundle } = {};

        // Iterate through variations
        variations.forEach((attr: Variation) => {
          attr.attributes.forEach((term: Term) => {
            const { name, option } = term;
            // Check if the bundle exists, if not, create it
            if (!bundles[name]) {
              bundles[name] = {
                id: 0,
                name,
                option: [],
                slug: `bundle-${name.toLowerCase().replace(' ', '-')}`,
              };
            }
            // Add options to the set to ensure uniqueness
            const optionSet = new Set(bundles[name]?.option);
            optionSet.add(option);
            // Update the bundle's options array with unique values
            bundles[name]!.option = Array.from(optionSet).sort();
          });
        });

        // Convert the bundles object to an array
        Object.values(bundles).forEach(bundle => {
          newObjArray.push(bundle);
        });

        // Now newObjArray contains the desired structure with unique options
        setVariationList(newObjArray);
      })
      .catch(error => {
        console.log('Error fetching variations:', error);
      });
  };
  const fetchProduct = (value: string, bundleName: string) => {
    // Fetch the variation data based on the selected value
    fetch(
      `${Config.API_V1_URL}/wp-json/wc/v3/products/${data.id}/variations?per_page=100&${Config.WOO_REST_API_KEY}`,
    )
      .then(response => response.json())
      .then(variations => {
        const variationWithSelectedOption = variations.filter(
          (variation: Variation) => {
            return variation.attributes.some((attribute: Term) => {
              return (
                attribute.option === value && attribute.name === bundleName
              );
            });
          },
        );

        if (variataionList.length > 1) {
          const slug = bundleName.toLowerCase().replace(/\s+/g, '-');

          prevSelection.push({
            id: 0,
            name: bundleName,
            option: value,
            slug: slug,
          });

          const newObjArray: Bundle[] = [];

          // Create an object to store bundles
          const bundles: { [key: string]: Bundle } = {};

          // Iterate through variations
          variationWithSelectedOption.forEach((attr: Variation) => {
            attr.attributes.forEach((term: Term) => {
              const { name, option } = term;
              // Check if the bundle exists, if not, create it
              if (!bundles[name]) {
                bundles[name] = {
                  id: 0,
                  name,
                  option: [],
                  slug: `${name}`,
                };
              }
              // Add options to the set to ensure uniqueness
              const optionSet = new Set(bundles[name]?.option);
              optionSet.add(option);
              // Update the bundle's options array with unique values
              bundles[name]!.option = Array.from(optionSet).sort();
            });
          });

          // Convert the bundles object to an array
          Object.values(bundles).forEach(bundle => {
            newObjArray.push(bundle);
          });

          if (prevSelection.length === 4) {
            variations.map((attr: Variation) => {
              const identical = attr.attributes.every((obj, index) => {
                const prevObj = prevSelection[index];
                // Compare each property of the objects
                return (
                  obj.name === prevObj?.name &&
                  obj.option === prevObj.option &&
                  obj.slug === prevObj.slug
                );
              });
              if (identical) {
                setVariationId(attr.id);
                if (attr.stock_status === 'outofstock') {
                  setStockStatus(false);
                } else {
                  setStockStatus(true);
                }
              }
            });
          }

          // Now newObjArray contains the desired structure with unique options
          setVariationList(newObjArray);
        } else {
          setVariationId(variationWithSelectedOption[0].id);
          if (variationWithSelectedOption[0].stock_status === 'outofstock') {
            setStockStatus(false);
            setOneVariationSelected(true);
          } else {
            setStockStatus(true);
          }
        }
      })
      .catch(error => {
        console.log('Error fetching variations:', error);
      });
  };

  const handleClear = () => {
    setPrevSelection([]);
    setVariationList([]);
    setOneVariationSelected(false);
    setStockStatus(false);
    setResetValue(true);
    setSelectedOption(null);
    fetchProductFirstCall();
  };

  return (
    data && (
      <Page backgroundColor={theme.palette.common.white}>
        {/* Product Carousel */}
        <TopActions
          navigation={navigation}
          rightActions={[
            (props: any) => (
              <View style={{ flexDirection: 'row', gap: 20 }} {...props}>
                <Feather
                  name="share-2"
                  size={24}
                  color="#472723"
                  onPress={() => {
                    showSnackbar('Copied link to clipboard');
                  }}
                />
                <TouchableOpacity onPress={() => onLike(data)}>
                  {isLiked(data.id) ? (
                    <FontAwesome name="heart" size={24} color="#472723" />
                  ) : (
                    <FontAwesome name="heart-o" size={24} color="#472723" />
                  )}
                </TouchableOpacity>
              </View>
            ),
          ]}
        />
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{
              flex: 0.9,
              backgroundColor: theme.palette.background.primary,
            }}>
            <Carousel items={data.images.map((img: Image) => `${img.src}`)} />
            <View
              style={{
                paddingVertical: 20,
                paddingHorizontal: 30,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  gap: 20,
                }}>
                <Text style={theme.typography.h2}>{data.name}</Text>
                <Text style={theme.typography.h4}>
                  {
                    <Text>{`${currency}${startingPrice} - ${currency}${maximumPrice}`}</Text>
                  }
                </Text>

                <HtmlView html={`${data.short_description}`} />
                {showAddToCart && !productId ? (
                  <View>
                    {data.attributes.length > 0 &&
                      data.attributes.map((attr, index) => {
                        return (
                          <View key={`${attr.id}-${index}`}>
                            <Text style={{ paddingBottom: 12 }}>
                              {attr.name}
                            </Text>
                            <RNPickerSelect
                              key={resetValue ? 'reset' : null}
                              onValueChange={value => {
                                if (value === null) {
                                  setSelectedOption(null);
                                } else {
                                  setSelectedOption(value);
                                }
                                if (value && data.id) {
                                  fetchProduct(value, attr.name);
                                }
                              }}
                              placeholder={{
                                label: 'Select an option...',
                                value: null,
                              }}
                              Icon={() => {
                                return (
                                  <FontAwesome
                                    name="caret-down"
                                    size={24}
                                    color="black"
                                  />
                                );
                              }}
                              style={{
                                inputIOS: {
                                  paddingVertical: 12,
                                  paddingHorizontal: 10,
                                  borderWidth: 0.5,
                                  borderColor: '#8A8A8F',
                                  borderRadius: 4,
                                  color: 'black',
                                  paddingRight: 30, // to ensure the text is never behind the icon
                                  backgroundColor: 'white', // Set background color to white
                                },
                                inputAndroid: {
                                  paddingHorizontal: 10,
                                  paddingVertical: 8,
                                  borderWidth: 0.5,
                                  borderColor: '#8A8A8F',
                                  borderRadius: 8,
                                  color: 'black',
                                  paddingRight: 30, // to ensure the text is never behind the icon
                                  backgroundColor: 'white', // Set background color to white
                                },
                                iconContainer: {
                                  top: 10,
                                  right: 12,
                                },
                                placeholder: {
                                  color: 'black', // Set placeholder color to black
                                },
                              }}
                              items={variataionList
                                .filter(bundle => bundle.name === attr.name) // Filter by bundle name
                                .flatMap(bundle =>
                                  bundle.option.map(option => ({
                                    label: option,
                                    value: option,
                                  })),
                                )}
                            />
                            {index < data.attributes.length - 1 && ( // Add space between bundles if not the last one
                              <View style={{ height: 20 }} />
                            )}
                          </View>
                        );
                      })}
                    <TouchableOpacity onPress={handleClear}>
                      <Text style={{ color: 'gray', marginTop: 8 }}>Clear</Text>
                    </TouchableOpacity>
                    {(!stockStatus && prevSelection.length === 4) ||
                      (!stockStatus && oneVariationSelected && (
                        <View style={{ marginTop: 20 }}>
                          {/* <Text onPress={() => setSelectedOption(null)}>Clear</Text> */}
                          <Text
                            style={{
                              color: 'red',
                              fontFamily: theme.font.Roboto,
                              fontSize: 16,
                            }}>
                            {'Out of stock'}
                          </Text>
                        </View>
                      ))}
                  </View>
                ) : (
                  <View />
                )}
                {showAddToCart ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                      gap: 10,
                    }}>
                    <TextInput
                      autoCapitalize="none"
                      label={'Quantity'}
                      mode="outlined"
                      keyboardType="numeric"
                      defaultValue="1"
                      style={{
                        width: '30%',
                        height: 42,
                        marginBottom: 4,
                        backgroundColor: 'white',
                      }}></TextInput>
                    <View style={{ width: '100%' }}>
                      <Button
                        width={'70%'}
                        type="primary"
                        disabled={!stockStatus}
                        onPress={
                          stockStatus
                            ? () => addToCart({ id: variationId, quantity: 1 })
                            : () => {}
                        }>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'baseline',
                            gap: 10,
                          }}>
                          <FontAwesome
                            name="shopping-cart"
                            size={24}
                            color="white"
                          />
                          <Text
                            style={{
                              ...theme.typography.default,
                              color: 'white',
                              fontFamily: theme.font.RobotoBold,
                              fontSize: 16,
                            }}>
                            Add To Cart
                          </Text>
                        </View>
                      </Button>
                    </View>
                  </View>
                ) : (
                  <View />
                )}

                <View
                  style={{
                    borderBottomColor: theme.palette.common.grey,
                    borderBottomWidth: 0.5,
                  }}
                />
                <HtmlView html={`${data.description}`} />
                {/* <ExpandableText text={data.description} /> */}
                <View
                  style={{
                    borderBottomColor: theme.palette.common.grey,
                    borderBottomWidth: 0.5,
                  }}
                />
                <Text style={theme.typography.h4}>Delivery and Returns</Text>
                <View
                  style={{
                    borderBottomColor: theme.palette.common.grey,
                    borderBottomWidth: 0.5,
                  }}
                />
              </View>
            </View>
          </ScrollView>
          <BottomView heightPercentage={0.11}>
            <View style={{ flex: 1, marginTop: 20 }}>
              <View
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                }}>
                <Button
                  width={250}
                  onPress={() =>
                    navigation.navigate('VirtualCamera', { data: data })
                  }
                  type="secondary">
                  Try it now
                </Button>
                <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                  <View style={{ position: 'relative' }}>
                    <View
                      style={{
                        backgroundColor: theme.palette.text.primary,
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Feather name="shopping-bag" size={20} color="white" />
                    </View>
                    {cartData?.items.length ? (
                      <View
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: 0,
                          backgroundColor: '#472723',
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: 'white',
                          height: 20,
                          width: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            ...theme.typography.label,
                            fontFamily: theme.font.RobotoBold,
                            color: 'white',
                          }}>
                          {cartData?.items.length}
                        </Text>
                      </View>
                    ) : (
                      ''
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </BottomView>
        </View>
      </Page>
    )
  );
};

export default React.memo(Product);
