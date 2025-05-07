import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {GlobalContext} from '../../context';
import {fontPixel, heightPixel, widthPixel, imageURL} from '../../config';

const CreatePost = ({navigation, route}) => {
  const {userInfo, showModal, savePost, saveTxtPost} =
    useContext(GlobalContext);
  const onePost = route.params.onePost;
  const [id, setId] = useState(onePost ? onePost._id : '');
  const [title, setTitle] = useState(onePost ? onePost.title : 'My post title');
  const [note, setNote] = useState(onePost ? onePost.note : '');
  const [file, setFile] = useState({});
  const [filePath, setFilePath] = useState(
    onePost ? (onePost.photo ? imageURL + onePost.photo : '') : '',
  );
  const profile = userInfo.user;
  const selectPhotoFile = async () => {
    let options = {
      aspect: [1, 1],
      includeBase64: true,
      maxWidth: 550,
      maxHeight: 550,
      quality: 1,
      title: 'Select Image',
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
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
          setFile({
            name: res_data.fileName,
            type: res_data.type,
            uri:
              Platform.OS === 'android'
                ? res_data.uri
                : res_data.uri.replace('file://', ''),
          });
          var temp_uri =
            Platform.OS === 'android'
              ? res_data.uri
              : res_data.uri.replace('file://', '');
          setFilePath(temp_uri);
        }
      } else {
        showModal('File size should not exceed 10 MB.');
      }
    });
  };
  const handleSubmit = async () => {
    let data = new FormData();
    data.append('title', title);
    data.append('note', note);
    data.append('id', id);
    if (Object.keys(file).length === 0) {
      data.append('file', '');
      if (title.replace(/\s+/g, '') !== '' && filePath !== '') {
        await saveTxtPost({
          title,
          note,
          id,
          file: '',
        });
        navigation.replace('SocialProfile');
      }
      if (filePath === '') {
        showModal('No image selected.');
      }
      if (title.replace(/\s+/g, '') === '') {
        showModal('No title.');
      }
    } else {
      data.append('file', file);
      await savePost(data);
      navigation.replace('SocialProfile');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={[
            styles.goToBackBtnStyle,
            {width: heightPixel(80), marginBottom: heightPixel(5)},
          ]}
          onPress={() => {
            navigation.replace('SocialProfile');
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
            Back
          </Text>
        </TouchableOpacity>
        <View style={styles.headBox}>
          <View style={styles.avatarBox}>
            <Image
              style={styles.avatar}
              source={
                profile?.avatar
                  ? {
                      uri: imageURL + profile.avatar,
                    }
                  : require('../../../assets/images/free_user.png')
              }
            />
            <View style={styles.boxContent}>
              <Text allowFontScaling={false} style={styles.fullnameStyle}>
                {profile.fullname}
              </Text>
            </View>
          </View>
          <View style={styles.postBtnBox}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.postBtnStyle}
              onPress={() => handleSubmit({})}>
              <MaterialCommunityIcons
                color={'#fff'}
                name="upload-outline"
                size={fontPixel(30)}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.postContainer}>
          <TextInput
            style={styles.inputTitleStyle}
            placeholder=""
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            textAlignVertical="top"
            multiline={true}
            numberOfLines={10}
            style={styles.inputNoteStyle}
            placeholder="My post contains.."
            value={note}
            onChangeText={setNote}
          />
          {filePath != '' && (
            <Image style={styles.imageStyle} source={{uri: filePath}} />
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.selectImageBox}
            onPress={() => selectPhotoFile()}>
            <MaterialCommunityIcons
              color={'#3e3e3e'}
              name="image-search-outline"
              size={fontPixel(30)}
            />
            <Text allowFontScaling={false} style={styles.imageTextStyle}>
              Image
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  avatar: {
    width: heightPixel(60),
    height: heightPixel(60),
    borderRadius: heightPixel(30),
  },
  headBox: {
    paddingHorizontal: widthPixel(15),
    paddingTop: heightPixel(15),
    marginBottom: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postContainer: {
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  avatarBox: {
    flexDirection: 'row',
  },
  selectImageBox: {
    paddingVertical: heightPixel(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBtnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: heightPixel(10),
  },
  fullnameStyle: {
    fontSize: fontPixel(24),
    color: '#474747',
  },
  postBtnStyle: {
    backgroundColor: '#063225',
    borderRadius: heightPixel(20),
    paddingVertical: heightPixel(5),
    paddingHorizontal: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextStyle: {
    fontSize: fontPixel(20),
    color: 'white',
  },
  inputTitleStyle: {
    borderColor: 'transparent',
    paddingHorizontal: widthPixel(15),
    fontSize: fontPixel(38),
    color: '#3e3e3e',
  },
  inputNoteStyle: {
    paddingHorizontal: widthPixel(15),
    borderColor: 'transparent',
    padding: heightPixel(10),
    fontSize: fontPixel(22),
    color: '#474747',
    height: heightPixel(260),
    backgroundColor: '#f1f1f1',
  },
  imageTextStyle: {
    fontSize: fontPixel(24),
    color: '#3e3e3e',
    paddingLeft: heightPixel(10),
  },
  imageStyle: {
    width: '100%',
    height: heightPixel(200),
    resizeMode: 'contain',
  },
  goToBackBtnStyle: {
    flexDirection: 'row',
    backgroundColor: '#063225',
    borderRadius: heightPixel(15),
    paddingVertical: heightPixel(5),
    paddingLeft: heightPixel(5),
    marginLeft: heightPixel(10),
    paddingRight: heightPixel(10),
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
});

export default CreatePost;
