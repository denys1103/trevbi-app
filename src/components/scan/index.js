import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, useWindowDimensions } from 'react-native';
import { useCameraDevice, Camera } from 'react-native-vision-camera';
import { Camera as VisionCamera, PhotoRecognizer } from 'react-native-vision-camera-text-recognition';
import Spinner from 'react-native-loading-spinner-overlay';
import client, {fontPixel, widthPixel, heightPixel} from '../../config';

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

  const device = useCameraDevice('back');

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

  const getIngredientsList = (inputText) => {
    return inputText
      // .split(/[,;:()."]/)
      .split(/[,;:()."]|\b(?:and|or)\b/i)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence && (sentence.match(/\s/g) || []).length < 3);
  };

  const captureAndRecognizeText = async () => {
    if (device) {
      try {
        setOkBtnStatus(false);
        setModalVisibleStatus(false);
        // const photo = await photoCamera.current.takePhoto()
        const photo = await photoCamera.current.takeSnapshot({
          quality: 90
        })
        setCapturedPhoto(photo);
        const result = await PhotoRecognizer({
          uri:`file://${photo.path}`,
          width:photo.width,
          height:photo.height
        })
        let IngredientsList = getIngredientsList(result.resultText.toLowerCase().replace(/\n/g, ' '));

        try {
          const { data } = await client.post('/getAvoidData', {
            IngredientsList,
          });
    
          if (data.success) {
            setAvoidIngredients(data.results);
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

        let ocrResults = result.blocks.flatMap((block) =>
          block.lines.flatMap((line) => line.elements)
        );
        const ocrWords = result.blocks.flatMap((block) =>
          block.lines.flatMap((line) => line.elements.map((element) => element.elementText))
        );

        for (let i = 0; i < ocrResults.length; i++) {
          // Initially set boundingCenterY to y
          ocrResults[i].elementFrame.boundingCenterY = ocrResults[i].elementFrame.y;
        
          if (i > 0) {
            const current = ocrResults[i].elementFrame;
            const previous = ocrResults[i - 1].elementFrame;
        
            // Check if `x` position of the previous element is less than the current
            if (previous.x < current.x) {
              // Check if the current `y` overlaps with the previous element's range
              if (
                previous.y <= current.y &&
                previous.y + previous.height > current.y
              ) {
                current.boundingCenterY = previous.boundingCenterY;
              }
              if (
                previous.y > current.y &&
                previous.y + previous.height < current.y
              ) {
                current.boundingCenterY = previous.boundingCenterY;
              }
            }
          }
        }
        // console.log('ocrWords origin:', ocrWords);
        try {
          const { data } = await client.post('/getCorrectWords', {
            ocrWords,
          });
    
          if (data.success) {
            // console.log('ocrWords:', data.results);
            if(data.results.length == ocrResults.length){
              ocrResults.forEach((item, index) => {
                item.elementText = data.results[index];
              });
            }
          } else {
            console.log('server error!');
          }
        } catch (e) {
          console.log('new error:', e);
          Alert.alert('Get Correct Words Data', e);
        } finally {
          setTextBlocks(ocrResults);
          setIsScanning(false);
          setOkBtnStatus(true);
        }
        // console.log(JSON.stringify(result, null, 2))
        
      } catch (error) {
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

  if (!hasPermission) {
    return (
      <View style={[styles.permissionContainer, StyleSheet.absoluteFill]}>
        <Text style={styles.permissionText}></Text>
        <TouchableOpacity
          style={styles.okButton}
          onPress={async () => {
            const newStatus = await Camera.requestCameraPermission();
            setHasPermission(newStatus === 'granted');
          }}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Spinner visible={!okBtnStatus} />
      {isScanning && !!device && (
        <VisionCamera
          style={StyleSheet.absoluteFill}
          device={device}
          ref={photoCamera}
          isActive={true}
          photo={true}
          // mode={'translate'}
        />
      )}

      {capturedPhoto && (
        <TouchableOpacity
          onPress={() => {
            setModalVisibleStatus(false);
          }}
          activeOpacity={0.9}
        >
          <Image source={{ uri: `file://${capturedPhoto.path}` }} style={StyleSheet.absoluteFill} />
          <View style={(StyleSheet.absoluteFill, {backgroundColor: 'rgba(255,255,255,1)', width:width, height:height})}>
          </View>
        </TouchableOpacity>
      )}

      {!isScanning && (
        <View style={StyleSheet.absoluteFill}>
          <TouchableOpacity
            onPress={() => {
              setModalVisibleStatus(false);
            }}
            activeOpacity={0.9}
          >
            {textBlocks.map((block, index) => {
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
                    const record = avoidIngredients.find(item => item.name === matchName);
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
                      fontSize : block.elementFrame.height/scale,
                      lineHeight : block.elementFrame.height/scale,
                      transform: [{ scaleX: targetScaleX }],
                      // includeFontPadding: false,
                    }}
                  >
                    {block.elementText}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {isScanning ? (
          okBtnStatus ? (<TouchableOpacity style={styles.okButton} onPress={captureAndRecognizeText}>
            <Text style={styles.buttonText}>Scan</Text>
          </TouchableOpacity>) : <></>
        ) : (
          <TouchableOpacity style={styles.cancelButton} onPress={resetScan}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        )}
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
    // alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    width: '95%',
    paddingTop: '5%',
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});

export default ScanAndRecognizeScreen;
