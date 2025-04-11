import React, {useContext} from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {GlobalContext} from '../../context';
import Spinner from 'react-native-loading-spinner-overlay';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {fontPixel, heightPixel} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const SocialWelcomeScreen = ({navigation}) => {
  const {isLoading} = useContext(GlobalContext);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Spinner visible={isLoading} />
        <Text
          allowFontScaling={false}
          style={[
            styles.titleStyle,
            {
              fontFamily: 'LEMONMILK-Bold',
              paddingTop: heightPixel(10),
            },
          ]}>
          Welcome To
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          style={[
            styles.goToBackBtnStyle,
            {width: heightPixel(80), marginBottom: heightPixel(5)},
          ]}
          onPress={() => {
            navigation.replace('MenuList');
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
        <View style={styles.overlay}>
          <Image
            style={styles.logoStyle}
            source={require('../../../assets/images/TREVBI_SOCIAL_LOGO.png')}
          />
          <Text
            allowFontScaling={false}
            style={[
              styles.titleStyle,
              {
                fontFamily: 'LEMONMILK-Bold',
                paddingVertical: heightPixel(15),
                fontSize: fontPixel(20),
              },
            ]}>
            Free for trevbi users
          </Text>
        </View>
        <View style={styles.wrapper}>
          <View style={styles.descriptionView}>
            <Text
              allowFontScaling={false}
              style={[
                styles.titleStyle,
                {
                  paddingVertical: heightPixel(10),
                  fontFamily: 'LEMONMILK-Medium',
                  fontSize: fontPixel(28),
                },
              ]}>
              {`See what's cooking\nand coming soon`}
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Medium',
                  paddingVertical: heightPixel(15),
                },
              ]}>
              {`Connect, create, and clean up\nwhat's on your plate, one app,\nreal people, kitchen community,`}
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Medium',
                  paddingVertical: heightPixel(20),
                },
              ]}>
              👇 Here's what's on the menu:
            </Text>
          </View>
          <View style={{alignItems: 'flex-start', width: '90%'}}>
            <Text
              allowFontScaling={false}
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                  paddingTop: heightPixel(10),
                },
              ]}>
              &#8226; Post your ai-recipe & dishes
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                  paddingTop: heightPixel(10),
                },
              ]}>
              &#8226; Create personal ai cookbook
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                  paddingTop: heightPixel(10),
                },
              ]}>
              &#8226; Talk food and wellness
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                  paddingTop: heightPixel(10),
                },
              ]}>
              &#8226; Call out sketchy ingredients
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                  paddingTop: heightPixel(10),
                },
              ]}>
              &#8226; Like, comment, connect
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                    paddingTop: heightPixel(10),
                  },
                ]}>
                &#8226; Post to your socials
              </Text>
              <MaterialCommunityIcons
                color={'black'}
                style={{alignSelf: 'center'}}
                name="instagram"
                size={fontPixel(20)}
              />
              <MaterialIcons
                color={'black'}
                style={{alignSelf: 'center', paddingHorizontal: heightPixel(3)}}
                name="tiktok"
                size={fontPixel(20)}
              />
              <Image
                style={{
                  alignSelf: 'center',
                  width: heightPixel(18),
                  height: heightPixel(18),
                }}
                source={require('../../../assets/images/x-twitter.png')}
              />
              <FontAwesome
                color={'black'}
                style={{alignSelf: 'center', paddingLeft: heightPixel(3)}}
                name="facebook"
                size={fontPixel(20)}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    paddingTop: heightPixel(10),
  },
  logoStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.2,
    resizeMode: 'cover',
  },
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingTop: heightPixel(10),
  },
  descriptionView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  descriptionStyle: {
    textAlign: 'center',
    fontSize: fontPixel(18),
    color: 'black',
    padding: heightPixel(8),
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: fontPixel(24),
    color: 'black',
    padding: heightPixel(3),
  },
  goToBackBtnStyle: {
    flexDirection: 'row',
    backgroundColor: '#063225',
    borderRadius: heightPixel(15),
    paddingVertical: heightPixel(5),
    paddingLeft: heightPixel(5),
    marginLeft: heightPixel(10),
    paddingRight: heightPixel(10),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: heightPixel(10),
  },
});

export default SocialWelcomeScreen;
