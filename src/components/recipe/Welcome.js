import React, {useState, useContext} from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
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
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <Spinner visible={isLoading} />
        <View style={styles.overlay}>
          <Image
            style={styles.logoStyle}
            source={require('../../../assets/images/TREVBI_Logo.jpg')}
          />
          <Image
            style={styles.recipeScreenStyle}
            source={require('../../../assets/images/AI_RECIPE_SCREENS.jpg')}
          />
        </View>
        <View style={styles.wrapper}>
          <View style={styles.descriptionView}>
            <Text
              allowFontScaling={false}
              style={[
                styles.titleStyle,
                {
                  fontFamily: 'LEMONMILK-Bold',
                  paddingTop: heightPixel(10),
                },
              ]}>
              No recipe? no problem!
            </Text>
          </View>
          <View style={styles.descriptionView}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'LEMONMILK-Regular',
                fontSize: fontPixel(18),
                textAlign: 'center',
                color: 'black',
              }}>
              Snap a pic of your fridge or
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'LEMONMILK-Regular',
                fontSize: fontPixel(18),
                textAlign: 'center',
                color: 'black',
                paddingTop: heightPixel(10),
              }}>
              pantry—TREVBI AI will whip up the
            </Text>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'LEMONMILK-Regular',
                fontSize: fontPixel(18),
                textAlign: 'center',
                color: 'black',
                paddingTop: heightPixel(10),
              }}>
              perfect recipe for you!
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate('Diets');
              }}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.text_button,
                  {
                    fontFamily: 'LEMONMILK-Medium',
                  },
                ]}>
                Let's cook with ai
              </Text>
            </TouchableOpacity>
            <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
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
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  recipeScreenStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.77,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: heightPixel(50),
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
    fontSize: fontPixel(24),
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
    marginVertical: heightPixel(10),
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxAndroid: {
    alignSelf: 'center',
    transform: [{scale: 1.5}],
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
    fontSize: fontPixel(24),
    color: 'black',
    padding: heightPixel(5),
  },
});

export default WelcomeScreen;
