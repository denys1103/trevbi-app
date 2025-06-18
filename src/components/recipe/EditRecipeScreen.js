import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {fontPixel, heightPixel, recipeImageRootURL} from '../../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {GlobalContext} from '../../context';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const EditRecipeScreen = ({navigation, route}) => {
  const {item} = route?.params || {};
  const [title, setTitle] = useState(item.title ? item.title : '');
  const [recipeImg, setRecipeImg] = useState(item.img ? item.img : '');
  const {uploadRecipeImg, updateRecipeData, showModal} =
    useContext(GlobalContext);
  const [editRecipeText, setEditRecipeText] = useState(null);
  const loadData = async () => {
    try {
      setEditRecipeText(`${item.text.replace(/[*!]/g, '')}\n\n\n\n\n`);
    } catch (error) {
      console.error('Error load item data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    navigation.replace('Recipes', {
      selectitem: item,
    });
  };

  const save = async () => {
    const temp_recipe = {};
    temp_recipe._id = item._id;
    temp_recipe.img = recipeImg;
    temp_recipe.title = title;
    temp_recipe.text = editRecipeText.trimEnd();
    await updateRecipeData(temp_recipe);
    item.img = recipeImg;
    item.title = title;
    item.text = editRecipeText.trimEnd();
    reset();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  capturedImage: {
    width: '100%',
    height: heightPixel(200),
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
    paddingVertical: heightPixel(5),
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
});

export default EditRecipeScreen;
