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
import {GlobalContext} from '../../context';
import {fontPixel, heightPixel, imageURL} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const MembersPage = ({navigation, route}) => {
  const {userid, userAvatar, userName, isMembersActive} = route?.params || {};
  const {userInfo, followRequest, getUserCrewList, getUserMemberList} =
    useContext(GlobalContext);
  const [activeCrewTab, setActiveCrewTab] = useState(
    isMembersActive ? false : true,
  );
  const [selectedUser, setSelectedUser] = useState({});
  const [memberList, setMemberList] = useState([]);
  const [refreshingUsers, setRefreshingUsers] = useState(false);
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
  }, []);

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
                activeCrewTab ? styles.postBtnActiveStyle : styles.postBtnStyle
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
              {`   Crew   `}
            </Text>
          </View>
          <View style={styles.columnCenterStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={
                !activeCrewTab ? styles.postBtnActiveStyle : styles.postBtnStyle
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
              {`Members`}
            </Text>
          </View>
        </View>
        <FlatList
          enableEmptySections={true}
          data={memberList}
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
                        }}>
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: fontPixel(14),
                            color: '#61a148',
                            fontFamily: 'LEMONMILK-Medium',
                          }}>
                          Join My Crew
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </>
            );
          }}
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
});

export default MembersPage;
