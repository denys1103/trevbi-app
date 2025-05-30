import React, {useContext, useEffect, useState, useRef} from 'react';
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
  ActionSheetIOS,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Share from 'react-native-share';
import {fontPixel, heightPixel, imageURL, postImageRootURL} from '../../config';
import {GlobalContext} from '../../context';
import LinkText from './LinkText';
import LinkPreviewCard from './LinkPreviewCard';
import CommentBottomSheet from './CommentBottomSheet';
import FeedPostMedia from './FeedPostMedia';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const SocialProfileScreen = ({navigation}) => {
  const {
    userInfo,
    myPostList,
    getMyPostList,
    updateLike,
    setMyPostList,
    deletePost,
  } = useContext(GlobalContext);
  const [selectedPost, setSelectedPost] = useState({});
  const [selectPostModalVisibleStatus, setSelectPostModalVisibleStatus] =
    useState(false);
  const commentSheetRef = useRef(null);
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

  const openComments = () => {
    commentSheetRef.current?.snapToIndex(0);
  };

  const handleShare = async post => {
    const postImage = post.photo ? postImageRootURL + post.photo : '';
    // const shareLink = `https://myapp.com/post/${post._id}`;
    const shareOptions = {
      title: post.title ? post.title : '',
      // message: `Take a look at this! \n\n${shareLink}`,
      message: 'Take a look at this!',
      url: postImage,
      failOnCancel: false,
    };
    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const onLikePress = async (id, selectType = 0) => {
    const onePost = await updateLike({
      id: id,
      status: 0,
    });
    if (onePost && onePost._id) {
      setMyPostList(prevList =>
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

  const onCommentBtnPress = updatedPost => {
    if (updatedPost && updatedPost._id) {
      setMyPostList(prevList =>
        prevList.map(post =>
          post._id === updatedPost._id
            ? {...post, comment: updatedPost.comment}
            : post,
        ),
      );
      setSelectedPost(prevPost =>
        prevPost._id === updatedPost._id
          ? {...prevPost, comment: updatedPost.comment}
          : prevPost,
      );
    }
  };

  const formatLike = count => {
    if (count >= 1_000_000) {
      return (count / 1_000_000).toFixed(0).replace(/\.0$/, '') + 'M';
    } else if (count >= 1_000) {
      return (count / 1_000).toFixed(0).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };

  const onEditPost = async item => {
    let selectMedia = [];
    if (item?.media) {
      selectMedia = item.media.map(mediaItem => ({
        ...mediaItem,
        path: postImageRootURL + mediaItem.name,
      }));
    }
    navigation.replace('CreatePost', {onePost: {...item, media: selectMedia}});
  };

  const onDeletePost = async (id, isMyPost = true) => {
    try {
      await deletePost({
        id,
        isMyPost,
      });
      commentSheetRef.current?.close();
      setSelectPostModalVisibleStatus(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostEditPress = item => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Edit', 'Delete'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            onEditPost(item);
          } else if (buttonIndex === 2) {
            onDeletePost(item._id);
          }
        },
      );
    } else {
      Alert.alert(
        'Comment Options',
        '',
        [
          {text: 'Edit', onPress: () => onEditPost(item)},
          {
            text: 'Delete',
            onPress: () => onDeletePost(item._id),
            style: 'destructive',
          },
          {text: 'Cancel', style: 'cancel'},
        ],
        {cancelable: true},
      );
    }
  };

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
          {/* <Image
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
          /> */}
          <FeedPostMedia
            media={item?.media ? item.media : []}
            isActive={false}
            width={itemDimension}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              paddingVertical: heightPixel(2),
              width: '100%',
            }}>
            <View style={styles.columnCenterStyle}>
              <Image
                style={{
                  width: heightPixel(25),
                  height: heightPixel(20),
                  resizeMode: 'cover',
                  marginHorizontal: heightPixel(6),
                }}
                source={
                  item.like.includes(profile._id)
                    ? require('../../../assets/images/kiss_like.png')
                    : require('../../../assets/images/kiss.png')
                }
              />
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: fontPixel(10),
                  color: 'black',
                  paddingHorizontal: heightPixel(10),
                }}>
                {item.like ? formatLike(item.like.length) : 0}
              </Text>
            </View>
            <View style={styles.columnCenterStyle}>
              <Image
                style={{
                  width: heightPixel(25),
                  height: heightPixel(20),
                  resizeMode: 'cover',
                  marginHorizontal: heightPixel(6),
                }}
                source={require('../../../assets/images/comment.png')}
              />
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: fontPixel(10),
                  color: 'black',
                  paddingHorizontal: heightPixel(10),
                }}>
                {item.comment ? item.comment.length : 0}
              </Text>
            </View>
            <View style={styles.columnCenterStyle}>
              <FontAwesome
                size={fontPixel(20)}
                name={'share-square-o'}
                color={'black'}
                style={{paddingHorizontal: heightPixel(8)}}
              />
            </View>
            <View style={styles.columnCenterStyle}>
              <FontAwesome
                size={fontPixel(20)}
                name={'edit'}
                color={'black'}
                style={{paddingHorizontal: heightPixel(8)}}
              />
            </View>
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
      <GestureHandlerRootView style={styles.flex1}>
        {!selectPostModalVisibleStatus && (
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
                  style={[
                    styles.fullnameStyle,
                    {maxWidth: SCREEN_WIDTH * 0.9},
                  ]}>
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
                    navigation.replace('FeedPage');
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
                    navigation.replace('MembersPage', {
                      userid: profile._id,
                      userAvatar: profile.avatar,
                      userName: profile.fullname,
                      isMembersActive: false,
                    });
                  }}>
                  <Image
                    style={styles.ico}
                    source={require('../../../assets/images/crew_ico.png')}
                  />
                </TouchableOpacity>
                <Text allowFontScaling={false} style={styles.postTitleStyle}>
                  {` Follow `}
                </Text>
              </View>
              <View style={styles.columnCenterStyle}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.postBtnStyle}
                  onPress={() => {
                    navigation.replace('MembersPage', {
                      userid: profile._id,
                      userAvatar: profile.avatar,
                      userName: profile.fullname,
                      isMembersActive: true,
                    });
                  }}>
                  <Image
                    style={styles.ico}
                    source={require('../../../assets/images/members_ico.png')}
                  />
                </TouchableOpacity>
                <Text allowFontScaling={false} style={styles.postTitleStyle}>
                  {`Followers`}
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
        )}
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
                    commentSheetRef.current?.close();
                    setSelectPostModalVisibleStatus(false);
                  }}>
                  <MaterialCommunityIcons
                    color={'#61a148'}
                    name="close"
                    size={fontPixel(28)}
                  />
                </TouchableOpacity>
              </View>
              <Image
                style={[styles.logoStyle, {alignSelf: 'center'}]}
                source={require('../../../assets/images/TREVBI_SOCIAL_LOGO_small.png')}
              />
              <TouchableOpacity
                onPress={() => {
                  setSelectPostModalVisibleStatus(false);
                }}
                activeOpacity={0.7}
                style={[styles.avatarContainer, {padding: heightPixel(10)}]}>
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
              </TouchableOpacity>
              {/* <Image
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
              /> */}
              <FeedPostMedia
                media={selectedPost?.media ? selectedPost.media : []}
                isActive={false}
                isRepeat={true}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  paddingVertical: heightPixel(5),
                  width: '100%',
                }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.columnCenterStyle}
                  onPress={() => {
                    // if (selectedPost.userid._id !== profile._id) {
                    onLikePress(selectedPost._id, 1);
                    // }
                  }}>
                  <Image
                    style={{
                      width: heightPixel(37),
                      height: heightPixel(30),
                      resizeMode: 'cover',
                      marginHorizontal: heightPixel(8),
                    }}
                    source={
                      selectedPost.like.includes(profile._id)
                        ? require('../../../assets/images/kiss_like.png')
                        : require('../../../assets/images/kiss.png')
                    }
                  />
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: fontPixel(10),
                      color: 'black',
                      paddingHorizontal: heightPixel(10),
                    }}>
                    {selectedPost.like
                      ? formatLike(selectedPost.like.length)
                      : 0}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.columnCenterStyle}
                  onPress={openComments}>
                  <Image
                    style={{
                      width: heightPixel(37),
                      height: heightPixel(30),
                      resizeMode: 'cover',
                      marginHorizontal: heightPixel(8),
                    }}
                    source={require('../../../assets/images/comment.png')}
                  />
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: fontPixel(10),
                      color: 'black',
                      paddingHorizontal: heightPixel(10),
                    }}>
                    {selectedPost.comment ? selectedPost.comment.length : 0}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.columnCenterStyle}
                  onPress={() => {
                    handleShare(selectedPost);
                  }}>
                  <FontAwesome
                    size={fontPixel(30)}
                    name={'share-square-o'}
                    color={'black'}
                    style={{paddingHorizontal: heightPixel(15)}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.columnCenterStyle}
                  onPress={() => {
                    // if (selectedPost.userid._id !== profile._id) {
                    handlePostEditPress(selectedPost);
                    // }
                  }}>
                  <FontAwesome
                    size={fontPixel(30)}
                    name={'edit'}
                    color={'black'}
                    style={{paddingHorizontal: heightPixel(15)}}
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
              <LinkText text={selectedPost?.note ? selectedPost.note : ''} />
              <LinkPreviewCard
                text={selectedPost?.note ? selectedPost.note : ''}
              />
            </ScrollView>
          </View>
        )}
        <CommentBottomSheet
          postItem={selectedPost}
          onCommentBtnPress={onCommentBtnPress}
          ref={commentSheetRef}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  flex1: {
    flex: 1,
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
    paddingHorizontal: heightPixel(13),
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
    // position: 'absolute',
    top: heightPixel(0),
    width: SCREEN_WIDTH,
  },
});

export default SocialProfileScreen;
