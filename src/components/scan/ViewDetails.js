import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions, Platform, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {fontPixel, heightPixel} from '../../config';
import RNFS from 'react-native-fs';

const ViewDetailsScreen = ({ item, onGoBack }) => {
  const [textBlocks, setTextBlocks] = useState([]); 
  const {height, width, scale} = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [avoidIngredients, setAvoidIngredients] = useState([]);
  const [avoidIngredientsName, setAvoidIngredientsName] = useState([]);
  const [modalData, setModalData] = useState({});
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);

  const loadData = async () => {
    try {
      setLoading(false);
      const avoidContent = await RNFS.readFile(item.avoidPath, 'utf8');
      const parsedAvoidData = JSON.parse(avoidContent);
      setAvoidIngredients(parsedAvoidData.avoidIngredients);
      const nameArray = parsedAvoidData.avoidIngredients.map(doc => doc.name);
      setAvoidIngredientsName(nameArray);
      if(nameArray.length == 0) {
        setModalData({'name':'', 'description': 'There is no the bad ingredients'});
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback
        onPress={() => setModalVisibleStatus(false)}
      >
        <View style={styles.container}>
          <Spinner visible={!loading} />
          <TouchableOpacity
            onPress={() => {
            setModalVisibleStatus(false);
            }}
            style={(StyleSheet.absoluteFill, {backgroundColor: 'rgba(255,255,255,1)', width:width, height:height})}
            activeOpacity={0.9}
          >
            {/* <Image source={{ uri: Platform.OS === 'ios' ? item.photoPath : `file://${item.photoPath}` }} style={StyleSheet.absoluteFill} />
            <View style={(StyleSheet.absoluteFill, {backgroundColor: 'rgba(255,255,255,1)', width:width, height:height})}>
            </View> */}
          </TouchableOpacity>

          <View style={StyleSheet.absoluteFill}>
            <TouchableOpacity
              onPress={() => {
                setModalVisibleStatus(false);
              }}
              activeOpacity={0.9}
            >
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
                    <Text
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
                <Text
                  style={{
                    color: 'black',
                    fontSize : heightPixel(22),
                  }}
                >
                  {avoidIngredients.length > 0 ? 'These are the ingredients you might want to more about':''}
                </Text>
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
                      style={{
                        marginTop: heightPixel(20),
                      }}
                      >
                      <Text
                        style={{
                          color: 'red',
                          fontSize : heightPixel(20),
                        }}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.okButton} onPress={onGoBack}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
          {modalVisibleStatus && (
            <View style={styles.modalStyle}>
              {modalData.name != '' ? 
                (<Text style={styles.modalTextStyle}>
                  <Text style={styles.modalTitleStyle}>{modalData.name}: </Text>
                  <Text style={styles.modalContentsStyle}>{modalData.description}</Text>
                </Text>)
                : 
                (<View style={styles.modalEmptyStyle}>
                  <Text style={styles.modalContentsStyle}>{modalData.description} </Text>
                </View>)
              }
              <View style={styles.modalImageStyle}>
                <Image source={require('../../../assets/images/Logo.png')} style={{width:heightPixel(116.8), height:heightPixel(80)}} />
              </View>
            </View>
          )}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  okButton: {
    backgroundColor: '#428242',
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
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    width: '95%',
    paddingTop: '5%',
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  scanPanelStyle: {
    padding: heightPixel(20),
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
});

export default ViewDetailsScreen;
