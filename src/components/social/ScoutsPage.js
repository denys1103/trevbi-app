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
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {GlobalContext} from '../../context';
import {fontPixel, heightPixel, widthPixel, imageURL} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const ScoutsPage = ({navigation, route}) => {
  const {userInfo, getUserList, userList, showModal} =
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
  refreshContainer: {
    paddingTop: heightPixel(10),
    paddingLeft: heightPixel(20),
  },
  closeContainer: {
    paddingTop: heightPixel(10),
    paddingRight: heightPixel(20),
    alignSelf: 'flex-end',
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
  userAvatar: {
    width: heightPixel(60),
    height: heightPixel(60),
    borderRadius: heightPixel(30),
  },
});

export default ScoutsPage;
