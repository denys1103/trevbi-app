import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import {GlobalContext} from '../../context';
import {
  fontPixel,
  heightPixel,
  widthPixel,
  imageURL,
  postImageRootURL,
} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const CreatePost = ({navigation, route}) => {
  const {userInfo, showModal, saveMediaPost, saveTxtPost} =
    useContext(GlobalContext);
  const onePost = route.params.onePost;
  const [id, setId] = useState(onePost ? onePost._id : '');
  const [title, setTitle] = useState(onePost ? onePost.title : '');
  const [note, setNote] = useState(onePost ? onePost.note : '');
  const [file, setFile] = useState({});
  const [filePath, setFilePath] = useState(
    onePost ? (onePost.photo ? imageURL + onePost.photo : '') : '',
  );
  const profile = userInfo.user;
  const MAX_MEDIA = 10;
  const [media, setMedia] = useState([]);
  const [searchMedia, setSearchMedia] = useState(
    onePost
      ? onePost.media.length >= MAX_MEDIA
        ? onePost.media
        : [...onePost.media, {mime: 'plus'}]
      : [{mime: 'plus'}],
  );
  const [onePostMedia, setOnePostMedia] = useState(
    onePost ? onePost.media : [],
  );

  const handleSubmit = async () => {
    let data = new FormData();
    data.append('title', title);
    data.append('note', note);
    data.append('id', id);
    media.forEach((item, index) => {
      data.append('media', {
        uri: item.path,
        type: item.mime,
        name: `media_${index}.${item.mime.split('/')[1]}`,
      });
    });
    if (media.length === 0) {
      if (title.replace(/\s+/g, '') !== '') {
        await saveTxtPost({
          title,
          note,
          id,
        });
        navigation.replace('SocialProfile');
      }
      // if (filePath === '') {
      //   showModal('No image selected.');
      // }
      if (title.replace(/\s+/g, '') === '') {
        showModal('No title.');
      }
    } else {
      if (title.replace(/\s+/g, '') !== '') {
        await saveMediaPost(data);
        navigation.replace('SocialProfile');
      }
      if (title.replace(/\s+/g, '') === '') {
        showModal('No title.');
      }
    }
  };

  const pickMedia = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'any',
      maxFiles: MAX_MEDIA - media.length - onePostMedia.length,
    }).then(selected => {
      setMedia([
        ...media,
        ...selected.slice(0, MAX_MEDIA - media.length - onePostMedia.length),
      ]);
      const currentCount =
        media.length +
        onePostMedia.length +
        selected.slice(0, MAX_MEDIA - media.length - onePostMedia.length)
          .length;
      if (currentCount >= MAX_MEDIA) {
        setSearchMedia([
          ...onePostMedia,
          ...media,
          ...selected.slice(0, MAX_MEDIA - media.length - onePostMedia.length),
        ]);
      } else {
        setSearchMedia([
          ...onePostMedia,
          ...media,
          ...selected.slice(0, MAX_MEDIA - media.length - onePostMedia.length),
          {mime: 'plus'},
        ]);
      }
    });
  };

  const renderItem = ({item}) => (
    <View style={styles.mediaItem}>
      {item.mime.startsWith('video') ? (
        // <Text style={styles.videoTag}>🎥</Text>
        <Video
          source={{uri: item.path}}
          style={styles.image}
          resizeMode="cover"
          repeat
          paused={true}
        />
      ) : item.mime.startsWith('plus') ? (
        <TouchableOpacity style={styles.addMedia} onPress={pickMedia}>
          <Text style={styles.addIcon}>＋</Text>
        </TouchableOpacity>
      ) : (
        <Image source={{uri: item.path}} style={styles.image} />
      )}
    </View>
  );

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
            allowFontScaling={false}
            placeholder="My post title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            textAlignVertical="top"
            allowFontScaling={false}
            multiline={true}
            numberOfLines={10}
            style={styles.inputNoteStyle}
            placeholder="My post contains.."
            value={note}
            onChangeText={setNote}
          />
          {/* {filePath != '' && (
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
          </TouchableOpacity> */}
          <FlatList
            data={searchMedia}
            renderItem={renderItem}
            keyExtractor={(_, i) => i.toString()}
            numColumns={3}
            contentContainerStyle={styles.mediaGrid}
          />
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
    height: SCREEN_HEIGHT - heightPixel(220), //android style
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
  mediaGrid: {justifyContent: 'center'},
  mediaItem: {
    width: (SCREEN_WIDTH - heightPixel(18)) / 3.0,
    aspectRatio: heightPixel(1),
    margin: heightPixel(3),
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMedia: {
    width: '100%',
    aspectRatio: heightPixel(1),
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {fontSize: fontPixel(10), color: 'black'},
  image: {width: '100%', height: '100%', resizeMode: 'cover'},
  videoTag: {fontSize: fontPixel(24)},
});

export default CreatePost;
