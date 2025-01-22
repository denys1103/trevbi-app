import React, { useState, useEffect, useContext } from 'react';
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
import { GlobalContext } from '../context';
import Spinner from 'react-native-loading-spinner-overlay';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Svg, { Image as SvgImage } from 'react-native-svg';
import {
  fontPixel,
  heightPixel,
  widthPixel,
} from '../config';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const WelcomeSecondScreen = ({ navigation }) => {
  const {
    isLoading,
  } = useContext(GlobalContext);

  const x = useSharedValue(SCREEN_WIDTH - heightPixel(100));
  const y = useSharedValue(heightPixel(15));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
    ],
  }));
 
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }} >
        <Spinner visible={isLoading} />
        <ImageBackground
          source={require('../../assets/images/background_screen1.jpg')}
          resizeMode="cover"
          imageStyle={{opacity: 0.3}}
          style={styles.backgroundImageStyle}>
          <View style={styles.wrapper}>
            <View style={styles.descriptionView}>
              <Text
                  style={[
                  styles.titleStyle,
                  {
                      fontFamily: 'LEMONMILK-Bold',
                  },
                  ]}>
                  INSTANT FOOD INSIGHTS
              </Text>
              <Text
                  style={[
                  styles.descriptionStyle,
                  {
                      fontFamily: 'LEMONMILK-Regular',
                      paddingTop: heightPixel(30)
                  },
                  ]}>
                  SAY GOODBYE TO BARCODE
              </Text>
              <Text
                  style={[
                  styles.descriptionStyle,
                  {
                      fontFamily: 'LEMONMILK-Regular',
                  },
                  ]}>
                  HEADACHES! WITH TREVBI,
              </Text>
              <Text
                  style={[
                  styles.descriptionStyle,
                  {
                      fontFamily: 'LEMONMILK-Regular',
                  },
                  ]}>
                  YOUR FOOD'S MYSTERIES
              </Text>
              <Text
                  style={[
                  styles.descriptionStyle,
                  {
                      fontFamily: 'LEMONMILK-Regular',
                  },
                  ]}>
                  ARE JUST A TAP AWAY.
              </Text>
              <Text
                  style={[
                  styles.descriptionStyle,
                  {
                      fontFamily: 'LEMONMILK-Regular',
                      paddingTop: heightPixel(30)
                  },
                  ]}>
                  WANT TO KNOW IF THAT
              </Text>
              <Text
                  style={[
                  styles.descriptionStyle,
                  {
                      fontFamily: 'LEMONMILK-Regular',
                  },
                  ]}>
                  SNACK IS A FRIEND OR A FOE?
              </Text>
              <Text
                  style={[
                  styles.descriptionStyle,
                  {
                      fontFamily: 'LEMONMILK-Regular',
                  },
                  ]}>
                  TREVBI'S GOT YOU COVERED
              </Text>
              <Text
                  style={[
                  styles.descriptionStyle,
                  {
                      fontFamily: 'LEMONMILK-Regular',
                  },
                  ]}>
                  WITH INSTANT, NO-FUSS
              </Text>
              <Text
                  style={[
                  styles.descriptionStyle,
                  {
                      fontFamily: 'LEMONMILK-Regular',
                  },
                  ]}>
                  FOOD INSIGHTS THAT MAKE
              </Text>
              <Text
                  style={[
                  styles.descriptionStyle,
                  {
                      fontFamily: 'LEMONMILK-Regular',
                  },
                  ]}>
                  EATING SMARTER FUN AND EASY.
              </Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={async () => {
                  navigation.navigate('SplashThird');
                }}>
                  <Text style={[
                    styles.text_button,
                    {
                      fontFamily: 'LEMONMILK-Bold',
                    },
                  ]}>LET'S DO THIS!</Text>
              </TouchableOpacity>
              <Image
                style={styles.logoStyle}
                source={require('../../assets/images/TREVBI_Transparent_Logo.png')}
              />
            </View>
          </View>
        </ImageBackground>
        <Animated.View style={[styles.beeContainer, animatedStyle]}>
          <Svg width={heightPixel(90)} height={heightPixel(100)}>
            <SvgImage
              href={require('../../assets/images/buzz.png')}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
            />
          </Svg>
        </Animated.View>
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
    marginTop: heightPixel(10)
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingTop: heightPixel(20)
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: fontPixel(22),
    color: 'black',
    padding: heightPixel(5),
    paddingTop: heightPixel(40),
  },
  descriptionView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  descriptionStyle: {
    textAlign: 'center',
    fontSize: fontPixel(20),
    color: 'black',
    padding: heightPixel(8),
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
