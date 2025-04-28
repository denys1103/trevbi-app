import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {fontPixel, heightPixel, imageURL} from '../../config';

import {GlobalContext} from '../../context';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export function Profile({setEditVisible, navigation}) {
  const {
    userInfo,
    getUserList,
    userList,
    followRequest,
    friendList,
    getFriendList,
  } = useContext(GlobalContext);
  const [profileVisibleStatus, setProfileVisibleStatus] = useState(true);
  const [followVisibleStatus, setFollowVisibleStatus] = useState(false);
  const [selectUserModalVisibleStatus, setSelectUserModalVisibleStatus] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [friendsVisibleStatus, setFriendsVisibleStatus] = useState(false);
  const [cookBookVisibleStatus, setCookBookVisibleStatus] = useState(false);
  const numColumns = 3;
  useEffect(() => {
    if (!userInfo.token) {
      navigation.replace('Login');
    }
  }, [navigation, userInfo.token]);
  const profile = userInfo.user;

  const format_date = date => {
    date = new Date(date);
    if (!date) {
      date = new Date();
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  };

  const clickFollowBtn = () => {
    if (userList.length < 1) {
      getUserList();
    }
    setProfileVisibleStatus(false);
    setFollowVisibleStatus(true);
  };
  const clickShowFriendsBtn = () => {
    if (friendList.length < 1) {
      getFriendList();
    }
    setProfileVisibleStatus(false);
    setFriendsVisibleStatus(true);
  };

  const clickShowCookBookBtn = () => {
    setProfileVisibleStatus(false);
    setCookBookVisibleStatus(true);
  };

  const renderItem = ({item, index}) => {
    if (item.empty === true) {
      return <></>;
    }
    var itemDimension = SCREEN_WIDTH / numColumns;
    return (
      <TouchableOpacity
        style={[styles.item]}
        onPress={() => {
          // setPopupVisible(false);
          // selectItem(item);
        }}
        activeOpacity={0.8}>
        <View
          style={{
            ...styles.renderItemStyle,
            width: itemDimension - heightPixel(2),
          }}>
          <Image
            style={{
              width: itemDimension * 0.8,
              height: itemDimension * 0.8,
              borderRadius: itemDimension * 0.4,
            }}
            source={
              item?.avatar
                ? {
                    uri: imageURL + item.avatar,
                  }
                : require('../../../assets/images/free_user.png')
            }
          />
          <Text
            allowFontScaling={false}
            style={{fontSize: fontPixel(18), color: 'black'}}>
            {item?.fullname ? item.fullname : ''}
          </Text>
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {profileVisibleStatus && (
        <>
          <View style={styles.pencilContainer}>
            {/* <TouchableOpacity onPress={() => setEditVisible(true)}>
              <MaterialCommunityIcons
                color={'#72a045'}
                name="account-edit"
                size={fontPixel(28)}
              />
            </TouchableOpacity> */}
          </View>
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
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '90%',
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, {flexDirection: 'row', width: '45%'}]}
              onPress={() => console.log('')}>
              <Image
                style={{
                  width: heightPixel(18),
                  height: heightPixel(18),
                  resizeMode: 'contain',
                }}
                source={require('../../../assets/images/social_profile.png')}
              />
              <Text
                allowFontScaling={false}
                style={[
                  styles.buttonText,
                  {fontSize: fontPixel(12), paddingLeft: heightPixel(5)},
                ]}>
                Social Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, {flexDirection: 'row', width: '45%'}]}
              onPress={() => setEditVisible(true)}>
              <MaterialCommunityIcons
                size={fontPixel(18)}
                name={'account-edit'}
                style={{color: 'white', paddingRight: heightPixel(5)}}
              />
              <Text
                allowFontScaling={false}
                style={[styles.buttonText, {fontSize: fontPixel(12)}]}>
                Profile Edit
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.form}>
            <View style={styles.box}>
              <MaterialCommunityIcons
                color={'#7d7d7d'}
                name="account"
                size={fontPixel(32)}
              />
              <View style={styles.boxContent}>
                <Text allowFontScaling={false} style={styles.label}>
                  Name
                </Text>
                <Text allowFontScaling={false} style={styles.profileDataStyle}>
                  {profile?.fullname ? profile.fullname : ''}
                </Text>
              </View>
            </View>
            <View style={styles.box}>
              <MaterialCommunityIcons
                color={'#7d7d7d'}
                name="calendar-month"
                size={fontPixel(32)}
              />
              <View style={styles.boxContent}>
                <Text allowFontScaling={false} style={styles.label}>
                  Date of Birth
                </Text>
                <Text allowFontScaling={false} style={styles.profileDataStyle}>
                  {profile?.birth
                    ? format_date(profile.birth)
                    : format_date(new Date())}
                </Text>
              </View>
            </View>
            <View style={styles.box}>
              <MaterialCommunityIcons
                color={'#7d7d7d'}
                name="phone"
                size={fontPixel(32)}
              />
              <View style={styles.boxContent}>
                <Text allowFontScaling={false} style={styles.label}>
                  Phone Number
                </Text>
                <Text allowFontScaling={false} style={styles.profileDataStyle}>
                  {profile?.phone_num ? profile.phone_num : ''}
                </Text>
              </View>
            </View>
            <View style={styles.box}>
              <MaterialCommunityIcons
                color={'#7d7d7d'}
                name="email"
                size={fontPixel(32)}
              />
              <View style={styles.boxContent}>
                <Text allowFontScaling={false} style={styles.label}>
                  Email address
                </Text>
                <Text allowFontScaling={false} style={styles.profileDataStyle}>
                  {profile?.email ? profile.email : ''}
                </Text>
              </View>
            </View>
            <View style={[styles.box, {alignItems: 'flex-start'}]}>
              <AntDesign color={'#7d7d7d'} name="idcard" size={fontPixel(32)} />
              <View style={styles.boxContent}>
                <Text allowFontScaling={false} style={styles.label}>
                  Bio:
                </Text>
                <Text allowFontScaling={false} style={styles.profileDataStyle}>
                  {profile?.bio ? profile.bio : ''}
                </Text>
              </View>
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                marginTop: heightPixel(20),
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.button, {flexDirection: 'row'}]}
                onPress={clickShowFriendsBtn}>
                <FontAwesome5
                  size={fontPixel(18)}
                  name={'users'}
                  style={{color: 'white', paddingRight: heightPixel(5)}}
                />
                <Text allowFontScaling={false} style={styles.buttonText}>
                  Friends
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.button, {flexDirection: 'row'}]}
                onPress={clickFollowBtn}>
                <FontAwesome5
                  size={fontPixel(18)}
                  name={'plus-circle'}
                  style={{color: 'white', paddingRight: heightPixel(5)}}
                />
                <Text allowFontScaling={false} style={styles.buttonText}>
                  Follow
                </Text>
              </TouchableOpacity>
            </View> */}
            {/* <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={clickShowCookBookBtn}>
              <Text allowFontScaling={false} style={styles.buttonText}>
                Cookbook
              </Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              activeOpacity={0.8}
              style={styles.button}
              onPress={logout}>
              <Text allowFontScaling={false} style={styles.buttonText}>
                Logout
              </Text>
            </TouchableOpacity> */}
          </View>
        </>
      )}
      {followVisibleStatus && (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingBottom: heightPixel(5),
            }}>
            <View style={styles.refreshContainer}>
              <TouchableOpacity
                onPress={() => {
                  getUserList();
                }}>
                <Feather
                  color={'#72a045'}
                  name="refresh-cw"
                  size={fontPixel(28)}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.pencilContainer}>
              <TouchableOpacity
                onPress={() => {
                  setProfileVisibleStatus(true);
                  setFollowVisibleStatus(false);
                }}>
                <MaterialCommunityIcons
                  color={'#72a045'}
                  name="close"
                  size={fontPixel(28)}
                />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            enableEmptySections={true}
            data={userList}
            keyExtractor={item => item._id}
            renderItem={({item}) => {
              return (
                <>
                  {item._id !== profile._id && (
                    <View>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => {
                          setSelectedUser(item);
                          setSelectUserModalVisibleStatus(true);
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: SCREEN_WIDTH * 0.9,
                          }}>
                          <View style={styles.userBox}>
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
                                style={{
                                  fontSize: fontPixel(18),
                                  color: 'black',
                                }}>
                                {item?.fullname ? item.fullname : ''}
                              </Text>
                            </View>
                          </View>
                          {userInfo.user.following.indexOf(item._id) > -1 && (
                            <SimpleLineIcons
                              color={'#72a045'}
                              name="user-following"
                              size={fontPixel(28)}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              );
            }}
          />
        </>
      )}
      {selectUserModalVisibleStatus && (
        <View style={styles.modalStyle}>
          <View style={styles.pencilContainer}>
            <TouchableOpacity
              onPress={() => {
                setSelectUserModalVisibleStatus(false);
              }}>
              <MaterialCommunityIcons
                color={'#72a045'}
                name="close"
                size={fontPixel(28)}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.selectedUserAvatar}
              source={
                selectedUser?.avatar
                  ? {
                      uri: imageURL + selectedUser.avatar,
                    }
                  : require('../../../assets/images/free_user.png')
              }
            />
            <Text
              allowFontScaling={false}
              style={{fontSize: fontPixel(18), color: 'black'}}>
              {selectedUser?.fullname ? selectedUser.fullname : ''}
            </Text>
          </View>
          <View style={{width: '100%', alignItems: 'center'}}>
            {userInfo.user.following.indexOf(selectedUser._id) < 0 ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => followRequest(selectedUser._id)}>
                <Text allowFontScaling={false} style={styles.buttonText}>
                  Follow User
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={1}
                disabled={true}
                style={[styles.button, {backgroundColor: '#888'}]}
                onPress={() => followRequest(selectedUser._id)}>
                <Text allowFontScaling={false} style={styles.buttonText}>
                  Followed
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      {friendsVisibleStatus && (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingBottom: heightPixel(15),
            }}>
            <View style={styles.refreshContainer}>
              <TouchableOpacity
                onPress={() => {
                  getFriendList();
                }}>
                <Feather
                  color={'#72a045'}
                  name="refresh-cw"
                  size={fontPixel(28)}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.pencilContainer}>
              <TouchableOpacity
                onPress={() => {
                  setProfileVisibleStatus(true);
                  setFriendsVisibleStatus(false);
                }}>
                <MaterialCommunityIcons
                  color={'#72a045'}
                  name="close"
                  size={fontPixel(28)}
                />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={formatRow(friendList, numColumns)}
            keyExtractor={item => {
              return item._id;
            }}
            renderItem={renderItem}
            numColumns={numColumns}
          />
        </>
      )}
      {cookBookVisibleStatus && (
        <>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingBottom: heightPixel(15),
            }}>
            <View style={styles.refreshContainer}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => {}}>
                  <Feather
                    color={'#72a045'}
                    name="refresh-cw"
                    size={fontPixel(28)}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{paddingHorizontal: heightPixel(15)}}
                  onPress={() => {}}>
                  <MaterialIcons
                    color={'#72a045'}
                    name="add-box"
                    size={fontPixel(28)}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.pencilContainer}>
              <TouchableOpacity
                onPress={() => {
                  setProfileVisibleStatus(true);
                  setCookBookVisibleStatus(false);
                }}>
                <MaterialCommunityIcons
                  color={'#72a045'}
                  name="close"
                  size={fontPixel(28)}
                />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  form: {
    width: '85%',
  },
  label: {
    paddingBottom: heightPixel(2),
    fontSize: fontPixel(16),
    fontFamily: 'LEMONMILK-Medium',
  },
  profileDataStyle: {
    fontSize: fontPixel(18),
  },
  button: {
    backgroundColor: '#063225',
    borderRadius: heightPixel(5),
    paddingVertical: heightPixel(8),
    paddingHorizontal: heightPixel(20),
    marginBottom: heightPixel(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: fontPixel(20),
    fontFamily: 'LEMONMILK-Medium',
  },
  pencilContainer: {
    paddingTop: heightPixel(10),
    paddingRight: heightPixel(20),
    alignSelf: 'flex-end',
  },
  refreshContainer: {
    paddingTop: heightPixel(10),
    paddingLeft: heightPixel(20),
  },
  avatarContainer: {
    paddingTop: heightPixel(5),
    paddingBottom: heightPixel(20),
    alignItems: 'center',
  },
  avatar: {
    width: heightPixel(100),
    height: heightPixel(100),
    borderRadius: heightPixel(50),
  },
  userAvatar: {
    width: heightPixel(60),
    height: heightPixel(60),
    borderRadius: heightPixel(30),
  },
  selectedUserAvatar: {
    width: heightPixel(180),
    height: heightPixel(180),
    borderRadius: heightPixel(90),
  },
  box: {
    padding: heightPixel(6),
    marginVertical: heightPixel(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: heightPixel(10),
  },
  userBox: {
    padding: heightPixel(6),
    marginVertical: heightPixel(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  userBoxContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: heightPixel(10),
  },
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    top: heightPixel(0),
    width: '100%',
  },
  renderItemStyle: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPixel(3),
  },
});
