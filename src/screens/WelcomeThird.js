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

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }} >
        <Spinner visible={isLoading} />
        <ImageBackground
          source={require('../../assets/images/background_screen2.jpg')}
          resizeMode="cover"
          imageStyle={{opacity: 0.3}}
          style={styles.backgroundImageStyle}>
          <View style={styles.wrapper}>
            <View style={styles.descriptionView}>
              <Text allowFontScaling={false}
                  style={[
                  styles.titleStyle,
                  {
                      fontFamily: 'LEMONMILK-Bold',
                      paddingTop: heightPixel(50)
                  },
                  ]}>
                  How It Works
              </Text>
              <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: '96%'}}>
                <Text allowFontScaling={false}
                    style={[
                    styles.descriptionStyle,
                    {
                        fontFamily: 'LEMONMILK-Regular',
                        paddingTop: heightPixel(30)
                    },
                    ]}>
                    1. SCAN INGREDIENTS WITH
                </Text>
                <Text allowFontScaling={false}
                    style={[
                    styles.descriptionStyle,
                    {
                        fontFamily: 'LEMONMILK-Regular',
                        paddingLeft: heightPixel(30),
                    },
                    ]}>
                    THE IN-APP CAMERA
                </Text>
                <Text allowFontScaling={false}
                    style={[
                    styles.descriptionStyle,
                    {
                        fontFamily: 'LEMONMILK-Regular',
                        paddingTop: heightPixel(24)
                    },
                    ]}>
                    2. scan barcode to see
                </Text>
                <Text allowFontScaling={false}
                    style={[
                    styles.descriptionStyle,
                    {
                        fontFamily: 'LEMONMILK-Regular',
                        paddingLeft: heightPixel(30),
                    },
                    ]}>
                    better brand choices
                </Text>
                <Text allowFontScaling={false}
                    style={[
                    styles.descriptionStyle,
                    {
                        fontFamily: 'LEMONMILK-Regular',
                        paddingTop: heightPixel(24)
                    },
                    ]}>
                    3. easily build healthy
                </Text>
                <Text allowFontScaling={false}
                    style={[
                    styles.descriptionStyle,
                    {
                        fontFamily: 'LEMONMILK-Regular',
                        paddingLeft: heightPixel(30),
                    },
                    ]}>
                    recipes with trevbi ai
                </Text>
              </View>
              
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text allowFontScaling={false}
                  style={[
                  styles.titleStyle,
                  {
                      fontFamily: 'LEMONMILK-Bold',
                      paddingBottom: heightPixel(16)
                  },
                  ]}>
                  See Beyond the Label
              </Text>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={async () => {
                  navigation.navigate('Dashboard');
                }}>
                  <Text allowFontScaling={false} style={[
                    styles.text_button,
                    {
                      fontFamily: 'LEMONMILK-Bold',
                    },
                  ]}>"LET'S SCAN!"</Text>
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
    marginTop: heightPixel(10)
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingTop: heightPixel(20)
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: fontPixel(26),
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
    fontSize: fontPixel(25),
    color: 'black',
    padding: heightPixel(6),
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
    marginTop: heightPixel(10),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  beeContainer: {
    position: 'absolute',
  },
});

export default WelcomeSecondScreen;
