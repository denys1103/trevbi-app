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
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GlobalContext} from '../../context';
import {fontPixel, heightPixel, imageURL, postImageRootURL} from '../../config';
import LinkText from './LinkText';
import LinkPreviewCard from './LinkPreviewCard';
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
  const numColumns = 2;

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
    if (id == profile._id) {
      navigation.replace('SocialProfile');
    }
    if (id) {
      const user = await getUserData(id);
      setSelectedUser(user);
      const userPosts = await getUserPostList(id);
      setUserPostList(userPosts);
    }
    setSelectProfileModalVisibleStatus(true);
    setIsProfileModalVisible(true);
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
          renderItem={({item}) => {
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
                      console.log('');
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
                      console.log('');
                    }}>
                    <FontAwesome
                      size={fontPixel(30)}
                      name={'share-square-o'}
                      color={'black'}
                      style={{paddingHorizontal: heightPixel(15)}}
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
          <View style={styles.postModalStyle}>
            <ScrollView
              style={{
                height: SCREEN_HEIGHT - heightPixel(120),
              }}>
              <View style={styles.closeContainer}>
                <TouchableOpacity
                  onPress={() => {
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
                  onPress={() => {
                    console.log('');
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
                    {selectedPost.comment ? selectedPost.comment.length : 0}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.columnCenterStyle}
                  onPress={() => {
                    console.log('');
                  }}>
                  <FontAwesome
                    size={fontPixel(30)}
                    name={'share-square-o'}
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
                        ? 'Join My Crew'
                        : 'Crewed Up'}
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
                  {`   Crew   `}
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
                  {`Members`}
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
    paddingHorizontal: heightPixel(15),
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
