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
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {GlobalContext} from '../../context';
import {fontPixel, heightPixel, imageURL} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const ScoutsPage = ({navigation, route}) => {
  const {userInfo, getUserList, userList, followRequest} =
    useContext(GlobalContext);
  const [selectUserModalVisibleStatus, setSelectUserModalVisibleStatus] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const profile = userInfo.user;

  useEffect(() => {
    getUserList();
  }, []);

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
                          width: SCREEN_WIDTH * 0.95,
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
        {selectUserModalVisibleStatus && (
          <View style={styles.modalStyle}>
            <View style={styles.closeContainer}>
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
                style={{fontSize: fontPixel(20), color: 'black'}}>
                {selectedUser?.fullname ? selectedUser.fullname : ''}
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: fontPixel(16),
                  color: 'black',
                  textAlign: 'center',
                  paddingHorizontal: heightPixel(30),
                }}>
                {selectedUser?.bio ? selectedUser.bio : ''}
              </Text>
            </View>
            <View style={{width: '100%', alignItems: 'center'}}>
              {userInfo.user.following.indexOf(selectedUser._id) < 0 ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.button}
                  onPress={() => followRequest(selectedUser._id)}>
                  <Ionicons
                    color={'white'}
                    name="add-circle-sharp"
                    size={fontPixel(28)}
                  />
                  <Text allowFontScaling={false} style={styles.buttonText}>
                    Join Crew
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={1}
                  // disabled={true}
                  style={[styles.button, {backgroundColor: 'red'}]}
                  onPress={() => followRequest(selectedUser._id, 1)}>
                  <Ionicons
                    color={'white'}
                    name="close-circle-sharp"
                    size={fontPixel(28)}
                  />
                  <Text allowFontScaling={false} style={styles.buttonText}>
                    Remove
                  </Text>
                </TouchableOpacity>
              )}
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
    width: '70%',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    top: heightPixel(0),
    width: '100%',
  },
  avatarContainer: {
    paddingTop: heightPixel(5),
    paddingBottom: heightPixel(20),
    alignItems: 'center',
  },
  selectedUserAvatar: {
    width: heightPixel(180),
    height: heightPixel(180),
    borderRadius: heightPixel(90),
  },
  button: {
    flexDirection: 'row',
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
    paddingLeft: heightPixel(5),
  },
});

export default ScoutsPage;
