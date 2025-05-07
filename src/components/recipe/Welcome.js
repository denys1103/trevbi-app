import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {fontPixel, heightPixel, widthPixel} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const WelcomeScreen = ({navigation}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <ImageBackground
          source={require('../../../assets/images/vegetables.jpg')}
          resizeMode="cover"
          style={styles.vegetablesStyle}>
          <View style={styles.overlay}>
            <Image
              style={styles.logoStyle}
              source={require('../../../assets/images/TREVBI_Logo.jpg')}
            />
          </View>
        </ImageBackground>
        <ImageBackground
          source={require('../../../assets/images/girl.jpg')}
          resizeMode="cover"
          style={styles.wrapper}>
          <View style={styles.descriptionView}>
            <Text
              allowFontScaling={false}
              style={[styles.titleStyle, {fontSize: fontPixel(32)}]}>
              {`Dinner just\ngot smarter!`}
            </Text>
          </View>
          <View style={[styles.descriptionView, {paddingTop: heightPixel(50)}]}>
            <Text allowFontScaling={false} style={styles.titleStyle}>
              Scan your fridge or
            </Text>
            <Text allowFontScaling={false} style={styles.titleStyle}>
              Pantry - instantly
            </Text>
            <Text allowFontScaling={false} style={styles.titleStyle}>
              Get AI recipe.
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.descriptionStyle,
                {
                  paddingTop: heightPixel(20),
                },
              ]}>
              {`Place ingredients on counter\nTo capture for Ai recipes`}
            </Text>
          </View>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={async () => {
                navigation.navigate('Diets');
              }}>
              <Text allowFontScaling={false} style={styles.text_button}>
                Create
              </Text>
              <Text allowFontScaling={false} style={styles.text_button}>
                AI RECIPES
              </Text>
            </TouchableOpacity>
            {/* <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
                tintColor={'white'}
                tintColors={'white'}
                style={
                  Platform.OS === 'ios'
                    ? styles.checkbox
                    : styles.checkboxAndroid
                }
                boxType={'square'}
              />
              <Text
                allowFontScaling={false}
                style={[
                  styles.label,
                  {
                    fontFamily: 'LEMONMILK-Light',
                  },
                ]}>
                DON'T SHOW THIS SCREEN AGAIN
              </Text>
            </View> */}
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
    color: 'white',
    padding: heightPixel(8),
    fontFamily: 'LEMONMILK-Medium',
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
    fontSize: fontPixel(16),
    color: 'white',
    fontFamily: 'LEMONMILK-Medium',
  },
  button: {
    backgroundColor: '#063225',
    borderRadius: heightPixel(16),
    paddingVertical: heightPixel(5),
    paddingHorizontal: widthPixel(25),
    marginBottom: heightPixel(10),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: heightPixel(0),
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxAndroid: {
    alignSelf: 'center',
    transform: [{scale: 1.5}],
    borderColor: 'white',
  },
  label: {
    fontSize: fontPixel(18),
    color: 'white',
    alignSelf: 'center',
    paddingLeft: widthPixel(5),
  },
  beeContainer: {
    position: 'absolute',
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: fontPixel(26),
    color: 'white',
    padding: heightPixel(3),
    fontFamily: 'LEMONMILK-Regular',
  },
});

export default WelcomeScreen;
