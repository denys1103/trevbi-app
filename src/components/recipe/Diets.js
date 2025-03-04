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
  SafeAreaView,
  Platform,
} from 'react-native';
import { GlobalContext } from '../../context';
import Spinner from 'react-native-loading-spinner-overlay';
import CheckBox from '@react-native-community/checkbox';
import {
  fontPixel,
  heightPixel,
  widthPixel,
} from '../../config';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DietsScreen = ({ navigation }) => {
  const {
    isLoading,
  } = useContext(GlobalContext);
  const [toggleCheckBox1, setToggleCheckBox1] = useState(false)
  const [toggleCheckBox2, setToggleCheckBox2] = useState(false)
  const [toggleCheckBox3, setToggleCheckBox3] = useState(false)
  const [toggleCheckBox4, setToggleCheckBox4] = useState(false)
  const [toggleCheckBox5, setToggleCheckBox5] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }} >
        <Spinner visible={isLoading} />
        <View
          style={styles.backgroundStyle}>
          <View style={styles.wrapper}>
            <View style={styles.titleView}>
              <Text allowFontScaling={false}
                  style={[
                  styles.titleStyle,
                  {
                      fontFamily: 'LEMONMILK-Bold',
                  },
                  ]}>
                  Tap &#9662; for diet details. ☑ Select multiple diets for TREVBI AI to create custom recipes!
              </Text>
            </View>
            <View style={styles.descriptionView}>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox1}
                  onValueChange={(newValue) => setToggleCheckBox1(newValue)}
                  style={Platform.OS === 'ios' ? styles.checkbox : styles.checkboxAndroid}
                  boxType={'square'}
                />
                <Text allowFontScaling={false} style={[
                    styles.label,
                    {
                      fontFamily: 'LEMONMILK-Regular',
                    },
                  ]}>Keto diet</Text>
                <Text allowFontScaling={false} style={[
                    styles.label,
                    {
                      fontFamily: 'LEMONMILK-Regular',
                      paddingBottom:heightPixel(5)
                    },
                  ]}>&#9013;</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox2}
                  onValueChange={(newValue) => setToggleCheckBox2(newValue)}
                  style={Platform.OS === 'ios' ? styles.checkbox : styles.checkboxAndroid}
                  boxType={'square'}
                />
                <Text allowFontScaling={false} style={[
                    styles.label,
                    {
                      fontFamily: 'LEMONMILK-Regular',
                    },
                  ]}>Mediterranean diet</Text>
                <Text allowFontScaling={false} style={[
                    styles.label,
                    {
                      fontFamily: 'LEMONMILK-Regular',
                      paddingBottom:heightPixel(5)
                    },
                  ]}>&#9013;</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox3}
                  onValueChange={(newValue) => setToggleCheckBox3(newValue)}
                  style={Platform.OS === 'ios' ? styles.checkbox : styles.checkboxAndroid}
                  boxType={'square'}
                />
                <Text allowFontScaling={false} style={[
                    styles.label,
                    {
                      fontFamily: 'LEMONMILK-Regular',
                    },
                  ]}>Plant-based / vegan</Text>
                <Text allowFontScaling={false} style={[
                    styles.label,
                    {
                      fontFamily: 'LEMONMILK-Regular',
                      paddingBottom:heightPixel(5)
                    },
                  ]}>&#9013;</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox4}
                  onValueChange={(newValue) => setToggleCheckBox4(newValue)}
                  style={Platform.OS === 'ios' ? styles.checkbox : styles.checkboxAndroid}
                  boxType={'square'}
                />
                <Text allowFontScaling={false} style={[
                    styles.label,
                    {
                      fontFamily: 'LEMONMILK-Regular',
                    },
                  ]}>Paleo diet</Text>
                <Text allowFontScaling={false} style={[
                    styles.label,
                    {
                      fontFamily: 'LEMONMILK-Regular',
                      paddingBottom:heightPixel(5)
                    },
                  ]}>&#9013;</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox5}
                  onValueChange={(newValue) => setToggleCheckBox5(newValue)}
                  style={Platform.OS === 'ios' ? styles.checkbox : styles.checkboxAndroid}
                  boxType={'square'}
                />
                <Text allowFontScaling={false} style={[
                    styles.label,
                    {
                      fontFamily: 'LEMONMILK-Regular',
                    },
                  ]}>Carnivore diet</Text>
                <Text allowFontScaling={false} style={[
                    styles.label,
                    {
                      fontFamily: 'LEMONMILK-Regular',
                      paddingBottom:heightPixel(5)
                    },
                  ]}>&#9013;</Text>
              </View>
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={async () => {
                  navigation.navigate('RecipeScan');
                }}>
                  <Text allowFontScaling={false} style={[
                    styles.text_button,
                    {
                      fontFamily: 'LEMONMILK-Medium',
                    },
                  ]}>Find my recipe!</Text>
              </TouchableOpacity>
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
  backgroundStyle: {
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
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: fontPixel(18),
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
    alignItems: 'flex-start',
    width: '100%',
    paddingVertical: heightPixel(20),
    paddingHorizontal: heightPixel(10),
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
  checkboxContainer: {
    flexDirection: 'row',
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxAndroid: {
    alignSelf: 'center',
    // transform: [{ scale: 1 }],
  },
  label: {
    fontSize: fontPixel(18),
    color: 'black',
    alignSelf: 'center',
    paddingLeft: widthPixel(5),
  },
});

export default DietsScreen;
