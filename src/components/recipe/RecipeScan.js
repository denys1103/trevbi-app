import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, useWindowDimensions, Platform, SafeAreaView, TouchableWithoutFeedback, ScrollView, Linking, FlatList } from 'react-native';
import { useCameraDevice, Camera } from 'react-native-vision-camera';
import { Camera as VisionCamera } from 'react-native-vision-camera-text-recognition';
import Reanimated, { useAnimatedProps, useSharedValue, interpolate, Extrapolation } from 'react-native-reanimated'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Spinner from 'react-native-loading-spinner-overlay';
import client, {fontPixel, heightPixel} from '../../config';
import { GlobalContext } from '../../context';
import WhiteCross from '../scan/WhiteCross';

Reanimated.addWhitelistedNativeProps({
  zoom: true,
})
const ReanimatedCamera = Reanimated.createAnimatedComponent(VisionCamera)

const RecipeScanScreen = ({ navigation }) => {
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const photoCamera = useRef(null);
  const {height, width} = useWindowDimensions();
  const [okBtnStatus, setOkBtnStatus] = useState(true);
  const [modalData, setModalData] = useState({});
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);
  const [recipeIngredients, setRecipeIngredients] = useState(null);
  const {
    selectedDiets,
  } = useContext(GlobalContext);

  const device = useCameraDevice('back', {
    physicalDevices: ['ultra-wide-angle-camera', 'wide-angle-camera', 'telephoto-camera']
  });
  const zoom = useSharedValue(device?.neutralZoom || 1);
  const zoomOffset = useSharedValue(0);

  const gestureZoom = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value
    })
    .onUpdate(event => {
      const z = zoomOffset.value * event.scale;
      zoom.value = interpolate(
        z,
        [1, 10],
        [device?.minZoom || 1, device?.maxZoom || 10],
        Extrapolation.CLAMP,
      )
    })

  const animatedProps = useAnimatedProps(() => ({
    zoom: zoom.value,
  }));

  useEffect(() => {
    const requestCameraPermission = async () => {
      const status = await Camera.getCameraPermissionStatus();
      if (status === 'not-determined' || status === 'denied') {
        const newStatus = await Camera.requestCameraPermission();
        setHasPermission(newStatus === 'granted');
      } else {
        setHasPermission(status === 'granted');
      }
    };
    requestCameraPermission();
  }, []);

  const captureAndRecipe = async () => {
    if (device) {
      try {
        setOkBtnStatus(false);
        setModalVisibleStatus(false);

        const photo = await photoCamera.current.takeSnapshot({
          quality: 100
        })
        const photoURI = Platform.OS === 'ios' ? photo.path : `file://${photo.path}`;
        setCapturedPhoto(photoURI);
        if(photoURI){
          try {
            const formData = new FormData();
            formData.append('image', {
              uri: photoURI,
              type: 'image/jpeg',
              name: 'food.jpg',
            });
            formData.append('diets', selectedDiets);
      
            const response = await client.post('/recipe', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            if (response.data.success) {
              setRecipeIngredients(response.data.results);
            } else {
              console.log('server error!');
            }
          } catch (err) {
            console.error('Error fetching recipe:', err);
            setIsScanning(false);
            setOkBtnStatus(true);
          }
        }
        setIsScanning(false);
        setOkBtnStatus(true);
      } catch (error) {
        setIsScanning(false);
        setOkBtnStatus(true);
        console.log(error)
        Alert.alert('Error', 'Failed to capture the photo.');
      }
    }
  };

  const resetScan = () => {
    setCapturedPhoto(null);
    setIsScanning(true);
    setModalData({});
    setModalVisibleStatus(false);
    setRecipeIngredients(null);
  };

  if (!hasPermission) {
    return (
      <View style={[styles.permissionContainer, StyleSheet.absoluteFill]}>
        <Text allowFontScaling={false} style={styles.permissionText}></Text>
        <View style={styles.permissionButtonView}>
          <TouchableOpacity
            style={styles.okButton}
            onPress={async () => {
              const newStatus = await Camera.requestCameraPermission();
              setHasPermission(newStatus === 'granted');
            }}
          >
            <Text allowFontScaling={false} style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback
        onPress={() => {setModalVisibleStatus(false)}}
        disabled={true}
      >
        <GestureHandlerRootView style={styles.container}>
          <Spinner visible={!okBtnStatus} />
          {isScanning && !!device && (
            <GestureDetector gesture={gestureZoom}>
              <ReanimatedCamera
                style={StyleSheet.absoluteFill}
                device={device}
                ref={photoCamera}
                isActive={true}
                photo={true}
                video={true}
                animatedProps={animatedProps}
              />
            </GestureDetector>
          )}

          {capturedPhoto && (
            <TouchableOpacity
              onPress={() => {
                // setModalVisibleStatus(false);
              }}
              style={(StyleSheet.absoluteFill, {backgroundColor: 'rgba(255,255,255,1)', width:width, height:height})}
              activeOpacity={0.9}
            >
            </TouchableOpacity>
          )}

          {!isScanning && (
            <View style={StyleSheet.absoluteFill}>
                <View style={styles.scanPanelStyle}>
                  <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />
                  {recipeIngredients && (
                    <ScrollView
                      contentContainerStyle={{
                        paddingVertical: heightPixel(5),
                      }}
                      style={{
                        maxHeight: (height - heightPixel(100)),
                      }}
                    >
                      {recipeIngredients.split('\n').map((ingredient, index) => (
                        <Text allowFontScaling={false} key={index} style={styles.ingredientItem}>
                          {ingredient}
                        </Text>
                      ))}
                    </ScrollView>
                  )}
                </View>
            </View>
          )}

          <View style={styles.descriptionPanel}>
            {isScanning ? (
              okBtnStatus ? (<>
                <Text allowFontScaling={false} style={
                  {
                      fontFamily: 'LEMONMILK-Bold',
                      paddingTop: heightPixel(16),
                      color: 'black', 
                      fontSize: fontPixel(22)
                  }}>A clear pic means a better
                </Text>
                <Text allowFontScaling={false} style={
                  {
                      fontFamily: 'LEMONMILK-Bold',
                      paddingTop: heightPixel(5),
                      paddingBottom: heightPixel(16),
                      color: 'black', 
                      fontSize: fontPixel(22)
                  }}>recipe-steady that shot!
                </Text>
              </>) : <></>
            ) : (
              <></>
            )}
          </View>
          <View style={styles.goToHomePanel}>
            {isScanning ? (
              okBtnStatus ? (<>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.goToBackBtnStyle}
                  onPress={() => {
                    navigation.navigate('Dashboard');
                  }}>
                  <WhiteCross />
                </TouchableOpacity>
              </>) : <></>
            ) : (
              <></>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {isScanning ? (
              okBtnStatus ? (<>
                <View style={styles.scanGroupStyle}>
                  <TouchableOpacity style={styles.scanButton} onPress={captureAndRecipe}>
                    <Text allowFontScaling={false} style={styles.scanButtonText}>Scan</Text>
                    <Text allowFontScaling={false} style={styles.scanButtonText}>Foods</Text>
                  </TouchableOpacity>
                </View>
                <Text allowFontScaling={false} style={
                  {
                      fontFamily: 'LEMONMILK-Regular',
                      paddingTop: heightPixel(8),
                      color: 'black', 
                      fontSize: fontPixel(18)
                  }}>App camera
                </Text>
              </>) : <></>
            ) : (
              !modalVisibleStatus ?
              <TouchableOpacity style={styles.cancelButton} onPress={resetScan}>
                <Text allowFontScaling={false} style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
              :
              <></>
            )}
          </View>
        </GestureHandlerRootView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textBlock: { flexDirection: 'row', flexWrap: 'wrap' },
  permissionContainer: {
    backgroundColor: '#9bba77',
    alignItems: 'center',
    width: '100%',
  },
  permissionButtonView: {
    paddingTop: '20%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: heightPixel(40),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  okButton: {
    backgroundColor: '#063225',
    paddingVertical: heightPixel(10),
    paddingHorizontal: heightPixel(16),
    borderRadius: heightPixel(8),
    marginHorizontal: heightPixel(20),
  },
  cancelButton: {
    backgroundColor: 'rgba(255,0,0,0.6)',
    padding: heightPixel(16),
    borderRadius: heightPixel(8),
    marginHorizontal: heightPixel(20),
  },
  buttonText: { color: 'white', fontSize: fontPixel(18), fontFamily: 'LEMONMILK-Bold' },
  scanPanelStyle: {
    padding: heightPixel(20),
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  descriptionPanel: {
    position: 'absolute',
    top: heightPixel(50),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  scanButton: {
    backgroundColor: '#063225',
    paddingVertical: heightPixel(5),
    paddingHorizontal: heightPixel(20),
    borderRadius: heightPixel(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPixel(10),
    marginHorizontal: '3%',
    width: '40%',
  },
  scanButtonText: { color: 'white', fontSize: fontPixel(16), fontFamily: 'LEMONMILK-Medium' },
  scanGroupStyle: {
    flexDirection: 'row',
  },
  capturedImage: {
    width: '100%',
    height: heightPixel(300),
  },
  ingredientItem: {
    fontSize: fontPixel(18),
    color: '#2e2e34',
    marginBottom: heightPixel(3),
  },
  goToHomePanel: {
    position: 'absolute',
    top: heightPixel(30),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  goToBackBtnStyle: {
    width: heightPixel(25),
    height: heightPixel(25),
    top: heightPixel(5),
    right: heightPixel(5),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RecipeScanScreen;
