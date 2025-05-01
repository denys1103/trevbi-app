import React, {useContext, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {fontPixel, heightPixel, imageURL} from '../../config';
import {GlobalContext} from '../../context';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const SocialProfileScreen = ({navigation}) => {
  const {
    userInfo,
    getUserList,
    userList,
    followRequest,
    friendList,
    getFriendList,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (!userInfo.token) {
      navigation.replace('Login');
    }
  }, [navigation, userInfo.token]);
  const profile = userInfo.user;

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
            <Text allowFontScaling={false} style={styles.fullnameStyle}>
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
                // navigation.replace('MenuList');
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
                // navigation.replace('MenuList');
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
                // navigation.replace('MenuList');
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
        <View style={styles.wrapper}></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
    paddingHorizontal: heightPixel(15),
  },
  overlay: {
    paddingTop: heightPixel(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingTop: heightPixel(10),
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
});

export default SocialProfileScreen;
