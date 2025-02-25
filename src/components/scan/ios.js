import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, useWindowDimensions, Platform, SafeAreaView, TouchableWithoutFeedback, ScrollView, Linking, FlatList } from 'react-native';
import { useCameraDevice, Camera, useCodeScanner } from 'react-native-vision-camera';
import { Camera as VisionCamera, PhotoRecognizer } from 'react-native-vision-camera-text-recognition';
import Reanimated, { useAnimatedProps, useSharedValue, interpolate, Extrapolation, runOnJS } from 'react-native-reanimated'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Spinner from 'react-native-loading-spinner-overlay';
import client, {fontPixel, widthPixel, heightPixel, appDir, indexFilePath} from '../../config';
import RNFS from 'react-native-fs';
import {GlobalContext} from '../../context';
import WhiteCross from './WhiteCross';

Reanimated.addWhitelistedNativeProps({
  zoom: true,
})
const ReanimatedCamera = Reanimated.createAnimatedComponent(VisionCamera)

const ScanAndRecognizeScreen = () => {
  const [textBlocks, setTextBlocks] = useState([]); 
  const [selectedWords, setSelectedWords] = useState([]);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const photoCamera = useRef(null);
  const {height, width, scale, fontScale} = useWindowDimensions();
  const [okBtnStatus, setOkBtnStatus] = useState(true);
  const [avoidIngredients, setAvoidIngredients] = useState([]);
  const [avoidIngredientsName, setAvoidIngredientsName] = useState([]);
  const [modalData, setModalData] = useState({});
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);
  const [answerModalVisibleStatus, setAnswerModalVisibleStatus] = useState(false);
  const [answerTxt, setAnswerTxt] = useState('');
  const { setCheckEvent, checkEvent } = useContext(GlobalContext);
  const [barcodeScanModalVisibleStatus, setBarcodeScanModalVisibleStatus] = useState(false);
  const [recommendationsModalVisibleStatus, setRecommendationsModalVisibleStatus] = useState(false);
  const [enableOnCodeScanned, setEnableOnCodeScanned] = useState(false);
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13'],
    onCodeScanned: (codes) => {
      if (enableOnCodeScanned) {
        let barcode = codes[0]?.value;
        if(barcode){
          fetchProductDetails(barcode);
          setEnableOnCodeScanned(false);
          setBarcodeScanModalVisibleStatus(false);
        }
      }
    },
  });

  const fetchProductDetails = async (barcode) => {
    try {
      const foodFactsUrl = `https://world.openfoodfacts.net/api/v2/product/${barcode}?fields=product_name,brands,image_url,nutriscore_grade,nova_group,categories_tags`;
  
      const foodFactsResponse = await fetch(foodFactsUrl);
      const foodFactsData = await foodFactsResponse.json();
  
      let category = "unknown";
  
      if (foodFactsData.status === 1 && foodFactsData.product.categories_tags?.length > 0) {
        category = foodFactsData.product.categories_tags[foodFactsData.product.categories_tags.length-1]; 
      } 
  
      const productInfo = {
        name: foodFactsData.product.product_name,
        brand: foodFactsData.product.brands,
        image: foodFactsData.product.image_url,
        url: `https://world.openfoodfacts.org/product/${barcode}`,
        nutriscore: foodFactsData.product?.nutriscore_grade || "unknown",
        novaGroup: foodFactsData.product?.nova_group || "unknown",
        category: category,
      };
  
      setProduct(productInfo);
      fetchHealthierAlternatives(category);
    } catch (error) {
      Alert.alert("Alert", "Could not fetch product details.");
    }
  };

  const fetchHealthierAlternatives = async (category) => {
    try {
      if (!category || category === "unknown") {
        setRecommendations([]);
        return;
      }
      setOkBtnStatus(false);
      const openFoodFactsUrl = `https://us.openfoodfacts.net/api/v2/search?categories_tags=${category}&fields=code,nutriscore_grade,product_name,brands,image_url&sort_by=nutriscore_score`;
      const openFoodFactsResponse = await fetch(openFoodFactsUrl);
      const openFoodFactsData = await openFoodFactsResponse.json();

      let healthierProducts = [];
      if (openFoodFactsData.products && openFoodFactsData.products.length > 0) {
        healthierProducts = openFoodFactsData.products
          .slice(0, 20)
          .map((item) => ({
            name: item.product_name,
            brand: item.brands,
            image: item.image_url,
            url: `https://world.openfoodfacts.org/product/${item.code}`,
            nutriscore: item.nutriscore_grade,
            source: "OpenFoodFacts",
          }));
      }

      setRecommendations(healthierProducts);
      setRecommendationsModalVisibleStatus(true);
      setOkBtnStatus(true);
    } catch (error) {
      console.error("Error fetching alternatives", error);
      setOkBtnStatus(true);
    }
  };

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

  const createAppDir = async () => {
    if (!(await RNFS.exists(appDir))) {
      await RNFS.mkdir(appDir);
    }
    if (!(await RNFS.exists(indexFilePath))) {
      await RNFS.writeFile(indexFilePath, JSON.stringify([]));
    }
  };

  const updateIndexFile = async (newEntry) => {
    try {
      const currentIndex = JSON.parse(await RNFS.readFile(indexFilePath));
      currentIndex.push(newEntry);
      await RNFS.writeFile(indexFilePath, JSON.stringify(currentIndex));
    } catch (error) {
      console.error('Failed to update index file:', error);
    }
  };

  const getIngredientsList = (inputText) => {
    return inputText
      // .split(/[,;:()."]/)
      .split(/[,;:()."]|\b(?:and|or|with)\b/i)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence && (sentence.match(/\s/g) || []).length < 4);
  };

  const isObjectEmpty = (objectName) => {
    return JSON.stringify(objectName) === "{}";
  };

  const captureAndRecognizeText = async () => {
    if (device) {
      try {
        await createAppDir();
        setOkBtnStatus(false);
        setModalVisibleStatus(false);

        const photoPath = `${appDir}/photo_${Date.now()}.jpg`;
        const avoidPath = `${appDir}/avoid_${Date.now()}.json`;
        const blockPath = `${appDir}/block_${Date.now()}.json`;

        const photo = await photoCamera.current.takeSnapshot({
            quality: 100
        })
        await RNFS.copyFile(photo.path, photoPath);
        const photoURI = Platform.OS === 'ios' ? photo.path : `file://${photo.path}`;
        const photoCopyURI = Platform.OS === 'ios' ? photoPath : `file://${photoPath}`;
        photo.photoURI = photoCopyURI;
        setCapturedPhoto(photo);
        const result = await PhotoRecognizer({
          uri:photoURI,
          orientation: "landscapeLeft"
        })
        if(!isObjectEmpty(result)){
          // let IngredientsList = getIngredientsList(result.resultText.toLowerCase().replace(/\n/g, ' '));
          let IngredientsList = result.resultText.toLowerCase().replace(/\n/g, ' ');
          if(IngredientsList.length>0){
            try {
              const { data } = await client.post('/getAvoidListData', {
                IngredientsList,
              });
        
              if (data.success) {
                setAvoidIngredients(data.results);
                await RNFS.writeFile(avoidPath, JSON.stringify({ avoidIngredients: data.results }));
                // console.log('avoidIngredients:', data.results);
                const nameArray = data.results.map(doc => doc.name);
                setAvoidIngredientsName(nameArray);
                if(nameArray.length == 0) {
                  setModalData({'name':'', 'description': 'There is no the bad ingredients'});
                  setModalVisibleStatus(true);
                }
              } else {
                console.log('server error!');
              }
            } catch (e) {
              console.log('new error:', e);
              Alert.alert('Get Avoid Data', e);
            }
          } else {
            setAvoidIngredients([]);
            await RNFS.writeFile(avoidPath, JSON.stringify({ avoidIngredients: [] }));
            setAvoidIngredientsName([]);
            setModalData({'name':'', 'description': 'There is no the bad ingredients'});
            setModalVisibleStatus(true);
          }

          let ocrText = result.blocks.flatMap((block) =>
            block.lines.flatMap((line) => line.elements)
          );
          const ocrWords = result.blocks.flatMap((block) =>
            block.lines.flatMap((line) => line.elements.map((element) => element.elementText))
          );

          let ocrResults = ocrText.map((current, index, array) => {
            const updatedFrame = { ...current.elementFrame, x: current.elementFrame.boundingCenterX, y: current.elementFrame.boundingCenterY };
            current.elementFrame = updatedFrame;
            if (index > 0) {
              const previous = array[index - 1].elementFrame;
          
              if (previous.x < current.elementFrame.x) {
                if (
                  previous.y <= current.elementFrame.y &&
                  previous.y + previous.height > current.elementFrame.y
                ) {
                  updatedFrame.boundingCenterY = previous.boundingCenterY;
                }
                if (
                  previous.y > current.elementFrame.y &&
                  previous.y - previous.height < current.elementFrame.y
                ) {
                  updatedFrame.boundingCenterY = previous.boundingCenterY;
                }
                array[index].elementFrame = updatedFrame;
              }
            }
          
            return { elementText:current.elementText, elementFrame: updatedFrame};
          });
          // try {
          //   const { data } = await client.post('/getCorrectWords', {
          //     ocrWords,
          //   });
      
          //   if (data.success) {
          //   //   console.log(JSON.stringify(data.results, null, 2))
          //     if(data.results.length == ocrResults.length){
          //       ocrResults.forEach((item, index) => {
          //         item.elementText = data.results[index];
          //       });
          //     }
          //   } else {
          //     console.log('server error!');
          //   }
          // } catch (e) {
          //   console.log('new error:', e);
          //   Alert.alert('Get Correct Words Data', e);
          // } finally {
            setTextBlocks(ocrResults);
            await RNFS.writeFile(blockPath, JSON.stringify({ textBlocks: ocrResults }));
            const newEntry = { photoPath, avoidPath, blockPath };
            await updateIndexFile(newEntry);
            // console.log(JSON.stringify(ocrResults, null, 2))
            setCheckEvent(!checkEvent);
            setIsScanning(false);
            setOkBtnStatus(true);
          // }
          // console.log(JSON.stringify(result, null, 2))
        } else {
          setModalData({'name':'', 'description': 'There is no captured text.\nPlease try again.'});
          setModalVisibleStatus(true);
          setIsScanning(false);
          setOkBtnStatus(true);
        }
      } catch (error) {
        setIsScanning(false);
        setOkBtnStatus(true);
        console.log(error)
        Alert.alert('Error', 'Failed to capture the photo.');
      }
    }
  };

  const resetScan = () => {
    setTextBlocks([]);
    setCapturedPhoto(null);
    setSelectedWords([]);
    setIsScanning(true);
    setAvoidIngredients([]);
    setAvoidIngredientsName([]);
    setModalData({});
    setModalVisibleStatus(false);
  };

  const askAI = async () => {
    try {
      setOkBtnStatus(false);
      const { data } = await client.post('/getAskAi', {
        modalData,
      });

      if (data.success) {
        // console.log(data.results)
        if(data.results.length > 0) {
          setAnswerTxt(data.results);
          setAnswerModalVisibleStatus(true);
          setModalVisibleStatus(false);
        }
      } else {
        console.log('server error!');
      }
      setOkBtnStatus(true);
    } catch (e) {
      setOkBtnStatus(true);
      console.log('new error:', e);
      Alert.alert('Get Ask AI', e);
    }
  };

  const getBarcodeAI = async () => {
    setEnableOnCodeScanned(true);
    setBarcodeScanModalVisibleStatus(true);
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
        onPress={() => {setModalVisibleStatus(false); setAnswerModalVisibleStatus(false)}}
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
                // setAnswerModalVisibleStatus(false);
              }}
              style={(StyleSheet.absoluteFill, {backgroundColor: 'rgba(255,255,255,1)', width:width, height:height})}
              activeOpacity={0.9}
            >
            </TouchableOpacity>
          )}

          {!isScanning && (
            <View style={StyleSheet.absoluteFill}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisibleStatus(false);
                  setAnswerModalVisibleStatus(false);
                }}
                activeOpacity={0.9}
              >
                <View style={styles.scanPanelStyle}>
                  <Text allowFontScaling={false}
                    style={{
                      color: 'black',
                      fontSize : heightPixel(22),
                      fontFamily: 'LEMONMILK-Medium',
                      textAlign: 'center',
                    }}
                  >
                    {avoidIngredients.length > 0 ? 'Click on the ingredient you want to learn more about':''}
                  </Text>
                  <ScrollView
                    contentContainerStyle={{
                      paddingVertical: heightPixel(5),
                    }}
                    style={{
                      maxHeight: (height - heightPixel(100)),
                    }}
                  >
                    {avoidIngredients.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setModalData(item);
                            setModalVisibleStatus(true);
                          }}
                          activeOpacity={0.9}
                          disabled={item.name === ''}
                          >
                          <Text allowFontScaling={false}
                            style={{
                              color: 'red',
                              fontSize : heightPixel(20),
                              fontFamily: 'LEMONMILK-Regular',
                              paddingVertical: heightPixel(10),
                            }}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                  </ScrollView>
                </View>
              </TouchableOpacity>
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
                  }}>See Beyond the Label—But
                </Text>
                <Text allowFontScaling={false} style={
                  {
                      fontFamily: 'LEMONMILK-Bold',
                      paddingTop: heightPixel(5),
                      paddingBottom: heightPixel(16),
                      color: 'black', 
                      fontSize: fontPixel(22)
                  }}>First, Focus Your Lens
                </Text>
              </>) : <></>
            ) : (
              <></>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {isScanning ? (
              okBtnStatus ? (<>
                <View style={styles.scanGroupStyle}>
                  <View style={{marginHorizontal: '3%', width: '40%'}}>
                    <Text allowFontScaling={false}></Text>
                  </View>
                  <View style={{alignItems: 'center', justifyContent: 'center', marginHorizontal: '3%', width: '40%'}}>
                    <Text allowFontScaling={false} style={{ color: 'black', fontSize: fontPixel(16), fontFamily: 'LEMONMILK-Medium' }}>Comming soon</Text>
                  </View>
                </View>
                <View style={styles.scanGroupStyle}>
                  <TouchableOpacity style={styles.scanButton} onPress={captureAndRecognizeText}>
                    <Text allowFontScaling={false} style={styles.scanButtonText}>Scan</Text>
                    <Text allowFontScaling={false} style={styles.scanButtonText}>Ingredients</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.9} style={styles.scanButton} onPress={() => console.log('click recipes')}>
                    <Text allowFontScaling={false} style={styles.scanButtonText}>Trevbi ai</Text>
                    <Text allowFontScaling={false} style={styles.scanButtonText}>recipes</Text>
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
          {modalVisibleStatus && (
            <View style={styles.modalStyle}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.closeButtonStyle}
                onPress={() => {
                  setModalVisibleStatus(false);
                  setAnswerModalVisibleStatus(false);
                }}>
                <Image source={require('../../../assets/images/close_btn.png')} style={{width:heightPixel(40), height:heightPixel(40)}} />
              </TouchableOpacity>
              {modalData.name != '' ? 
                (<Text allowFontScaling={false} style={styles.modalTextStyle}>
                  <Text allowFontScaling={false} style={styles.modalTitleStyle}>{modalData.name}: </Text>
                  <Text allowFontScaling={false} style={styles.modalContentsStyle}>{modalData.description}</Text>
                </Text>)
                : 
                (<View style={styles.modalEmptyStyle}>
                  {modalData.description.includes('There is no captured text') ? 
                  <Text allowFontScaling={false} style={[
                    styles.modalContentsStyle,
                    {
                      textAlign: 'center',
                    },
                  ]}>{modalData.description} </Text>
                  :
                  <Text allowFontScaling={false} style={styles.modalContentsStyle}>{modalData.description} </Text>
                  }
                </View>)
              }
              {modalData.source && (
                <TouchableOpacity
                  style={{paddingBottom: heightPixel(10)}}
                  onPress={() =>
                    Linking.openURL(
                      modalData.source,
                    )
                  }>
                  <Text allowFontScaling={false} style={styles.modalTextStyle}>
                    <Text allowFontScaling={false} style={{fontSize:fontPixel(16), color:'black', fontFamily: 'LEMONMILK-Medium'}}>CLICK HERE: </Text>
                    <Text allowFontScaling={false} style={styles.link_blue}>SOURCE</Text>
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.modalImageStyle}>
                {modalData.description != 'There is no the bad ingredients'?
                (
                  <>
                    <Text allowFontScaling={false}
                      style={{
                        fontSize : heightPixel(18),
                        fontFamily: 'LEMONMILK-Medium',
                        color: 'black',
                        paddingTop: heightPixel(10),
                        paddingBottom: heightPixel(5),
                      }}
                    >
                      Scan & score a healthier choice!
                    </Text>
                    <View style={styles.scanGroupStyle}>
                      <TouchableOpacity style={styles.barcodeButton} onPress={getBarcodeAI}>
                        <Text allowFontScaling={false} style={styles.barcodeButtonText}>Scan</Text>
                        <Text allowFontScaling={false} style={styles.barcodeButtonText}>barcode</Text>
                      </TouchableOpacity>
                      {/* <TouchableOpacity style={styles.barcodeButton} onPress={() => console.log('click recipes')}>
                        <Text allowFontScaling={false} style={styles.barcodeButtonText}>Trevbi ai</Text>
                        <Text allowFontScaling={false} style={styles.barcodeButtonText}>recipes</Text>
                      </TouchableOpacity> */}
                    </View>
                  </>
                )
                :
                <Image source={require('../../../assets/images/TREVBI_Transparent_Logo.png')} style={{width:heightPixel(150), height:heightPixel(41.6)}} />
                }
              </View>
            </View>
          )}
          {barcodeScanModalVisibleStatus && (
            <View style={styles.barcodeScanmodalStyle}>
              <Camera
                codeScanner={codeScanner}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
              />
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.closeScannerBtnStyle}
                onPress={() => {
                  setEnableOnCodeScanned(false);
                  setBarcodeScanModalVisibleStatus(false);
                }}>
                <WhiteCross />
              </TouchableOpacity>
            </View>
          )}
          {answerModalVisibleStatus && (
            <View style={styles.modalStyle}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.closeButtonStyle}
                onPress={() => {
                  setModalVisibleStatus(false);
                  setAnswerModalVisibleStatus(false);
                }}>
                <Image source={require('../../../assets/images/close_btn.png')} style={{width:heightPixel(40), height:heightPixel(40)}} />
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.modalTextStyle}>
                <Text allowFontScaling={false} style={styles.modalContentsStyle}>{answerTxt}</Text>
              </Text>
              <View style={styles.modalImageStyle}>
                <Image source={require('../../../assets/images/TREVBI_Transparent_Logo.png')} style={{width:heightPixel(150), height:heightPixel(41.6)}} />
              </View>
            </View>
          )}
          {recommendationsModalVisibleStatus && (
            <View style={styles.recommendationsModalStyle}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.closeButtonStyle}
                onPress={() => {
                  // setModalVisibleStatus(false);
                  setRecommendationsModalVisibleStatus(false);
                }}>
                <Image source={require('../../../assets/images/close_btn.png')} style={{width:heightPixel(40), height:heightPixel(40)}} />
              </TouchableOpacity>
              {product && (
                <View style={styles.recommendationsProductStyle}>
                  <Text allowFontScaling={false} style={styles.recommendationsProductNameStyle}>{product.name}</Text>
                  <View style={styles.recommendationsDescriptionBoxStyle}>
                    {product.image ?
                      <Image source={{ uri: product.image }} style={styles.recommendationsProductImgStyle} />
                      :
                      <Image source={require('../../../assets/images/no_img.jpg')} style={styles.recommendationsProductImgStyle} />
                    }
                    <View>
                      <Text allowFontScaling={false}>Brand: {product.brand}</Text>
                      <Text allowFontScaling={false}>Nutri-Score: {product.nutriscore}</Text>
                      <TouchableOpacity onPress={() => Linking.openURL(product.url)}>
                        <Text allowFontScaling={false} style={{ color: "blue" }}>More Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              <FlatList
                data={recommendations}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={() =>
                  recommendations.length > 0 ? (
                    <Text allowFontScaling={false} style={styles.recommendationsHealthierStyle}>
                      Healthy Alternatives:
                    </Text>
                  ) : null
                }
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => Linking.openURL(item.url)} style={{ padding: heightPixel(10), borderBottomWidth: heightPixel(1), borderColor: "#ccc" }}>
                    <Text allowFontScaling={false} style={styles.recommendationsProductNameStyle}>{item.name}</Text>
                    <View style={styles.recommendationsDescriptionBoxStyle}>
                      {item.image ?
                        <Image source={{ uri: item.image }} style={styles.recommendationsProductImgStyle} />
                        :
                        <Image source={require('../../../assets/images/no_img.jpg')} style={styles.recommendationsProductImgStyle} />
                      }
                      <View>
                        <Text allowFontScaling={false}>Brand: {item.brand}</Text>
                        <Text allowFontScaling={false}>Nutri-Score: {item.nutriscore}</Text>
                        <Text allowFontScaling={false} style={{ color: "blue" }}>{item.source}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
              <View style={styles.modalImageStyle}>
                <Image source={require('../../../assets/images/TREVBI_Transparent_Logo.png')} style={{width:heightPixel(150), height:heightPixel(41.6)}} />
              </View>
            </View>
          )}
        </GestureHandlerRootView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlayContainer: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
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
    backgroundColor: 'red',
    padding: heightPixel(16),
    borderRadius: heightPixel(8),
    marginHorizontal: heightPixel(20),
  },
  buttonText: { color: 'white', fontSize: fontPixel(18), fontFamily: 'LEMONMILK-Bold' },
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    width: '95%',
    paddingTop: '10%',
    paddingRight: '2%',
    paddingLeft: '2%',
    borderRadius: fontPixel(8),
    borderColor: 'rgba(102,123,104, 1)',
    borderWidth: heightPixel(2),
    // height: '50%',
  },
  modalTextStyle: {
    flexDirection: 'row',
  },
  modalEmptyStyle: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitleStyle: {
    fontWeight: 'bold',
    fontSize: fontPixel(20),
    color: 'black',
  },
  modalContentsStyle: {
    fontSize: fontPixel(20),
    color: 'black',
  },
  modalImageStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanPanelStyle: {
    padding: heightPixel(20),
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  askButton: {
    padding: heightPixel(10),
  },
  AIButton: {
    backgroundColor: 'translate',
    padding: heightPixel(2),
    borderRadius: heightPixel(8),
    paddingHorizontal: heightPixel(10),
    marginVertical: heightPixel(8),
    // borderWidth: heightPixel(1),
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
  link_blue: {
    fontSize: fontPixel(16),
    color: 'blue',
    paddingLeft: heightPixel(8),
    fontFamily: 'LEMONMILK-Medium',
  },
  barcodeScanmodalStyle: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    width: '95%',
    height: '50%',
    paddingTop: '5%',
    paddingRight: '2%',
    paddingLeft: '2%',
    borderRadius: fontPixel(8),
    borderColor: 'rgba(102,123,104, 1)',
    borderWidth: heightPixel(2),
    // height: '50%',
  },
  recommendationsModalStyle: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    width: '95%',
    height: '80%',
    paddingTop: '10%',
    paddingRight: '2%',
    paddingLeft: '2%',
    borderRadius: fontPixel(8),
    borderColor: 'rgba(102,123,104, 1)',
    borderWidth: heightPixel(2),
  },
  closeScannerBtnStyle: {
    width: heightPixel(25),
    height: heightPixel(25),
    top: heightPixel(5),
    right: heightPixel(5),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationsProductStyle: {
    padding: heightPixel(10), 
    borderBottomWidth: heightPixel(2), 
    borderColor: 'rgba(102,123,104, 1)',
  },
  recommendationsProductNameStyle: {
    fontSize: fontPixel(14), 
    fontFamily: 'LEMONMILK-Medium',
  },
  recommendationsProductImgStyle: {
    width: heightPixel(100), 
    height: heightPixel(100),
    marginRight: heightPixel(20),
  },
  recommendationsDescriptionBoxStyle: {
    flexDirection: 'row',
  },
  recommendationsHealthierStyle: {
    fontSize: fontPixel(16), 
    fontFamily: 'LEMONMILK-Bold',
    padding: heightPixel(10),
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
  barcodeButton: {
    backgroundColor: '#063225',
    paddingVertical: heightPixel(5),
    paddingHorizontal: heightPixel(20),
    borderRadius: heightPixel(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: heightPixel(10),
    marginHorizontal: '3%',
    width: '40%',
  },
  barcodeButtonText: { color: 'white', fontSize: fontPixel(14), fontFamily: 'LEMONMILK-Medium' },
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
});

export default ScanAndRecognizeScreen;
