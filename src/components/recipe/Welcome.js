import React, {useState, useContext} from 'react';
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
import {GlobalContext} from '../../context';
import Spinner from 'react-native-loading-spinner-overlay';
import CheckBox from '@react-native-community/checkbox';
import {fontPixel, heightPixel, widthPixel} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const WelcomeScreen = ({navigation}) => {
  const {isLoading} = useContext(GlobalContext);

  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Spinner visible={isLoading} />
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
            <Text allowFontScaling={false} style={styles.titleStyle}>
              Scan your fridge or
            </Text>
            <Text allowFontScaling={false} style={styles.titleStyle}>
              Pantry - instantly
            </Text>
            <Text allowFontScaling={false} style={styles.titleStyle}>
              Get AI recipe.
            </Text>
          </View>
          <View style={{paddingVertical: heightPixel(20)}}>
            <Text
              allowFontScaling={false}
              style={[
                styles.descriptionStyle,
                {
                  paddingTop: heightPixel(10),
                },
              ]}>
              {`You can also lay your\ningredients on your counter`}
            </Text>
          </View>
          <View style={styles.descriptionView}>
            <Text
              allowFontScaling={false}
              style={[styles.titleStyle, {fontSize: fontPixel(28)}]}>
              {`Dinner just\ngot smarter!`}
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
    color: 'white',
    padding: heightPixel(8),
    fontFamily: 'LEMONMILK-Regular',
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
    marginTop: heightPixel(10),
    backgroundColor: '#063225',
    borderRadius: heightPixel(24),
    paddingVertical: heightPixel(5),
    paddingHorizontal: widthPixel(20),
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
    fontSize: fontPixel(24),
    color: 'white',
    padding: heightPixel(3),
    fontFamily: 'LEMONMILK-Medium',
  },
});

export default WelcomeScreen;
