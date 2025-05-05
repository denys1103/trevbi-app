import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
  ScrollView,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {fontPixel, heightPixel, imageURL, postImageRootURL} from '../../config';
import {GlobalContext} from '../../context';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const SocialProfileScreen = ({navigation}) => {
  const {userInfo, myPostList, getMyPostList, getUserList, userList} =
    useContext(GlobalContext);
  const [selectedPost, setSelectedPost] = useState({});
  const [selectPostModalVisibleStatus, setSelectPostModalVisibleStatus] =
    useState(false);
  const numColumns = 2;

  useEffect(() => {
    if (!userInfo.token) {
      navigation.replace('Login');
    }
  }, [navigation, userInfo.token]);

  useEffect(() => {
    getMyPostList();
  }, []);
  const profile = userInfo.user;

  const renderItem = ({item, index}) => {
    if (item.empty === true) {
      return <></>;
    }
    var itemDimension = (SCREEN_WIDTH - heightPixel(30)) / numColumns;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedPost(item);
          setSelectPostModalVisibleStatus(true);
        }}
        activeOpacity={0.8}>
        <View style={styles.renderItemStyle}>
          <Image
            style={{
              width: itemDimension,
              height: itemDimension,
              resizeMode: 'cover',
            }}
            source={
              item?.photo
                ? {
                    uri: postImageRootURL + item.photo,
                  }
                : require('../../../assets/images/no_img.jpg')
            }
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingVertical: heightPixel(2),
              width: '100%',
            }}>
            <FontAwesome
              size={fontPixel(20)}
              name={'heart-o'}
              color={'black'}
              style={{paddingHorizontal: heightPixel(8)}}
            />
            <FontAwesome
              size={fontPixel(20)}
              name={'comment-o'}
              color={'black'}
              style={{paddingHorizontal: heightPixel(8)}}
            />
            <FontAwesome
              size={fontPixel(20)}
              name={'share-square-o'}
              color={'black'}
              style={{paddingHorizontal: heightPixel(8)}}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const formatRow = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({id: `blank-${numberOfElementsLastRow}`, empty: true});
      numberOfElementsLastRow++;
    }
    return data;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <View style={styles.overlay}>
          <View style={styles.avatarContainer}>
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
            <Text
              allowFontScaling={false}
              style={[styles.fullnameStyle, {maxWidth: SCREEN_WIDTH * 0.9}]}>
              {profile?.fullname ? profile.fullname : ''}
            </Text>
          </View>
          <Image
            style={styles.logoStyle}
            source={require('../../../assets/images/TREVBI_SOCIAL_LOGO_small.png')}
          />
        </View>
        <View style={{alignItems: 'flex-start'}}>
          <Text
            allowFontScaling={false}
            style={styles.bioStyle}
            numberOfLines={3}>
            {profile?.bio ? profile.bio : ''}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: heightPixel(10),
          }}>
          <View style={styles.columnCenterStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.postBtnStyle}
              onPress={() => {
                navigation.replace('CreatePost', {onePost: null});
              }}>
              <MaterialCommunityIcons
                size={fontPixel(25)}
                name={'plus-thick'}
                style={{color: 'white'}}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.postTitleStyle}>
              {`   Post   `}
            </Text>
          </View>
          <View style={styles.columnCenterStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.postBtnStyle}
              onPress={() => {
                // navigation.replace('MenuList');
              }}>
              <Image
                style={styles.ico}
                source={require('../../../assets/images/feed_ico.png')}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.postTitleStyle}>
              {`   Feed   `}
            </Text>
          </View>
          <View style={styles.columnCenterStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.postBtnStyle}
              onPress={() => {
                navigation.replace('CrewPage');
              }}>
              <Image
                style={styles.ico}
                source={require('../../../assets/images/crew_ico.png')}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.postTitleStyle}>
              {`   Crew   `}
            </Text>
          </View>
          <View style={styles.columnCenterStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.postBtnStyle}
              onPress={() => {
                navigation.replace('ScoutsPage');
              }}>
              <Image
                style={styles.ico}
                source={require('../../../assets/images/scouts_ico.png')}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.postTitleStyle}>
              {` Scouts `}
            </Text>
          </View>
          <View style={styles.columnCenterStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.postBtnStyle}
              onPress={() => {
                // navigation.replace('MenuList');
              }}>
              <Image
                style={styles.ico}
                source={require('../../../assets/images/cookbook_ico.png')}
              />
            </TouchableOpacity>
            <Text allowFontScaling={false} style={styles.postTitleStyle}>
              Cookbook
            </Text>
          </View>
        </View>
        <View style={styles.wrapper}>
          <FlatList
            data={formatRow(myPostList, numColumns)}
            keyExtractor={item => {
              return item._id;
            }}
            renderItem={renderItem}
            numColumns={numColumns}
          />
        </View>
      </View>
      {selectPostModalVisibleStatus && (
        <View style={styles.modalStyle}>
          <ScrollView
            style={{
              height:
                Platform.OS === 'ios'
                  ? SCREEN_HEIGHT - heightPixel(70)
                  : SCREEN_HEIGHT - heightPixel(120),
            }}>
            <View style={styles.pencilContainer}>
              <TouchableOpacity
                onPress={() => {
                  setSelectPostModalVisibleStatus(false);
                }}>
                <MaterialCommunityIcons
                  color={'#72a045'}
                  name="close"
                  size={fontPixel(28)}
                />
              </TouchableOpacity>
            </View>
            <Image
              style={[styles.logoStyle, {alignSelf: 'center'}]}
              source={require('../../../assets/images/TREVBI_SOCIAL_LOGO_small.png')}
            />
            <View style={[styles.avatarContainer, {padding: heightPixel(10)}]}>
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
              <Text allowFontScaling={false} style={styles.fullnameStyle}>
                {profile?.fullname ? profile.fullname : ''}
              </Text>
            </View>
            <Image
              style={{
                width: SCREEN_WIDTH,
                height: SCREEN_WIDTH,
                resizeMode: 'cover',
              }}
              source={
                selectedPost?.photo
                  ? {
                      uri: postImageRootURL + selectedPost.photo,
                    }
                  : require('../../../assets/images/no_img.jpg')
              }
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingVertical: heightPixel(5),
                width: '100%',
              }}>
              <FontAwesome
                size={fontPixel(24)}
                name={'heart-o'}
                color={'black'}
                style={{paddingHorizontal: heightPixel(10)}}
              />
              <FontAwesome
                size={fontPixel(24)}
                name={'comment-o'}
                color={'black'}
                style={{paddingHorizontal: heightPixel(10)}}
              />
              <FontAwesome
                size={fontPixel(24)}
                name={'share-square-o'}
                color={'black'}
                style={{paddingHorizontal: heightPixel(10)}}
              />
            </View>
            {selectedPost.title && (
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: fontPixel(22),
                  color: 'black',
                  paddingHorizontal: heightPixel(15),
                  paddingBottom: heightPixel(10),
                }}>
                {selectedPost?.title ? selectedPost.title : ''}
              </Text>
            )}
            <Text
              allowFontScaling={false}
              style={{
                fontSize: fontPixel(18),
                color: 'black',
                paddingHorizontal: heightPixel(15),
                paddingBottom: heightPixel(20),
              }}>
              {selectedPost?.note ? selectedPost.note : ''}
            </Text>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    paddingTop: heightPixel(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: heightPixel(15),
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-start',
    width: SCREEN_WIDTH * 0.6,
  },
  avatar: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: SCREEN_WIDTH * 0.075,
  },
  logoStyle: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.15,
    resizeMode: 'cover',
  },
  fullnameStyle: {
    textAlign: 'center',
    fontSize: fontPixel(18),
    color: 'black',
    paddingLeft: heightPixel(8),
    maxWidth: SCREEN_WIDTH * 0.45,
  },
  bioStyle: {
    textAlign: 'left',
    fontSize: fontPixel(18),
    color: 'black',
    paddingTop: heightPixel(8),
    minHeight: heightPixel(60),
    paddingHorizontal: heightPixel(15),
  },
  wrapper: {
    paddingHorizontal: heightPixel(15),
    paddingTop: heightPixel(5),
    maxHeight: SCREEN_HEIGHT - SCREEN_WIDTH * 0.15 - heightPixel(280),
  },
  postBtnStyle: {
    backgroundColor: '#063225',
    width: heightPixel(40),
    height: heightPixel(40),
    borderRadius: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  postTitleStyle: {
    paddingTop: heightPixel(6),
    fontSize: fontPixel(12),
    color: 'black',
    fontFamily: 'LEMONMILK-Medium',
  },
  columnCenterStyle: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  ico: {
    width: heightPixel(28),
    height: heightPixel(28),
    resizeMode: 'cover',
  },
  renderItemStyle: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: heightPixel(1),
  },
  pencilContainer: {
    paddingTop: Platform.OS === 'ios' ? heightPixel(50) : heightPixel(10),
    paddingRight: heightPixel(20),
    alignSelf: 'flex-end',
  },
  modalStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    top: heightPixel(0),
    width: SCREEN_WIDTH,
  },
});

export default SocialProfileScreen;
