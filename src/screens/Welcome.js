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
                style={styles.checkbox}
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
    padding: heightPixel(5),
  },
  text_button: {
    fontSize: fontPixel(20),
    color: 'white',
  },
  button: {
    marginTop: heightPixel(20),
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
    // transform: [{ scale: 1.5 }],
  },
  label: {
    fontSize: fontPixel(18),
    color: 'black',
    alignSelf: 'center',
    paddingLeft: widthPixel(5),
  },
});

export default WelcomeScreen;
