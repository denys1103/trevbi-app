import React, {useState, useContext, useEffect, memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  FlatList,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GlobalContext} from '../../context';
import {fontPixel, heightPixel, imageURL, postImageRootURL} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const FeedPage = ({navigation, route}) => {
  const {userInfo, getPostList, postList, updateLike, setPostList} =
    useContext(GlobalContext);
  const [selectPostModalVisibleStatus, setSelectPostModalVisibleStatus] =
    useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const profile = userInfo.user;

  useEffect(() => {
    getPostList();
  }, []);

  const formatLike = count => {
    if (count >= 1_000_000) {
      return (count / 1_000_000).toFixed(0).replace(/\.0$/, '') + 'M';
    } else if (count >= 1_000) {
      return (count / 1_000).toFixed(0).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };

  const onLikePress = async (id, selectType = 0) => {
    const onePost = await updateLike({
      id: id,
      status: 0,
    });

    if (onePost && onePost._id) {
      setPostList(prevList =>
        prevList.map(post =>
          post._id === onePost._id ? {...post, like: onePost.like} : post,
        ),
      );
      if (selectType > 0) {
        setSelectedPost(prevPost =>
          prevPost._id === id ? {...prevPost, like: onePost.like} : prevPost,
        );
      }
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
        <Image
          style={styles.logoStyle}
          source={require('../../../assets/images/TREVBI_SOCIAL_LOGO_small.png')}
        />
        <FlatList
          enableEmptySections={true}
          data={postList}
          keyExtractor={item => item._id}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingBottom: heightPixel(6),
                }}>
                <View style={styles.userBox}>
                  <Image
                    style={styles.userAvatar}
                    source={
                      item.userid?.avatar
                        ? {
                            uri: imageURL + item.userid.avatar,
                          }
                        : require('../../../assets/images/free_user.png')
                    }
                  />
                  <View style={styles.userBoxContent}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: fontPixel(18),
                        color: 'black',
                      }}>
                      {item.userid?.fullname ? item.userid.fullname : ''}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedPost(item);
                    setSelectPostModalVisibleStatus(true);
                  }}>
                  <Image
                    style={{
                      width: SCREEN_WIDTH,
                      height: SCREEN_WIDTH,
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
                </TouchableOpacity>
                <View style={styles.iconsBox}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.columnCenterStyle}
                    onPress={() => {
                      // if (item.userid._id !== profile._id) {
                      onLikePress(item._id);
                      // }
                    }}>
                    <FontAwesome
                      size={fontPixel(30)}
                      name={'heart-o'}
                      color={'black'}
                      style={{paddingHorizontal: heightPixel(10)}}
                    />
                    <Text
                      style={{
                        fontSize: fontPixel(10),
                        color: 'black',
                        paddingHorizontal: heightPixel(10),
                        marginTop: heightPixel(-24),
                      }}>
                      {item.like ? formatLike(item.like.length) : 0}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={[
                      styles.columnCenterStyle,
                      {paddingBottom: heightPixel(2)},
                    ]}
                    onPress={() => {
                      console.log('');
                    }}>
                    <FontAwesome
                      size={fontPixel(30)}
                      name={'comment-o'}
                      color={'black'}
                      style={{paddingHorizontal: heightPixel(10)}}
                    />
                    <Text
                      style={{
                        fontSize: fontPixel(10),
                        color: 'black',
                        paddingHorizontal: heightPixel(10),
                        marginTop: heightPixel(-22),
                      }}>
                      {item.comment ? item.comment.length : 0}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={[
                      styles.columnCenterStyle,
                      {paddingTop: heightPixel(8)},
                    ]}
                    onPress={() => {
                      console.log('');
                    }}>
                    <FontAwesome
                      size={fontPixel(30)}
                      name={'share-square-o'}
                      color={'black'}
                      style={{paddingHorizontal: heightPixel(10)}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
        {selectPostModalVisibleStatus && (
          <View style={styles.modalStyle}>
            <ScrollView
              style={{
                height: SCREEN_HEIGHT - heightPixel(120),
              }}>
              <View style={styles.closeContainer}>
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
              <View
                style={[styles.avatarContainer, {padding: heightPixel(10)}]}>
                <Image
                  style={styles.avatar}
                  source={
                    selectedPost.userid?.avatar
                      ? {
                          uri: imageURL + selectedPost.userid.avatar,
                        }
                      : require('../../../assets/images/free_user.png')
                  }
                />
                <Text allowFontScaling={false} style={styles.fullnameStyle}>
                  {selectedPost.userid?.fullname
                    ? selectedPost.userid.fullname
                    : ''}
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
              <View style={styles.iconsBox}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.columnCenterStyle}
                  onPress={() => {
                    // if (selectedPost.userid._id !== profile._id) {
                    onLikePress(selectedPost._id, 1);
                    // }
                  }}>
                  <FontAwesome
                    size={fontPixel(30)}
                    name={'heart-o'}
                    color={'black'}
                    style={{paddingHorizontal: heightPixel(10)}}
                  />
                  <Text
                    style={{
                      fontSize: fontPixel(10),
                      color: 'black',
                      paddingHorizontal: heightPixel(10),
                      marginTop: heightPixel(-24),
                    }}>
                    {selectedPost.like
                      ? formatLike(selectedPost.like.length)
                      : 0}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={[
                    styles.columnCenterStyle,
                    {paddingBottom: heightPixel(2)},
                  ]}
                  onPress={() => {
                    console.log('');
                  }}>
                  <FontAwesome
                    size={fontPixel(30)}
                    name={'comment-o'}
                    color={'black'}
                    style={{paddingHorizontal: heightPixel(10)}}
                  />
                  <Text
                    style={{
                      fontSize: fontPixel(10),
                      color: 'black',
                      paddingHorizontal: heightPixel(10),
                      marginTop: heightPixel(-22),
                    }}>
                    {selectedPost.comment ? selectedPost.comment.length : 0}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={[
                    styles.columnCenterStyle,
                    {paddingTop: heightPixel(8)},
                  ]}
                  onPress={() => {
                    console.log('');
                  }}>
                  <FontAwesome
                    size={fontPixel(30)}
                    name={'share-square-o'}
                    color={'black'}
                    style={{paddingHorizontal: heightPixel(10)}}
                  />
                </TouchableOpacity>
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
  logoStyle: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.2,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  closeContainer: {
    paddingTop: heightPixel(10),
    paddingRight: heightPixel(20),
    alignSelf: 'flex-end',
  },
  userBox: {
    paddingLeft: heightPixel(15),
    marginVertical: heightPixel(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  userBoxContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: heightPixel(10),
  },
  userAvatar: {
    width: heightPixel(60),
    height: heightPixel(60),
    borderRadius: heightPixel(30),
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
  fullnameStyle: {
    textAlign: 'center',
    fontSize: fontPixel(18),
    color: 'black',
    paddingLeft: heightPixel(8),
    maxWidth: SCREEN_WIDTH * 0.45,
  },
  columnCenterStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
});

export default FeedPage;
