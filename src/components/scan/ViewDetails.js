import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
  Alert,
  SafeAreaView,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import client, {fontPixel, heightPixel} from '../../config';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ViewDetailsScreen = ({item, onGoBack}) => {
  const [textBlocks, setTextBlocks] = useState([]);
  const {height, width, scale} = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [avoidIngredients, setAvoidIngredients] = useState([]);
  const [avoidIngredientsName, setAvoidIngredientsName] = useState([]);
  const [modalData, setModalData] = useState({});
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);
  const [answerModalVisibleStatus, setAnswerModalVisibleStatus] =
    useState(false);
  const [answerTxt, setAnswerTxt] = useState('');

  const loadData = async () => {
    try {
      setLoading(false);
      const avoidContent = await RNFS.readFile(item.avoidPath, 'utf8');
      const parsedAvoidData = JSON.parse(avoidContent);
      setAvoidIngredients(parsedAvoidData.avoidIngredients);
      const nameArray = parsedAvoidData.avoidIngredients.map(doc => doc.name);
      setAvoidIngredientsName(nameArray);
      if (nameArray.length == 0) {
        setModalData({
          name: '',
          description: 'There is no the bad ingredients',
        });
        setModalVisibleStatus(true);
      }

      const blockContent = await RNFS.readFile(item.blockPath, 'utf8');
      const blockAvoidData = JSON.parse(blockContent);
      setTextBlocks(blockAvoidData.textBlocks);
      setLoading(true);
    } catch (error) {
      setLoading(true);
      console.error('Error load item data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const askAI = async () => {
    try {
      const {data} = await client.post('/getAskAi', {
        modalData,
      });

      if (data.success) {
        // console.log(data.results)
        if (data.results.length > 0) {
          setAnswerTxt(data.results);
          setAnswerModalVisibleStatus(true);
          setModalVisibleStatus(false);
        }
      } else {
        console.log('server error!');
      }
    } catch (e) {
      console.log('new error:', e);
      Alert.alert('Get Ask AI', e);
    }
  };

  const getBarcodeAI = async () => {
    // try {
    //   const { data } = await client.post('/getBarcodeAi', {
    //     modalData,
    //   });
    //   if (data.success) {
    //     console.log(data.results)
    //     if(data.results.length > 0) {
    //       // setAnswerTxt(data.results);
    //       // setAnswerModalVisibleStatus(true);
    //       // setModalVisibleStatus(false);
    //     }
    //   } else {
    //     console.log('server error!');
    //   }
    // } catch (e) {
    //   console.log('new error:', e);
    //   Alert.alert('Get Ask AI', e);
    // }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback
        onPress={() => {
          setModalVisibleStatus(false);
          setAnswerModalVisibleStatus(false);
        }}
        disabled={true}>
        <View style={styles.container}>
          <Spinner visible={!loading} />
          <TouchableOpacity
            onPress={() => {}}
            style={
              (StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(255,255,255,1)',
                width: width,
                height: height,
              })
            }
            activeOpacity={0.9}></TouchableOpacity>

          <View style={StyleSheet.absoluteFill}>
            <TouchableOpacity
              onPress={() => {
                setModalVisibleStatus(false);
                setAnswerModalVisibleStatus(false);
              }}
              activeOpacity={0.9}>
              {/* {textBlocks.map((block, index) => {
                const cleanedBlockText = block.elementText.replace(/^[().,]+|[().,]+$/g, '').trim();
                const singleMatch = avoidIngredientsName.find(name => name.toLowerCase() === cleanedBlockText.toLowerCase());
                
                let matchName = '';
                if (singleMatch) {
                  matchName = singleMatch;
                }

                if (singleMatch == undefined && !block.elementText.includes(',') && index < textBlocks.length - 1) {
                  const nextBlockText = textBlocks[index + 1].elementText.replace(/^[().,]+|[().,]+$/g, '').trim();
                  const combinedText = `${cleanedBlockText} ${nextBlockText}`;
                  
                  const matchInNameList = avoidIngredientsName.find(name => name.toLowerCase().includes(combinedText.toLowerCase()));
                  if (matchInNameList) {
                    matchName = matchInNameList;
                  }
                }

                if (singleMatch == undefined && index > 0) {
                  const beforeBlockText = textBlocks[index - 1].elementText.replace(/^[().,]+|[().,]+$/g, '').trim();
                  const combinedText = `${beforeBlockText} ${cleanedBlockText}`;
                  
                  const matchInNameList = avoidIngredientsName.find(name => name.toLowerCase().includes(combinedText.toLowerCase()));
                  if (matchInNameList) {
                    matchName = matchInNameList;
                  }
                }
                //control font width
                const textLength = block.elementText.length;
                const characterWidth = 0.6 * block.elementFrame.height;
                const textWidth = characterWidth * textLength;
                const targetScaleX = block.elementFrame.width / textWidth;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      // console.log('matchName:', matchName);
                      const record = avoidIngredients.find(avoidItem => avoidItem.name === matchName);
                      setModalData(record);
                      setModalVisibleStatus(true);
                    }}
                    activeOpacity={0.9}
                    disabled={matchName === ''}
                    style={{
                      position: 'absolute',
                      left: (block.elementFrame.x - (block.elementFrame.width/2.0))/scale,
                      top: (block.elementFrame.boundingCenterY - (block.elementFrame.height/2.0))/scale,
                      // color: selectedWords.includes(block.elementText) ? 'red' : '#1E90FF',
                      // backgroundColor: 'rgba(255,255,255,0)',
                      padding: 0,
                      margin: 0,
                      // width : block.elementFrame.width/scale,
                      height : block.elementFrame.height/scale,
                    }}
                    >
                    <Text allowFontScaling={false}
                      style={{
                        color: matchName!='' ? 'red' : 'black',
                        fontSize : block.elementFrame.height/scale*0.95,
                        lineHeight : block.elementFrame.height/scale,
                        transform: [{ scaleX: targetScaleX }],
                        transformOrigin: '0% 50% 0',
                        letterSpacing: 0,
                        // includeFontPadding: false,
                      }}
                    >
                      {block.elementText}
                    </Text>
                  </TouchableOpacity>
                );
              })} */}
              <View style={styles.scanPanelStyle}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[
                    styles.goToBackBtnStyle,
                    {width: heightPixel(80), marginBottom: heightPixel(10)},
                  ]}
                  onPress={onGoBack}>
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
                <Text
                  allowFontScaling={false}
                  style={{
                    color: 'black',
                    fontSize: heightPixel(22),
                    fontFamily: 'LEMONMILK-Medium',
                    textAlign: 'center',
                  }}>
                  {avoidIngredients.length > 0
                    ? 'Click on the ingredient you want to learn more about'
                    : ''}
                </Text>
                <ScrollView
                  contentContainerStyle={{
                    paddingVertical: heightPixel(5),
                  }}
                  style={{
                    maxHeight: height - heightPixel(100),
                  }}>
                  {avoidIngredients.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setModalData(item);
                          setModalVisibleStatus(true);
                        }}
                        activeOpacity={0.9}
                        disabled={item.name === ''}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            color: 'red',
                            fontSize: heightPixel(20),
                            fontFamily: 'LEMONMILK-Regular',
                            paddingVertical: heightPixel(10),
                          }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableOpacity>
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
                <Image
                  source={require('../../../assets/images/close_btn.png')}
                  style={{width: heightPixel(40), height: heightPixel(40)}}
                />
              </TouchableOpacity>
              {modalData.name != '' ? (
                <Text allowFontScaling={false} style={styles.modalTextStyle}>
                  <Text allowFontScaling={false} style={styles.modalTitleStyle}>
                    {modalData.name}:{' '}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={styles.modalContentsStyle}>
                    {modalData.description}
                  </Text>
                </Text>
              ) : (
                <View style={styles.modalEmptyStyle}>
                  <Text
                    allowFontScaling={false}
                    style={styles.modalContentsStyle}>
                    {modalData.description}{' '}
                  </Text>
                </View>
              )}
              {modalData.source && (
                <TouchableOpacity
                  style={{paddingBottom: heightPixel(10)}}
                  onPress={() => Linking.openURL(modalData.source)}>
                  <Text allowFontScaling={false} style={styles.modalTextStyle}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: fontPixel(16),
                        color: 'black',
                        fontFamily: 'LEMONMILK-Medium',
                      }}>
                      CLICK HERE:{' '}
                    </Text>
                    <Text allowFontScaling={false} style={styles.link_blue}>
                      SOURCE
                    </Text>
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.modalImageStyle}>
                {modalData.description != 'There is no the bad ingredients' ? (
                  <>
                    {/* <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: heightPixel(18),
                        fontFamily: 'LEMONMILK-Medium',
                        color: 'black',
                        paddingTop: heightPixel(10),
                        paddingBottom: heightPixel(5),
                      }}>
                      "WANT HEALTHIER, ASK TREVBI"
                    </Text> */}
                    <TouchableOpacity style={styles.AIButton} onPress={askAI}>
                      {/* <Image source={require('../../../assets/images/ASK_TREVBI.jpg')} style={{width:heightPixel(155), height:heightPixel(80)}} /> */}
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: heightPixel(18),
                          fontFamily: 'LEMONMILK-Medium',
                          color: 'black',
                          paddingVertical: heightPixel(10),
                        }}>
                        HEALTHIER CHOICES
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Image
                    source={require('../../../assets/images/TREVBI_Transparent_Logo.png')}
                    style={{width: heightPixel(150), height: heightPixel(41.6)}}
                  />
                )}
              </View>
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
                <Image
                  source={require('../../../assets/images/close_btn.png')}
                  style={{width: heightPixel(40), height: heightPixel(40)}}
                />
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.modalTextStyle}>
                <Text
                  allowFontScaling={false}
                  style={styles.modalContentsStyle}>
                  {answerTxt}
                </Text>
              </Text>
              <View style={styles.modalImageStyle}>
                <Image
                  source={require('../../../assets/images/TREVBI_Transparent_Logo.png')}
                  style={{width: heightPixel(150), height: heightPixel(41.6)}}
                />
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  overlayContainer: {...StyleSheet.absoluteFillObject, zIndex: 1},
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
    bottom: heightPixel(40),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  okButton: {
    backgroundColor: '#063225',
    padding: heightPixel(16),
    borderRadius: heightPixel(8),
    marginHorizontal: heightPixel(20),
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: heightPixel(16),
    borderRadius: heightPixel(8),
    marginHorizontal: heightPixel(20),
  },
  buttonText: {
    color: 'white',
    fontSize: fontPixel(16),
    fontFamily: 'LEMONMILK-Regular',
  },
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    width: '95%',
    paddingTop: '10%',
    paddingRight: '2%',
    paddingLeft: '2%',
    borderRadius: fontPixel(8),
    borderColor: 'rgba(102,123,104, 1)',
    borderWidth: heightPixel(2),
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
    paddingTop: heightPixel(10),
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
  goToBackBtnStyle: {
    flexDirection: 'row',
    backgroundColor: '#063225',
    borderRadius: heightPixel(15),
    paddingVertical: heightPixel(5),
    paddingLeft: heightPixel(5),
    marginTop: heightPixel(5),
    marginLeft: heightPixel(5),
    paddingRight: heightPixel(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ViewDetailsScreen;
