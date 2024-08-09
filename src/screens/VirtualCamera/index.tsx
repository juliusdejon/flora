import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { Modal } from 'react-native-paper';

import axios from 'axios';
import { Camera, CameraType } from 'expo-camera';
import React, { useContext, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from '../../config';

import BlhButton from '../../components/Button';

import Loading from '../../components/Loading';
import Page from '../../components/Page';
import TopActions from '../../components/TopActions';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Product from './Product';
import * as ImageManipulator from 'expo-image-manipulator';
// 15 seconds timeout
const FETCH_INTERVAL = 15000;

function VirtualTryItOnScreen({ navigation }: { navigation: any }) {
  const route = useRoute();
  // @ts-ignore
  const data = route?.params?.data;
  const [cameraRef, setCameraRef] = useState(null);
  const [loading, setLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState('');
  const { theme } = useContext(ThemeContext);
  const { authState } = useAuth();

  const [type, setType] = useState(CameraType.front);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRatio = '3:4';
  const { width } = Dimensions.get('window');
  const [widthRatio = 3, heightRatio = 4] = cameraRatio.split(':').map(Number);
  const windowWidth = Dimensions.get('window').width;
  const cameraWidth = windowWidth;
  const cameraHeight = (cameraWidth * heightRatio) / widthRatio;
  const centerX = width / 2;
  const { cartData } = useCart();
  const [visible, setVisible] = useState(true);
  const [resultLoading, setResultLoading] = useState(false);

  const hideModal = () => setVisible(false);

  const [jsonResult, setJsonResult] = useState('');

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const fetchResult = async () => {
      try {
        const response = await axios.post(
          `${Config.LAMBDA_GET_IMAGE_URL}`,
          { file_name: jsonResult, privateKey: Config.LAMBDA_PRIVATE_KEY },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.data.error.length > 0) {
          console.log(response.data.error);
          if (intervalId !== null) {
            clearInterval(intervalId);
          }
        }
        if (response.data.status === 'still processing') {
          // Clear previous interval if it exists
          if (intervalId !== null) {
            clearInterval(intervalId);
          }
          // Set interval to fetch data every 15 seconds
          // const intervalId = setInterval(fetchResult, 5000);

          intervalId = setInterval(fetchResult, FETCH_INTERVAL);
        }
        if (response.data.status != 'still processing') {
          // Clear interval
          if (intervalId !== null) {
            clearInterval(intervalId); // Clear interval
          }
          setResultLoading(false);
          const transformedImage = `data:image/jpeg;base64,${response.data.image}`;
          setResultImage(transformedImage);
        }
        // return [null, response];
      } catch (error) {
        console.log(error);
        if (intervalId !== null) {
          clearInterval(intervalId);
        }
        // return [error, null];
      }
    };

    if (jsonResult.length > 0) {
      setResultLoading(true);
      fetchResult();
    }

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId); // Clear interval on unmount
      }
    };
  }, [jsonResult]);

  if (!permission) {
    return <Loading />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View
          style={{
            marginBottom: 20,
            alignItems: 'center',
          }}>
          <Image source={require('../../../assets/images/camera-logo.png')} />
        </View>
        <Text
          style={{
            fontFamily: theme.font.RobotoBold,
            fontSize: 24,
            textAlign: 'center',
          }}>
          Enable Camera
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: '#b2b2b2',
            paddingHorizontal: 50,
            fontSize: 16,
            fontFamily: theme.font.RobotoBold,
            paddingVertical: 30,
          }}>
          Please provide us access to your camera, which is required for trying
          the product.
        </Text>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            alignItems: 'center',
          }}>
          <BlhButton onPress={requestPermission} type="primary">
            Allow
          </BlhButton>
        </View>
      </View>
    );
  }

  function toggleCameraType() {
    setType(current =>
      current === CameraType.back ? CameraType.front : CameraType.back,
    );
  }

  const takePicture = async () => {
    if (cameraRef) {
      // @ts-ignore
      const photo = await cameraRef.takePictureAsync({
        imageType: 'jpg',
        base64: true,
        orientation: 'portrait',
      });
      if (Platform.OS === 'ios') {
        let rotatedImage = await ImageManipulator.manipulateAsync(
          photo.uri,
          [
            {
              rotate: 0, // Adjust the rotation angle as needed
            },
          ],
          {
            compress: 1,
            base64: true,
          },
        );
        setCapturedImage(rotatedImage.uri);
        sendImageToAPI(rotatedImage.base64!.trim());
      } else {
        setCapturedImage(photo.uri);
        sendImageToAPI(photo.base64!.trim());
      }
    }
  };

  const sendImageToAPI = async (base64Image: String) => {
    setLoading(true);
    try {
      const reqData = {
        productId: `${data.id}`,
        userId: authState?.user?.id,
        privateKey: Config.LAMBDA_PRIVATE_KEY,
        file: base64Image,
      };
      const response = await axios.post(
        `${Config.LAMBDA_UPLOAD_IMAGE_URL}`,
        reqData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setLoading(false);

      // Handle API response
      if (response?.data) {
        // trigger the jsonResult
        setJsonResult(response.data);
      }
    } catch (error) {
      // Handle error
      console.error('Error sending image to API:', error);
    } finally {
      setLoading(false);
    }
  };

  const rightActions = [
    (props: any) => (
      <View key={`cart-${props.id}`} style={{ position: 'relative' }}>
        <MaterialCommunityIcons
          name="shopping-outline"
          size={24}
          color="#472723"
          onPress={() => navigation.navigate('Cart')}
          {...props}
        />
        {cartData?.items.length ? (
          <View
            style={{
              position: 'absolute',
              top: -2,
              right: 0,
              backgroundColor: theme.palette.text.primary,
              borderRadius: 5,
              height: 10,
              width: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}></View>
        ) : (
          ''
        )}
      </View>
    ),
  ];

  return (
    <Page backgroundColor={theme.palette.background.primary}>
      <TopActions navigation={navigation} rightActions={rightActions} />
      <Product data={data} />
      <View style={styles.cameraContainer}>
        {capturedImage ? (
          resultImage ? (
            <>
              <Image
                source={{ uri: resultImage }}
                style={{
                  width: cameraWidth,
                  height: cameraHeight,
                  ...(type === 'front' && { transform: [{ scaleX: -1 }] }),
                }}
              />
              <View style={styles.retakeContainer}>
                <Button title="Undo" onPress={() => setResultImage('')} />
              </View>
            </>
          ) : (
            <>
              <Image
                source={{ uri: capturedImage }}
                style={{
                  width: cameraWidth,
                  height: cameraHeight,
                  ...(type === 'front' && { transform: [{ scaleX: -1 }] }),
                }}
              />
              {loading && (
                <View style={styles.overlay}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
              {resultLoading && (
                <View style={styles.overlay}>
                  <Text style={{ color: 'white', marginBottom: 20 }}>
                    Processing image
                  </Text>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
              <View style={styles.retakeContainer}>
                <Button
                  title="Retake?"
                  onPress={() => setCapturedImage(null)}
                />
              </View>
            </>
          )
        ) : (
          <Camera
            // @ts-ignore
            ref={ref => setCameraRef(ref)}
            {...(Platform.OS === 'android'
              ? {
                  useCamera2Api: true,
                }
              : {})}
            style={{
              width: cameraWidth,
              height: cameraHeight,
            }}
            {...(Platform.OS === 'android'
              ? {
                  ratio: cameraRatio,
                }
              : {})}
            type={type}>
            <View
              style={{
                ...styles.captureButtonContainer,
                left: centerX - 27,
                display: visible ? 'none' : undefined,
              }}>
              <TouchableOpacity onPress={takePicture}>
                <View style={styles.iconCaptureContainer}>
                  <MaterialCommunityIcons
                    name="camera-iris"
                    size={30}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name="camera-flip"
                    size={24}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Modal
              visible={visible}
              contentContainerStyle={{
                backgroundColor: 'white',
                marginLeft: 30,
                marginRight: 30,
                borderRadius: 20,
                height: 400,
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  padding: 24,
                }}>
                <Text
                  style={{
                    ...theme.typography.h3,
                    fontFamily: theme.font.Roboto,
                  }}>
                  Quick Tip
                </Text>
                <Image
                  source={require('../../../assets/images/tie-hair.png')}
                  style={{
                    width: 300,
                    height: 150,
                    borderRadius: 12,
                  }}
                />
                <Text
                  style={{
                    ...theme.typography.h4,
                    fontFamily: theme.font.RobotoBold,
                  }}>
                  Tie your hair for best results.
                </Text>
                <BlhButton type="primary" onPress={hideModal}>
                  OK
                </BlhButton>
              </View>
            </Modal>
          </Camera>
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  colorsContainer: {
    flex: 1,
  },
  iconCaptureContainer: {
    borderRadius: 30,
    backgroundColor: 'white',
    height: 60,
    width: 60,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  captureButtonContainer: {
    position: 'absolute',
    bottom: 44,
  },
  retakeContainer: {
    position: 'absolute',
    top: 14,
    right: 24,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(VirtualTryItOnScreen);
