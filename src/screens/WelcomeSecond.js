import React from 'react';
import {
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {fontPixel, heightPixel, widthPixel} from '../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const WelcomeSecondScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <ImageBackground
          source={require('../../assets/images/background_screen1.jpg')}
          resizeMode="cover"
          imageStyle={{opacity: 0.2}}
          style={styles.backgroundImageStyle}>
          <View style={styles.wrapper}>
            <View style={styles.titleView}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.titleStyle,
                  {
                    fontFamily: 'LEMONMILK-Bold',
                  },
                ]}>
                Is Your Food
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.titleStyle,
                  {
                    fontFamily: 'LEMONMILK-Bold',
                  },
                ]}>
                Helping or Hurting?
              </Text>
            </View>
            <View style={styles.descriptionView}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                  },
                ]}>
                Get instant insights
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                  },
                ]}>
                and find out if your
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                  },
                ]}>
                food is a win or a sin
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                  },
                ]}>
                with TREVBI!
              </Text>
            </View>
            <View>
              <Text
                allowFontScaling={false}
                style={[
                  styles.titleStyle,
                  {
                    fontFamily: 'LEMONMILK-Bold',
                    paddingTop: heightPixel(10),
                  },
                ]}>
                Find Out Now
              </Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={async () => {
                  navigation.navigate('SplashThird');
                }}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.text_button,
                    {
                      fontFamily: 'LEMONMILK-Bold',
                    },
                  ]}>
                  LET'S DO THIS!
                </Text>
              </TouchableOpacity>
              <Image
                style={styles.logoStyle}
                source={require('../../assets/images/TREVBI_Transparent_Logo.png')}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  backgroundImageStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoStyle: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.28 * 0.6,
    resizeMode: 'cover',
    marginTop: heightPixel(10),
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingTop: heightPixel(90),
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: fontPixel(26),
    color: 'black',
    padding: heightPixel(5),
  },
  titleView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  descriptionView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: heightPixel(20),
  },
  descriptionStyle: {
    textAlign: 'center',
    fontSize: fontPixel(26),
    color: 'black',
    padding: heightPixel(10),
  },
  text_button: {
    fontSize: fontPixel(20),
    color: 'white',
  },
  button: {
    backgroundColor: '#063225',
    borderRadius: heightPixel(20),
    paddingVertical: heightPixel(15),
    paddingHorizontal: widthPixel(30),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  beeContainer: {
    position: 'absolute',
  },
});

export default WelcomeSecondScreen;
