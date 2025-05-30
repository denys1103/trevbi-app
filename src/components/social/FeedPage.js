import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ScrollView,
  RefreshControl,
  ActionSheetIOS,
  Alert,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Share from 'react-native-share';
import {GlobalContext} from '../../context';
import {fontPixel, heightPixel, imageURL, postImageRootURL} from '../../config';
import LinkText from './LinkText';
import LinkPreviewCard from './LinkPreviewCard';
import CommentBottomSheet from './CommentBottomSheet';
import FeedPostMedia from './FeedPostMedia';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const FeedPage = ({navigation, route}) => {
  const {userid} = route?.params || {};
  const {
    userInfo,
    getPostList,
    postList,
    updateLike,
    setPostList,
    getUserPostList,
    followRequest,
    getUserData,
    deletePost,
  } = useContext(GlobalContext);
  const [selectPostModalVisibleStatus, setSelectPostModalVisibleStatus] =
    useState(false);
  const [selectProfileModalVisibleStatus, setSelectProfileModalVisibleStatus] =
    useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const profile = userInfo.user;
  const [userPostList, setUserPostList] = useState([]);
  const [refreshingPosts, setRefreshingPosts] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const commentSheetRef = useRef(null);
  const [activePostIndex, setActivePostIndex] = useState(0);
  const numColumns = 2;
  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setActivePostIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  useEffect(() => {
    if (userid) {
      showOtherProfileAction(userid);
    }
    getPostList();
  }, []);

  const fetchPosts = async () => {
    setRefreshingPosts(true);
    await getPostList();
    setRefreshingPosts(false);
    // setTimeout(() => {
    //   setRefreshingPosts(false);
    // }, 1000);
  };

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
      if (selectType == 1) {
        setSelectedPost(prevPost =>
          prevPost._id === id ? {...prevPost, like: onePost.like} : prevPost,
        );
      }
      if (selectType == 2) {
        setUserPostList(prevList =>
          prevList.map(post =>
            post._id === onePost._id ? {...post, like: onePost.like} : post,
          ),
        );
      }
    }
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
            onDeletePost(item._id, false);
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
            onPress: () => onDeletePost(item._id, false),
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
      <View style={styles.renderItemStyle}>
        <TouchableOpacity
          onPress={() => {
            setSelectedPost(item);
            setSelectPostModalVisibleStatus(true);
            setSelectProfileModalVisibleStatus(false);
          }}
          activeOpacity={0.8}>
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
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            paddingVertical: heightPixel(2),
            width: '100%',
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.columnCenterStyle}
            onPress={() => {
              // if (item.userid._id !== profile._id) {
              onLikePress(item._id, 2);
              // }
            }}>
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
          </TouchableOpacity>
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
        </View>
      </View>
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

  const showOtherProfileAction = async id => {
    setWaiting(true);
    if (id == profile._id) {
      navigation.replace('SocialProfile');
    }
    if (id) {
      commentSheetRef.current?.close();
      const user = await getUserData(id);
      setSelectedUser(user);
      const userPosts = await getUserPostList(id);
      setUserPostList(userPosts);
    }
    setSelectProfileModalVisibleStatus(true);
    setIsProfileModalVisible(true);
    setWaiting(false);
  };

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

  const onCommentBtnPress = updatedPost => {
    if (updatedPost && updatedPost._id) {
      setPostList(prevList =>
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
      setUserPostList(prevList =>
        prevList.map(post =>
          post._id === updatedPost._id
            ? {...post, comment: updatedPost.comment}
            : post,
        ),
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Spinner visible={waiting} />
      <GestureHandlerRootView style={styles.container}>
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
          style={[styles.logoStyle, {alignSelf: 'center'}]}
          source={require('../../../assets/images/TREVBI_SOCIAL_LOGO_small.png')}
        />
        <FlatList
          enableEmptySections={true}
          data={postList}
          refreshControl={
            <RefreshControl
              refreshing={refreshingPosts}
              onRefresh={() => fetchPosts()}
            />
          }
          keyExtractor={item => item._id}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingBottom: heightPixel(10),
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    showOtherProfileAction(item.userid?._id);
                  }}
                  style={styles.userBox}>
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
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedPost(item);
                    setActivePostIndex(-1);
                    setSelectPostModalVisibleStatus(true);
                  }}>
                  {/* <Image
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
                  /> */}
                  <FeedPostMedia
                    media={item?.media ? item.media : []}
                    isActive={index === activePostIndex}
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
                    <Image
                      style={{
                        width: heightPixel(37),
                        height: heightPixel(30),
                        resizeMode: 'cover',
                        marginHorizontal: heightPixel(8),
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
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.columnCenterStyle}
                    onPress={() => {
                      setSelectedPost(item);
                      setTimeout(() => {
                        openComments();
                      }, 100);
                    }}>
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
                      {item.comment ? item.comment.length : 0}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.columnCenterStyle}
                    onPress={() => {
                      handleShare(item);
                    }}>
                    <FontAwesome
                      size={fontPixel(30)}
                      name={'share-square-o'}
                      color={'black'}
                      style={{paddingHorizontal: heightPixel(15)}}
                    />
                  </TouchableOpacity>
                  {item.userid._id == profile._id && (
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={styles.columnCenterStyle}
                      onPress={() => {
                        handlePostEditPress(item);
                      }}>
                      <FontAwesome
                        size={fontPixel(30)}
                        name={'edit'}
                        color={'black'}
                        style={{paddingHorizontal: heightPixel(15)}}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewConfigRef.current}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
        />
        {selectPostModalVisibleStatus && (
          <View style={styles.postModalStyle}>
            <ScrollView
              style={{
                height: SCREEN_HEIGHT - heightPixel(120),
              }}>
              <View style={styles.closeContainer}>
                <TouchableOpacity
                  onPress={() => {
                    commentSheetRef.current?.close();
                    if (isProfileModalVisible) {
                      setSelectProfileModalVisibleStatus(true);
                    }
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
                activeOpacity={0.8}
                onPress={async () => {
                  if (selectedPost.userid?._id == profile._id) {
                    navigation.replace('SocialProfile');
                  }
                  if (selectedPost.userid?._id) {
                    const userPosts = await getUserPostList(
                      selectedPost.userid._id,
                    );
                    setUserPostList(userPosts);
                  }
                  setSelectPostModalVisibleStatus(false);
                  setSelectProfileModalVisibleStatus(true);
                  setIsProfileModalVisible(true);
                }}
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
              <View style={styles.iconsBox}>
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
                {selectedPost.userid._id == profile._id && (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.columnCenterStyle}
                    onPress={() => {
                      handlePostEditPress(selectedPost);
                    }}>
                    <FontAwesome
                      size={fontPixel(30)}
                      name={'edit'}
                      color={'black'}
                      style={{paddingHorizontal: heightPixel(15)}}
                    />
                  </TouchableOpacity>
                )}
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
              {/* <Text
                allowFontScaling={false}
                style={{
                  fontSize: fontPixel(18),
                  color: 'black',
                  paddingHorizontal: heightPixel(15),
                  paddingBottom: heightPixel(20),
                }}>
                {selectedPost?.note ? selectedPost.note : ''}
              </Text> */}
              <LinkText text={selectedPost?.note ? selectedPost.note : ''} />
              <LinkPreviewCard
                text={selectedPost?.note ? selectedPost.note : ''}
              />
            </ScrollView>
          </View>
        )}
        {selectProfileModalVisibleStatus && (
          <View style={styles.modalStyle}>
            <View style={styles.closeContainer}>
              <TouchableOpacity
                onPress={() => {
                  setSelectProfileModalVisibleStatus(false);
                  setIsProfileModalVisible(false);
                }}>
                <MaterialCommunityIcons
                  color={'#61a148'}
                  name="close"
                  size={fontPixel(28)}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.overlay}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.avatar}
                  source={
                    selectedUser.avatar
                      ? {
                          uri: imageURL + selectedUser.avatar,
                        }
                      : require('../../../assets/images/free_user.png')
                  }
                />
                <View style={styles.columnStartStyle}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.fullnameStyle,
                      {maxWidth: SCREEN_WIDTH * 0.9},
                    ]}>
                    {selectedUser.fullname ? selectedUser.fullname : ''}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.joinCrewBtnStyle}
                    onPress={() => {
                      if (selectedUser._id) {
                        if (profile.following.indexOf(selectedUser._id) < 0) {
                          followRequest(selectedUser._id);
                        } else {
                          followRequest(selectedUser._id, 1);
                        }
                      }
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: fontPixel(14),
                        color: '#61a148',
                        fontFamily: 'LEMONMILK-Medium',
                      }}>
                      {profile.following.indexOf(selectedUser._id) < 0
                        ? 'Follow'
                        : 'Unfollow'}
                    </Text>
                  </TouchableOpacity>
                </View>
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
                {selectedUser.bio ? selectedUser.bio : ''}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: heightPixel(10),
                width: '82%',
              }}>
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
                      userid: selectedUser._id,
                      userAvatar: selectedUser.avatar,
                      userName: selectedUser.fullname,
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
                      userid: selectedUser._id,
                      userAvatar: selectedUser.avatar,
                      userName: selectedUser.fullname,
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
                    navigation.replace('CookbookPage', {
                      userid: selectedUser._id,
                      userAvatar: selectedUser.avatar,
                      userName: selectedUser.fullname,
                    });
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
                data={formatRow(userPostList, numColumns)}
                keyExtractor={item => {
                  return item._id;
                }}
                renderItem={renderItem}
                numColumns={numColumns}
              />
            </View>
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
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.15,
    resizeMode: 'cover',
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
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    top: heightPixel(0),
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  postModalStyle: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    top: heightPixel(0),
    width: SCREEN_WIDTH,
  },
  overlay: {
    paddingTop: heightPixel(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: heightPixel(15),
  },
  bioStyle: {
    textAlign: 'left',
    fontSize: fontPixel(18),
    color: 'black',
    paddingTop: heightPixel(8),
    minHeight: heightPixel(60),
    paddingHorizontal: heightPixel(15),
  },
  joinCrewBtnStyle: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: heightPixel(15),
    paddingVertical: heightPixel(1),
    paddingHorizontal: heightPixel(5),
    marginLeft: heightPixel(5),
    alignSelf: 'flex-start',
    justifyContent: 'center',
    borderColor: '#61a148',
    borderWidth: heightPixel(2),
  },
  columnStartStyle: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
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
  ico: {
    width: heightPixel(28),
    height: heightPixel(28),
    resizeMode: 'cover',
  },
  wrapper: {
    paddingHorizontal: heightPixel(13),
    paddingTop: heightPixel(5),
    maxHeight: SCREEN_HEIGHT - SCREEN_WIDTH * 0.15 - heightPixel(300),
  },
  renderItemStyle: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: heightPixel(1),
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
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: heightPixel(10),
  },
});

export default FeedPage;
