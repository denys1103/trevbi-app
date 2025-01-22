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
  Platform,
} from 'react-native';
import { GlobalContext } from '../context';
import Spinner from 'react-native-loading-spinner-overlay';
import CheckBox from '@react-native-community/checkbox';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Image as SvgImage } from 'react-native-svg';
import {
  fontPixel,
  heightPixel,
  widthPixel,
} from '../config';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const {
    isLoading,
  } = useContext(GlobalContext);

  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [buzzStatus, setBuzzStatus] = useState(true)

  const x = useSharedValue(SCREEN_WIDTH - heightPixel(100));
  const y = useSharedValue(heightPixel(50));

  useEffect(() => {
    if(buzzStatus) {
      x.value = withRepeat(
        withSequence(
          withTiming(SCREEN_WIDTH - heightPixel(100), { duration: 1500 }),
          withTiming(heightPixel(50), { duration: 1500 })
        ),
        -1,
        true
      );
  
      y.value = withRepeat(
        withSequence(
          withTiming(SCREEN_HEIGHT / 4, { duration: 1000 }),
          withTiming((3 * SCREEN_HEIGHT) / 4 - heightPixel(200), { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      x.value = withRepeat(
        withSequence(
          withTiming(SCREEN_WIDTH - heightPixel(100), { duration: 1500 }),
        ),
        1,
        false
      );
  
      y.value = withRepeat(
        withSequence(
          withTiming(heightPixel(50), { duration: 1000 }),
        ),
        1,
        false
      );
    }
  }, [buzzStatus]);

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
          source={require('../../assets/images/vegetables.jpg')}
          resizeMode="cover"
          style={styles.vegetablesStyle}>
          <View style={styles.overlay}>
            <Image
              style={styles.logoStyle}
              source={require('../../assets/images/TREVBI_Logo.jpg')}
            />
          </View>
        </ImageBackground>
        <View style={styles.wrapper}>
          <View style={styles.descriptionView}>
            <Text
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                },
              ]}>
              DISCOVER A SMARTER WAY TO
            </Text>
            <Text
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                },
              ]}>
              UNDERSTAND FOOD LABELS WITH
            </Text>
            <Text
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                },
              ]}>
              TREVBI TECHNOLOGY.
            </Text>
            <Text
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                  paddingTop: heightPixel(20)
                },
              ]}>
              SCAN REAL INGREDIENTS, NOT
            </Text>
            <Text
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                },
              ]}>
              {`BARCODES\u2014FOR INSTANT`}
            </Text>
            <Text
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                },
              ]}>
              INSIGHTS, HELPING YOU CHOOSE
            </Text>
            <Text
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                },
              ]}>
              HEALTHIER OPTIONS WITH EASE!
            </Text>
            <TouchableOpacity
              style={styles.buzzButton}
              activeOpacity={0.7}
              onPress={() => {
                setBuzzStatus(!buzzStatus)
              }}>
              <Text style={[
                styles.buzz_text_button,
                {
                  fontFamily: 'LEMONMILK-Regular',
                },
              ]}>{buzzStatus ? 'BUZZ OFF' : 'BUZZ ON'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={async () => {
                navigation.navigate('SplashSecond');
              }}>
              <Text style={[
                styles.text_button,
                {
                  fontFamily: 'LEMONMILK-Bold',
                },
              ]}>GIVE IT A WHIRL</Text>
            </TouchableOpacity>
            <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                style={Platform.OS === 'ios' ? styles.checkbox : styles.checkboxAndroid}
                boxType={'square'}
              />
              <Text style={[
                  styles.label,
                  {
                    fontFamily: 'LEMONMILK-Light',
                  },
                ]}>DON'T SHOW THIS SCREEN AGAIN</Text>
            </View>
          </View>
          </View>
      </View>
      <Animated.View style={[styles.beeContainer, animatedStyle]}>
        <Svg width={heightPixel(100)} height={heightPixel(90)}>
          <SvgImage
            href={require('../../assets/images/buzz1.png')}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  vegetablesStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.7,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.28,
    resizeMode: 'cover',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingTop: heightPixel(20)
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
    padding: heightPixel(4),
  },
  buzz_text_button: {
    fontSize: fontPixel(18),
    color: 'white',
  },
  buzzButton: {
    marginTop: heightPixel(20),
    backgroundColor: '#ebb113',
    borderRadius: heightPixel(20),
    paddingVertical: heightPixel(15),
    paddingHorizontal: widthPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  text_button: {
    fontSize: fontPixel(20),
    color: 'white',
  },
  button: {
    marginTop: heightPixel(10),
    backgroundColor: '#063225',
    borderRadius: heightPixel(20),
    paddingVertical: heightPixel(15),
    paddingHorizontal: widthPixel(20),
    marginBottom: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: heightPixel(18),
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxAndroid: {
    alignSelf: 'center',
    transform: [{ scale: 1.5 }],
  },
  label: {
    fontSize: fontPixel(18),
    color: 'black',
    alignSelf: 'center',
    paddingLeft: widthPixel(5),
  },
  beeContainer: {
    position: 'absolute',
  },
});

export default WelcomeScreen;
