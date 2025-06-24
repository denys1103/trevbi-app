import React, {useState, useContext, useEffect} from 'react';
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
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SearchBar} from '@rneui/themed';
import {GlobalContext} from '../../context';
import {SocketContext} from '../../context/socket';
import {fontPixel, heightPixel, imageURL} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const MembersPage = ({navigation, route}) => {
  const {userid, userAvatar, userName, isMembersActive} = route?.params || {};
  const {
    userInfo,
    followRequest,
    getUserCrewList,
    getUserMemberList,
    getUserList,
    userList,
  } = useContext(GlobalContext);
  const {followSocketRequest, checkFollowSocketEvent} =
    useContext(SocketContext);
  const [activeCrewTab, setActiveCrewTab] = useState(
    isMembersActive ? false : true,
  );
  const [memberList, setMemberList] = useState([]);
  const [refreshingUsers, setRefreshingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const profile = userInfo.user;

  useEffect(() => {
    async function fetchData() {
      const id = userid ?? profile._id;
      if (isMembersActive) {
        setActiveCrewTab(false);
        const users = await getUserMemberList(id);
        setMemberList(users);
      } else {
        setActiveCrewTab(true);
        const users = await getUserCrewList(id);
        setMemberList(users);
      }
    }
    fetchData();
    getUserList();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setIsSearching(false);
      setFilteredUsers([]);
    } else {
      const lower = searchQuery.toLowerCase();
      const results = userList.filter(user =>
        user.fullname.toLowerCase().includes(lower),
      );
      setFilteredUsers(results);
      setIsSearching(true);
    }
  }, [searchQuery, userList]);

  useEffect(() => {
    async function fetchMemberList() {
      const id = userid ?? profile._id;
      const users = await getUserMemberList(id);
      setMemberList(users);
    }
    if (!activeCrewTab) {
      fetchMemberList();
    }
  }, [checkFollowSocketEvent]);

  const fetchUsers = async () => {
    setRefreshingUsers(true);
    const id = userid ?? profile._id;
    if (!activeCrewTab) {
      const users = await getUserMemberList(id);
      setMemberList(users);
    } else {
      const users = await getUserCrewList(id);
      setMemberList(users);
    }
    setRefreshingUsers(false);
  };

  const dataToShow = isSearching ? filteredUsers : memberList;

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {/* <TouchableOpacity
          activeOpacity={0.5}
          style={[
            styles.goToBackBtnStyle,
            {width: heightPixel(80), marginBottom: heightPixel(5)},
          ]}
          onPress={() => {
            if (userid) {
              if (userid == profile._id) {
                navigation.replace('SocialProfile');
              } else {
                navigation.replace('FeedPage', {userid});
              }
            }
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
        </TouchableOpacity> */}
        <View
          style={{
            paddingHorizontal: '10%',
            paddingTop: heightPixel(10),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <SearchBar
            placeholder="Search User"
            onChangeText={setSearchQuery}
            platform={Platform.OS === 'ios' ? 'ios' : 'android'}
            containerStyle={{
              borderRadius: heightPixel(20),
              marginBottom: heightPixel(10),
            }}
            inputContainerStyle={{borderRadius: heightPixel(20)}}
            searchIcon={Platform.OS === 'ios' ? {name: 'search'} : null}
            clearIcon={Platform.OS === 'ios' ? {name: 'close-circle'} : null}
            value={searchQuery}
            allowFontScaling={false}
          />
          {/* <View style={{flex: 1}}>
            <SearchBar
              placeholder="Search User"
              onChangeText={setSearchQuery}
              value={searchQuery}
              platform={Platform.OS === 'ios' ? 'ios' : 'android'}
              showCancel={false}
              allowFontScaling={false}
              containerStyle={{
                borderRadius: heightPixel(20),
                marginBottom: heightPixel(10),
                padding: 0,
                backgroundColor: 'transparent',
              }}
              inputContainerStyle={{
                borderRadius: heightPixel(20),
                // backgroundColor: '#f0f0f0',
                height: heightPixel(40),
              }}
              inputStyle={{
                fontSize: fontPixel(16),
                allowFontScaling: false,
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View> */}
          {/* {isFocused && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setIsFocused(false);
              }}>
              <Text
                style={{marginLeft: 10, color: '#61a148', fontSize: 16}}
                allowFontScaling={false}>
                Cancel
              </Text>
            </TouchableOpacity>
          )} */}
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.overlay}
          onPress={() => {
            if (userid) {
              if (userid == profile._id) {
                navigation.replace('SocialProfile');
              } else {
                navigation.replace('FeedPage', {userid});
              }
            }
          }}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={
                userAvatar
                  ? {
                      uri: imageURL + userAvatar,
                    }
                  : require('../../../assets/images/free_user.png')
              }
            />
            <Text
              allowFontScaling={false}
              style={[styles.fullnameStyle, {maxWidth: SCREEN_WIDTH * 0.9}]}>
              {userName ? userName : ''}
            </Text>
          </View>
          <Image
            style={styles.logoStyle}
            source={require('../../../assets/images/TREVBI_SOCIAL_LOGO_small.png')}
          />
        </TouchableOpacity>
        {!isSearching && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: heightPixel(10),
            }}>
            <View style={styles.columnCenterStyle}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={
                  activeCrewTab
                    ? styles.postBtnActiveStyle
                    : styles.postBtnStyle
                }
                onPress={async () => {
                  setActiveCrewTab(true);
                  const id = userid ?? profile._id;
                  const users = await getUserCrewList(id);
                  setMemberList(users);
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
                style={
                  !activeCrewTab
                    ? styles.postBtnActiveStyle
                    : styles.postBtnStyle
                }
                onPress={async () => {
                  setActiveCrewTab(false);
                  const id = userid ?? profile._id;
                  const users = await getUserMemberList(id);
                  setMemberList(users);
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
          </View>
        )}
        <FlatList
          enableEmptySections={true}
          data={dataToShow}
          refreshControl={
            <RefreshControl
              refreshing={refreshingUsers}
              onRefresh={() => fetchUsers()}
            />
          }
          keyExtractor={item => item._id}
          renderItem={({item}) => {
            return (
              <>
                {item._id !== profile._id && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: SCREEN_WIDTH * 0.95,
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => {
                        navigation.replace('FeedPage', {
                          userid: item._id,
                        });
                      }}
                      style={styles.userBox}>
                      <Image
                        style={styles.userAvatar}
                        source={
                          item?.avatar
                            ? {
                                uri: imageURL + item.avatar,
                              }
                            : require('../../../assets/images/free_user.png')
                        }
                      />
                      <View style={styles.userBoxContent}>
                        <Text
                          allowFontScaling={false}
                          numberOfLines={1}
                          style={{
                            fontSize: fontPixel(18),
                            color: 'black',
                          }}>
                          {item?.fullname ? item.fullname : ''}
                        </Text>
                        <Text
                          allowFontScaling={false}
                          numberOfLines={1}
                          style={{
                            fontSize: fontPixel(18),
                            color: 'black',
                          }}>
                          {item?.bio ? item.bio : ''}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {userInfo.user.following.indexOf(item._id) > -1 ? (
                      <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.unfollowBtnStyle}
                        onPress={async () => {
                          await followRequest(item._id, 1);
                          fetchUsers();
                          followSocketRequest(item._id);
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: fontPixel(14),
                            color: '#61a148',
                            fontFamily: 'LEMONMILK-Medium',
                          }}>
                          Unfollow
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.unfollowBtnStyle}
                        onPress={async () => {
                          await followRequest(item._id);
                          fetchUsers();
                          followSocketRequest(item._id);
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: fontPixel(14),
                            color: '#61a148',
                            fontFamily: 'LEMONMILK-Medium',
                          }}>
                          Follow
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </>
            );
          }}
          ListEmptyComponent={
            <Text allowFontScaling={false} style={styles.emptyMessage}>
              No users found
            </Text>
          }
        />
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
  overlay: {
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
  columnCenterStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: heightPixel(6),
  },
  postBtnStyle: {
    backgroundColor: '#063225',
    width: heightPixel(40),
    height: heightPixel(40),
    borderRadius: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBtnActiveStyle: {
    backgroundColor: '#61a148',
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
  unfollowBtnStyle: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: heightPixel(8),
    paddingVertical: heightPixel(3),
    paddingHorizontal: heightPixel(5),
    justifyContent: 'center',
    borderColor: '#61a148',
    borderWidth: heightPixel(2),
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
    width: '60%',
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
  emptyMessage: {
    textAlign: 'center',
    marginTop: heightPixel(20),
    fontSize: fontPixel(18),
    color: '#888',
  },
});

export default MembersPage;
