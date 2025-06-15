import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  useWindowDimensions,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  ScrollView,
  Switch,
  Dimensions,
  Keyboard,
} from 'react-native';
import {useCameraDevice, Camera} from 'react-native-vision-camera';
import {Camera as VisionCamera} from 'react-native-vision-camera-text-recognition';
import Reanimated, {
  useAnimatedProps,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import client, {
  fontPixel,
  heightPixel,
  widthPixel,
  appDir,
  indexRecipeFilePath,
  recipeImageRootURL,
} from '../../config';
import RNFS from 'react-native-fs';
import {GlobalContext} from '../../context';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});
const ReanimatedCamera = Reanimated.createAnimatedComponent(VisionCamera);

const RecipeScanScreen = ({navigation}) => {
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const photoCamera = useRef(null);
  const {height, width} = useWindowDimensions();
  const [okBtnStatus, setOkBtnStatus] = useState(true);
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);
  const [recipeIngredients, setRecipeIngredients] = useState(null);
  const [recipeResult, setRecipeResult] = useState(null);
  const [recipeResultImg, setRecipeResultImg] = useState(null);
  const [recipeId, setRecipeId] = useState(null);
  const [editRecipeIngredients, setEditRecipeIngredients] = useState(null);
  const {selectedDiets, selectedMeal, saveRecipe} = useContext(GlobalContext);
  const [isEnabled, setIsEnabled] = useState(false);
  const [servings, setServings] = useState(1);

  const device = useCameraDevice('back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });
  const zoom = useSharedValue(device?.neutralZoom || 1);
  const zoomOffset = useSharedValue(0);

  const gestureZoom = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value;
    })
    .onUpdate(event => {
      const z = zoomOffset.value * event.scale;
      zoom.value = interpolate(
        z,
        [1, 10],
        [device?.minZoom || 1, device?.maxZoom || 10],
        Extrapolation.CLAMP,
      );
    });

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

  const createAppDir = async () => {
    if (!(await RNFS.exists(appDir))) {
      await RNFS.mkdir(appDir);
    }
    if (!(await RNFS.exists(indexRecipeFilePath))) {
      await RNFS.writeFile(indexRecipeFilePath, JSON.stringify([]));
    }
  };

  const captureAndGetIngredients = async () => {
    if (device) {
      try {
        await createAppDir();
        setOkBtnStatus(false);
        setModalVisibleStatus(false);

        const photoPath = `${appDir}/recipePhoto_${Date.now()}.jpg`;

        const photo = await photoCamera.current.takeSnapshot({
          quality: 100,
        });
        await RNFS.copyFile(photo.path, photoPath);
        const photoURI =
          Platform.OS === 'ios' ? photoPath : `file://${photoPath}`;
        setCapturedPhoto(photoURI);
        if (photoURI) {
          try {
            const formData = new FormData();
            formData.append('image', {
              uri: photoURI,
              type: 'image/jpeg',
              name: 'food.jpg',
            });

            const response = await client.post(
              '/getIngredientsForRecipe',
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              },
            );
            if (response.data.success) {
              setRecipeIngredients(response.data.results);
              setEditRecipeIngredients(`${response.data.results}\n\n\n\n\n`);
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
        console.log(error);
        Alert.alert('Error', 'Failed to capture the photo.');
      }
    }
  };

  const scanAndRecipe = async () => {
    if (device) {
      try {
        setOkBtnStatus(false);
        setModalVisibleStatus(false);
        await new Promise(resolve => setTimeout(resolve, 200));

        if (capturedPhoto) {
          try {
            const formData = new FormData();
            formData.append('image', {
              uri: capturedPhoto,
              type: 'image/jpeg',
              name: 'food.jpg',
            });
            formData.append('diets', selectedDiets);
            formData.append('meal', selectedMeal);
            formData.append('ingredients', recipeIngredients);
            formData.append('useAI', isEnabled ? 1 : 0);
            formData.append('servings', servings < 1 ? 1 : servings);

            const response = await client.post('/makeMealRecipeV5', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            if (response.data.success) {
              if (response.data.results.recipeId) {
                setRecipeId(response.data.results.recipeId);
              }
              if (response.data.results.recipeText) {
                setRecipeResult(response.data.results.recipeText);
              }
              if (response.data.results.recipeImg) {
                setRecipeResultImg(response.data.results.recipeImg);
                // const photoPath = `${appDir}/recipe_img_${Date.now()}.jpg`;
                // const recipeImageURl =
                //   recipeImageRootURL + response.data.results.recipeImg;

                // const downloadResult = await RNFS.downloadFile({
                //   fromUrl: recipeImageURl,
                //   toFile: photoPath,
                // }).promise;

                // if (downloadResult.statusCode === 200) {
                //   const photoURI =
                //     Platform.OS === 'ios' ? photoPath : `file://${photoPath}`;
                //   setLocalRecipeResultImgUrl(photoURI);
                // } else {
                //   console.error('Download failed:', downloadResult.statusCode);
                // }
              }
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
        console.log(error);
        Alert.alert('Error', 'Failed to capture the photo.');
      }
    }
  };

  const saveRecipeHandle = async () => {
    if (recipeId) {
      await saveRecipe(recipeId);
    } else {
      Alert.alert('Failed', 'Failed to save recipe.');
    }
  };

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

  const numericCheckHandle = text => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 3) {
      setServings(numericText);
    }
  };

  const resetScan = () => {
    setCapturedPhoto(null);
    setIsScanning(true);
    setModalVisibleStatus(false);
    setRecipeIngredients(null);
    setEditRecipeIngredients(null);
    setRecipeResult(null);
    setRecipeResultImg(null);
    setRecipeId(null);
    setIsEnabled(false);
    setServings(1);
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
            }}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              Grant Permission
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={true}>
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
              style={
                (StyleSheet.absoluteFill,
                {
                  backgroundColor: 'rgba(255,255,255,1)',
                  width: width,
                  height: height,
                })
              }
              activeOpacity={0.9}></TouchableOpacity>
          )}

          {!isScanning && (
            <View style={StyleSheet.absoluteFill}>
              <View style={styles.scanPanelStyle}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[
                    styles.goToBackBtnStyle,
                    {width: heightPixel(80), marginBottom: heightPixel(5)},
                  ]}
                  onPress={resetScan}>
                  <Ionicons
                    size={fontPixel(18)}
                    name={'caret-back'}
                    style={{color: 'white'}}
                  />
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: fontPixel(14),
                      color: 'white',
                      fontFamily: 'LEMONMILK-Medium',
                    }}>
                    Back
                  </Text>
                </TouchableOpacity>
                {recipeIngredients && !recipeResult && (
                  <>
                    <Image
                      source={{uri: capturedPhoto}}
                      style={styles.capturedImage}
                    />
                    <View style={styles.switchBoxContent}>
                      <Switch
                        trackColor={{false: '#767577', true: '#61a14866'}}
                        thumbColor={isEnabled ? '#61a148' : '#ffffff'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                      />
                      <Text
                        allowFontScaling={false}
                        style={styles.switchTxtStyle}>
                        Generate AI image
                      </Text>
                    </View>
                    <View style={styles.recipeIngredientsViewStyle}>
                      <Text
                        allowFontScaling={false}
                        style={styles.recipeIngredientsDescriptionStyle}>
                        Ai isn't perfect but your recipe can be.
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={styles.recipeIngredientsDescriptionStyle}>
                        tweak the ingredients, adjust the
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={styles.recipeIngredientsDescriptionStyle}>
                        servings, and make it truly yours.
                      </Text>
                    </View>
                    <ScrollView
                      contentContainerStyle={{
                        paddingVertical: heightPixel(5),
                      }}
                      style={{
                        height: SCREEN_HEIGHT - heightPixel(610),
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.recipeItem,
                          {marginBottom: heightPixel(6)},
                        ]}>
                        You can edit the following ingredients:
                      </Text>
                      {recipeIngredients
                        .split('\n')
                        .map((ingredient, index) => (
                          <Text
                            allowFontScaling={false}
                            key={index}
                            style={[
                              styles.recipeItem,
                              {marginBottom: heightPixel(6)},
                            ]}>
                            {ingredient}
                          </Text>
                        ))}
                      <Text
                        allowFontScaling={false}
                        style={[
                          styles.recipeItem,
                          {paddingTop: heightPixel(6)},
                        ]}>
                        {`Servings: ${servings}`}
                      </Text>
                    </ScrollView>
                    <View style={styles.scanGroupStyle}>
                      <TouchableOpacity
                        style={styles.scanButton}
                        onPress={scanAndRecipe}>
                        <Text
                          allowFontScaling={false}
                          style={styles.scanButtonText}>
                          Looks
                        </Text>
                        <Text
                          allowFontScaling={false}
                          style={styles.scanButtonText}>
                          good
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.scanButton}
                        onPress={() => {
                          setModalVisibleStatus(true);
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={styles.scanButtonText}>
                          Edit
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Image
                      style={styles.logoStyle}
                      source={require('../../../assets/images/TREVBI_Transparent_Logo.png')}
                    />
                  </>
                )}
                {recipeResult && (
                  <>
                    <Image
                      source={{
                        uri: recipeResultImg
                          ? recipeImageRootURL + recipeResultImg
                          : capturedPhoto,
                      }}
                      style={styles.capturedImage}
                    />
                    <ScrollView
                      contentContainerStyle={{
                        paddingVertical: heightPixel(5),
                      }}
                      style={{
                        maxHeight: height - heightPixel(150),
                      }}>
                      {recipeResult
                        .replace(/\*/g, '')
                        .split('\n')
                        .map((recipeItem, index) => (
                          <Text
                            allowFontScaling={false}
                            key={index}
                            style={styles.recipeItem}>
                            {recipeItem}
                          </Text>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={[
                        styles.goToBackBtnStyle,
                        {
                          width: heightPixel(80),
                          marginTop: heightPixel(10),
                          // marginBottom: heightPixel(5),
                          alignSelf: 'center',
                        },
                      ]}
                      onPress={saveRecipeHandle}>
                      <Ionicons
                        size={fontPixel(18)}
                        name={'save-outline'}
                        style={{color: 'white', paddingRight: heightPixel(2)}}
                      />
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: fontPixel(14),
                          color: 'white',
                          fontFamily: 'LEMONMILK-Medium',
                        }}>
                        Save
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}

          <View style={styles.descriptionPanel}>
            {isScanning ? (
              okBtnStatus ? (
                <>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily: 'LEMONMILK-Bold',
                      paddingTop: heightPixel(5),
                      color: 'black',
                      fontSize: fontPixel(16),
                    }}>
                    Make sure your lens is focused
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily: 'LEMONMILK-Bold',
                      paddingTop: heightPixel(2),
                      paddingBottom: heightPixel(5),
                      color: 'black',
                      fontSize: fontPixel(16),
                    }}>
                    You may need to tap the screen
                  </Text>
                </>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </View>
          <View style={styles.goToHomePanel}>
            {isScanning ? (
              okBtnStatus ? (
                <>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.goToBackBtnStyle}
                    onPress={() => {
                      navigation.navigate('Diets');
                    }}>
                    <Ionicons
                      size={fontPixel(18)}
                      name={'caret-back'}
                      style={{color: 'white'}}
                    />
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: fontPixel(14),
                        color: 'white',
                        fontFamily: 'LEMONMILK-Medium',
                      }}>
                      Diets
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {isScanning ? (
              okBtnStatus ? (
                <>
                  <View style={styles.scanGroupStyle}>
                    <TouchableOpacity
                      style={styles.scanButton}
                      onPress={captureAndGetIngredients}>
                      <Text
                        allowFontScaling={false}
                        style={styles.scanButtonText}>
                        Scan
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={styles.scanButtonText}>
                        My Food
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily: 'LEMONMILK-Regular',
                      paddingTop: heightPixel(8),
                      color: 'black',
                      fontSize: fontPixel(18),
                    }}>
                    Scan fridge, pantry, or ingredients.
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily: 'LEMONMILK-Regular',
                      color: 'black',
                      fontSize: fontPixel(18),
                    }}>
                    TREVBI will create your recipe
                  </Text> */}
                  <Image
                    style={[styles.logoStyle, {marginTop: heightPixel(0)}]}
                    source={require('../../../assets/images/TREVBI_Transparent_Logo.png')}
                  />
                </>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </View>

          {modalVisibleStatus && (
            <View style={styles.modalStyle}>
              <View style={styles.scanGroupStyle}>
                <TouchableOpacity
                  style={styles.makeRecipeButton}
                  onPress={() => {
                    setEditRecipeIngredients(`${recipeIngredients}\n\n\n\n\n`);
                    setModalVisibleStatus(false);
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={styles.makeRecipeButtonText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.makeRecipeButton}
                  onPress={() => {
                    setRecipeIngredients(editRecipeIngredients.trimEnd());
                    setModalVisibleStatus(false);
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={styles.makeRecipeButtonText}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalContentsViewStyle}>
                <TextInput
                  textAlignVertical="top"
                  allowFontScaling={false}
                  multiline={true}
                  numberOfLines={20}
                  style={styles.textInputStyle}
                  value={editRecipeIngredients}
                  onChangeText={setEditRecipeIngredients}
                />
              </View>
              <View style={styles.modalServingsViewStyle}>
                <Text
                  allowFontScaling={false}
                  style={[styles.modalContentsStyle]}>
                  {`Servings: `}
                </Text>
                <TextInput
                  allowFontScaling={false}
                  style={styles.servingsInputStyle}
                  keyboardType="numeric"
                  value={servings}
                  onChangeText={numericCheckHandle}
                />
              </View>
            </View>
          )}
        </GestureHandlerRootView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  textBlock: {flexDirection: 'row', flexWrap: 'wrap'},
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
    bottom: heightPixel(20),
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
  buttonText: {
    color: 'white',
    fontSize: fontPixel(18),
    fontFamily: 'LEMONMILK-Bold',
  },
  scanPanelStyle: {
    padding: heightPixel(20),
    // paddingBottom: heightPixel(20),
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
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  scanButton: {
    backgroundColor: '#063225',
    paddingVertical: heightPixel(5),
    paddingHorizontal: heightPixel(20),
    borderRadius: heightPixel(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPixel(10),
    marginHorizontal: '3%',
    width: '40%',
  },
  scanButtonText: {
    color: 'white',
    fontSize: fontPixel(16),
    fontFamily: 'LEMONMILK-Medium',
  },
  scanGroupStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  capturedImage: {
    width: '100%',
    height: heightPixel(250),
  },
  recipeItem: {
    fontSize: fontPixel(14),
    color: '#2e2e34',
    marginBottom: heightPixel(3),
    fontFamily: 'LEMONMILK-Regular',
  },
  goToHomePanel: {
    position: 'absolute',
    top: heightPixel(10),
    left: heightPixel(20),
    flexDirection: 'row',
    alignSelf: 'flex-start',
    width: '100%',
  },
  goToBackBtnStyle: {
    flexDirection: 'row',
    backgroundColor: '#063225',
    borderRadius: heightPixel(15),
    paddingVertical: heightPixel(5),
    paddingLeft: heightPixel(5),
    paddingRight: heightPixel(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    width: '95%',
    paddingRight: '2%',
    paddingLeft: '2%',
    borderRadius: fontPixel(8),
    borderColor: 'rgba(102,123,104, 1)',
    borderWidth: heightPixel(2),
    // height: '50%',
  },
  closeButtonStyle: {
    width: heightPixel(40),
    height: heightPixel(40),
    top: heightPixel(5),
    right: heightPixel(5),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  modalContentsViewStyle: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  modalServingsViewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: heightPixel(5),
  },
  modalContentsStyle: {
    fontSize: fontPixel(16),
    fontFamily: 'LEMONMILK-Medium',
    color: 'black',
  },
  modalBtnsStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  makeRecipeButton: {
    backgroundColor: '#063225',
    paddingVertical: heightPixel(8),
    paddingHorizontal: heightPixel(20),
    borderRadius: heightPixel(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: heightPixel(20),
    marginHorizontal: '3%',
    width: '35%',
  },
  makeRecipeButtonText: {
    color: 'white',
    fontSize: fontPixel(16),
    fontFamily: 'LEMONMILK-Medium',
  },
  textInputStyle: {
    borderColor: '#c0c0c0',
    borderWidth: heightPixel(1),
    borderRadius: heightPixel(5),
    color: '#4b4b4b',
    fontFamily: 'LEMONMILK-Regular',
    fontSize: fontPixel(18),
    height: heightPixel(320),
    padding: heightPixel(10),
  },
  servingsInputStyle: {
    borderColor: '#c0c0c0',
    borderWidth: heightPixel(1),
    borderRadius: heightPixel(5),
    color: '#4b4b4b',
    fontFamily: 'LEMONMILK-Regular',
    fontSize: fontPixel(18),
    paddingVertical: heightPixel(2),
    paddingHorizontal: heightPixel(10),
    textAlign: 'right',
    width: SCREEN_WIDTH - heightPixel(200),
  },
  recipeIngredientsViewStyle: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: heightPixel(10),
  },
  recipeIngredientsDescriptionStyle: {
    fontSize: fontPixel(16),
    fontFamily: 'LEMONMILK-Medium',
    color: 'black',
  },
  logoStyle: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.28 * 0.6,
    resizeMode: 'cover',
    marginTop: heightPixel(10),
    alignSelf: 'center',
  },
  tabItemStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchBoxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: heightPixel(10),
  },
  switchTxtStyle: {
    fontSize: fontPixel(16),
    fontFamily: 'LEMONMILK-Medium',
  },
});

export default RecipeScanScreen;
