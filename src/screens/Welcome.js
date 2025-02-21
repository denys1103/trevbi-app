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
            <Text allowFontScaling={false}
                style={[
                styles.titleStyle,
                {
                    fontFamily: 'LEMONMILK-Bold',
                    paddingTop: heightPixel(10)
                },
                ]}>
                Discover a smarter 
            </Text>
            <Text allowFontScaling={false}
                style={[
                styles.titleStyle,
                {
                    fontFamily: 'LEMONMILK-Bold',
                },
                ]}>
                way to shop!
            </Text>
            <Text allowFontScaling={false}
              style={[
                styles.descriptionStyle,
                {
                  fontFamily: 'LEMONMILK-Regular',
                  fontSize: fontPixel(28),
                  paddingTop: heightPixel(30)
                },
              ]}>
              Scan ingredients
            </Text>
            <View style={{alignItems: 'flex-start', width: '80%'}}>
              <Text allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                  },
                ]}>
                &#8226; instant insights
              </Text>
              <Text allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                  },
                ]}>
                &#8226; healthier choices
              </Text>
              <Text allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                  },
                ]}>
                &#8226; quick and easy! 
              </Text>
            </View>
            
          </View>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={async () => {
                navigation.navigate('SplashSecond');
              }}>
              <Text allowFontScaling={false} style={[
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
              <Text allowFontScaling={false} style={[
                  styles.label,
                  {
                    fontFamily: 'LEMONMILK-Light',
                  },
                ]}>DON'T SHOW THIS SCREEN AGAIN</Text>
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
    fontSize: fontPixel(26),
    color: 'black',
    padding: heightPixel(8),
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
  titleStyle: {
    textAlign: 'center',
    fontSize: fontPixel(26),
    color: 'black',
    padding: heightPixel(5),
  },
});

export default WelcomeScreen;
