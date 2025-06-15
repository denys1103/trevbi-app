import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {fontPixel, heightPixel, recipeImageRootURL} from '../../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import {GlobalContext} from '../../context';
import FullScreenImageViewer from './FullScreenImageViewer';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const ViewDetailsScreen = ({item, onGoBack, setRecipes}) => {
  const {height, width, scale} = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [recipeResult, setRecipeResult] = useState(null);
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);
  const [title, setTitle] = useState(item.title ? item.title : 'No Title');
  const [recipeImg, setRecipeImg] = useState(item.img ? item.img : '');
  const [servings, setServings] = useState(
    item.servings ? item.servings.toString() : '',
  );
  const [cookTime, setCookTime] = useState(item.cookTime ? item.cookTime : '');
  const {uploadRecipeImg, updateRecipeData, showModal, cookbookRequest} =
    useContext(GlobalContext);
  const [editRecipeText, setEditRecipeText] = useState(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const handleImagePress = () => {
    setViewerVisible(true);
  };
  const loadData = async () => {
    try {
      setLoading(false);
      setRecipeResult(item.text.replace(/\*/g, ''));
      setEditRecipeText(`${item.text.replace(/\*/g, '')}\n\n\n\n\n`);
      setLoading(true);
    } catch (error) {
      setLoading(true);
      console.error('Error load item data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const numericCheckHandle = text => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 2) {
      setServings(numericText);
    }
  };

  const choosePhotoFile = async () => {
    let options = {
      aspect: [4, 3],
      includeBase64: true,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      title: 'Select Image',
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, async response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        // alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        // alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        // alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        // alert(response.errorMessage);
        return;
      }
      if (response.assets[0].fileSize < 10000000) {
        if (response.assets[0].uri) {
          const res_data = response.assets[0];
          let data = new FormData();
          data.append('file', {
            name: res_data.fileName,
            type: res_data.type,
            uri:
              Platform.OS === 'android'
                ? res_data.uri
                : res_data.uri.replace('file://', ''),
          });
          const uploadedImg = await uploadRecipeImg(data);
          setRecipeImg(uploadedImg);
        }
      } else {
        showModal('File size should not exceed 10 MB.');
      }
    });
  };

  const reset = () => {
    setModalVisibleStatus(false);
    setRecipeImg(item.img ? item.img : '');
    setTitle(item.title ? item.title : 'No Title');
    setServings(item.servings ? item.servings.toString() : '');
    setCookTime(item.cookTime ? item.cookTime : '');
    setRecipeResult(item.text.replace(/\*/g, ''));
    setEditRecipeText(`${item.text.replace(/\*/g, '')}\n\n\n\n\n`);
  };

  const save = async () => {
    setModalVisibleStatus(false);
    setRecipeResult(editRecipeText.trimEnd());
    const temp_recipe = {};
    temp_recipe._id = item._id;
    temp_recipe.img = recipeImg;
    temp_recipe.title = title;
    temp_recipe.servings = servings;
    temp_recipe.cookTime = cookTime;
    temp_recipe.text = editRecipeText.trimEnd();
    const recipeList = await updateRecipeData(temp_recipe);
    setRecipes(recipeList);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {!modalVisibleStatus && (
        <View style={styles.container}>
          <View style={StyleSheet.absoluteFill}>
            <View style={styles.scanPanelStyle}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: heightPixel(5),
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[styles.goToBackBtnStyle, {width: heightPixel(80)}]}
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
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => setModalVisibleStatus(true)}>
                  <FontAwesome
                    size={fontPixel(28)}
                    name={'edit'}
                    style={{color: '#063225'}}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.boxContent}>
                <Text
                  allowFontScaling={false}
                  style={styles.recipeTitleStyle}
                  numberOfLines={1}>
                  {title}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingBottom: heightPixel(5),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <MaterialCommunityIcons
                      size={fontPixel(24)}
                      name={'account-supervisor-outline'}
                      style={{color: 'black'}}
                    />
                    <Text
                      allowFontScaling={false}
                      style={styles.recipeServingsStyle}
                      numberOfLines={1}>
                      {servings}
                    </Text>
                    <MaterialCommunityIcons
                      size={fontPixel(24)}
                      name={'clock-time-three-outline'}
                      style={{color: 'black', paddingLeft: heightPixel(5)}}
                    />
                    <Text
                      allowFontScaling={false}
                      style={styles.recipeServingsStyle}
                      numberOfLines={1}>
                      {cookTime}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={async () => {
                      const temp_recipe = {};
                      temp_recipe.recipeId = item._id;
                      if (item.cookbook) {
                        temp_recipe.status = 0;
                        const recipeList = await cookbookRequest(temp_recipe);
                        item.cookbook = 0;
                        setRecipes(recipeList);
                      } else {
                        temp_recipe.status = 1;
                        const recipeList = await cookbookRequest(temp_recipe);
                        item.cookbook = 1;
                        setRecipes(recipeList);
                      }
                    }}>
                    <Image
                      style={{
                        width: heightPixel(30),
                        height: heightPixel(30),
                        resizeMode: 'cover',
                      }}
                      source={
                        item.cookbook
                          ? require('../../../assets/images/cookbook_active.png')
                          : require('../../../assets/images/cookbook.png')
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={handleImagePress}>
                <Image
                  source={
                    recipeImg
                      ? {
                          uri: recipeImageRootURL + recipeImg,
                        }
                      : require('../../../assets/images/no_img.jpg')
                  }
                  style={styles.capturedImage}
                />
              </TouchableOpacity>
              {recipeResult && (
                <ScrollView
                  contentContainerStyle={{
                    paddingVertical: heightPixel(5),
                  }}
                  style={{
                    maxHeight:
                      height - heightPixel(100) - SCREEN_WIDTH * 0.28 * 0.6,
                  }}>
                  {recipeResult.split('\n').map((recipeItem, index) => (
                    <Text
                      allowFontScaling={false}
                      key={index}
                      style={styles.recipeItem}>
                      {recipeItem}
                    </Text>
                  ))}
                </ScrollView>
              )}
              <View
                style={{
                  width: SCREEN_WIDTH,
                  paddingHorizontal: heightPixel(8),
                  marginTop: heightPixel(-10),
                  backgroundColor: 'transparent',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: fontPixel(30),
                    textAlign: 'left',
                    color: 'black',
                    padding: heightPixel(0),
                  }}>
                  &#8595;
                </Text>
              </View>
              <Image
                style={styles.logoStyle}
                source={require('../../../assets/images/TREVBI_Transparent_Logo.png')}
              />
            </View>
          </View>
        </View>
      )}
      {modalVisibleStatus && (
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.editViewStyle}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: heightPixel(5),
              }}>
              <TouchableOpacity activeOpacity={0.5} onPress={reset}>
                <Ionicons
                  size={fontPixel(28)}
                  name={'close'}
                  style={{color: '#063225'}}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={save}>
                <Ionicons
                  size={fontPixel(28)}
                  name={'checkmark'}
                  style={{color: '#063225'}}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.form}>
              <Text allowFontScaling={false} style={styles.label}>
                Title:
              </Text>
              <TextInput
                style={[styles.input, {width: SCREEN_WIDTH - heightPixel(65)}]}
                allowFontScaling={false}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.form}>
              <Text allowFontScaling={false} style={styles.label}>
                Number of servings:
              </Text>
              <TextInput
                style={[styles.input, {width: SCREEN_WIDTH - heightPixel(210)}]}
                allowFontScaling={false}
                value={servings}
                keyboardType="numeric"
                onChangeText={numericCheckHandle}
              />
            </View>
            <View style={[styles.form, {paddingBottom: heightPixel(5)}]}>
              <Text allowFontScaling={false} style={styles.label}>
                Cooking Time:
              </Text>
              <TextInput
                style={[styles.input, {width: SCREEN_WIDTH - heightPixel(150)}]}
                allowFontScaling={false}
                value={cookTime}
                onChangeText={setCookTime}
                maxLength={15}
              />
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={choosePhotoFile}>
              <Image
                source={
                  recipeImg
                    ? {
                        uri: recipeImageRootURL + recipeImg,
                      }
                    : require('../../../assets/images/no_img.jpg')
                }
                style={styles.capturedImage}
              />
            </TouchableOpacity>
            <View style={styles.editRecipeContentsViewStyle}>
              <TextInput
                textAlignVertical="top"
                allowFontScaling={false}
                multiline={true}
                numberOfLines={18}
                style={styles.textInputStyle}
                value={editRecipeText}
                onChangeText={setEditRecipeText}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
      {viewerVisible && (
        <FullScreenImageViewer
          uri={recipeImageRootURL + recipeImg}
          onClose={() => setViewerVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  scanPanelStyle: {
    padding: heightPixel(20),
    paddingTop: heightPixel(10),
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  capturedImage: {
    width: '100%',
    height: heightPixel(200),
  },
  recipeItem: {
    fontSize: fontPixel(14),
    color: '#2e2e34',
    marginBottom: heightPixel(3),
    fontFamily: 'LEMONMILK-Regular',
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
  logoStyle: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.28 * 0.6,
    resizeMode: 'cover',
    marginTop: heightPixel(0),
    alignSelf: 'center',
  },
  editViewStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    width: SCREEN_WIDTH,
    paddingTop: '2%',
    paddingHorizontal: heightPixel(3),
    borderRadius: fontPixel(8),
    borderColor: 'rgba(102,123,104, 1)',
    borderWidth: heightPixel(2),
    // height: SCREEN_HEIGHT,
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  label: {
    paddingHorizontal: heightPixel(5),
    fontSize: fontPixel(16),
    fontFamily: 'LEMONMILK-Light',
  },
  input: {
    borderBottomColor: '#c0c0c0',
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#fff',
    borderWidth: heightPixel(1),
    padding: heightPixel(6),
    fontSize: fontPixel(18),
    color: '#4b4b4b',
    fontFamily: 'LEMONMILK-Light',
    textAlign: 'right',
  },
  editRecipeContentsViewStyle: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  textInputStyle: {
    borderColor: '#c0c0c0',
    borderWidth: heightPixel(1),
    borderRadius: heightPixel(5),
    color: '#4b4b4b',
    fontFamily: 'LEMONMILK-Regular',
    fontSize: fontPixel(14),
    height: heightPixel(288),
    padding: heightPixel(10),
  },
  boxContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: heightPixel(10),
  },
  recipeTitleStyle: {
    fontSize: fontPixel(18),
    color: 'black',
    fontFamily: 'LEMONMILK-Medium',
    textAlign: 'center',
    width: '100%',
  },
  recipeServingsStyle: {
    fontSize: fontPixel(16),
    color: 'black',
    fontFamily: 'LEMONMILK-Light',
    paddingHorizontal: heightPixel(5),
  },
});

export default ViewDetailsScreen;
