import React, {useContext} from 'react';
import {
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {GlobalContext} from '../context';
import Spinner from 'react-native-loading-spinner-overlay';
import {fontPixel, heightPixel, widthPixel} from '../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const WelcomeSecondScreen = ({navigation}) => {
  const {isLoading} = useContext(GlobalContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <Spinner visible={isLoading} />
        <ImageBackground
          source={require('../../assets/images/background_screen2.jpg')}
          resizeMode="cover"
          imageStyle={{opacity: 0.2}}
          style={styles.backgroundImageStyle}>
          <View style={styles.wrapper}>
            <View style={styles.descriptionView}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.titleStyle,
                  {
                    fontFamily: 'LEMONMILK-Bold',
                  },
                ]}>
                How It Works
              </Text>
            </View>
            <View style={styles.descriptionTxtView}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                    paddingTop: heightPixel(10),
                  },
                ]}>
                1. SCAN INGREDIENTS
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                    paddingLeft: heightPixel(36),
                  },
                ]}>
                You might be shocked
              </Text>
            </View>
            <View style={styles.descriptionTxtView}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                  },
                ]}>
                2. scan barcode to see
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                    paddingLeft: heightPixel(36),
                  },
                ]}>
                better brand choices
              </Text>
            </View>
            <View style={styles.descriptionTxtView}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                  },
                ]}>
                3. easily build healthy
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    fontFamily: 'LEMONMILK-Regular',
                    paddingLeft: heightPixel(36),
                  },
                ]}>
                recipes with trevbi ai
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
                See Beyond the Label
              </Text>
            </View>
            <View
              style={{alignItems: 'center', paddingBottom: heightPixel(60)}}>
              <View style={styles.scanGroupStyle}>
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={() => navigation.navigate('Dashboard')}>
                  <Text allowFontScaling={false} style={styles.scanButtonText}>
                    Scan
                  </Text>
                  <Text allowFontScaling={false} style={styles.scanButtonText}>
                    Ingredients
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.scanButton}
                  onPress={() =>
                    navigation.replace('Dashboard', {screen: 'AIRecipes'})
                  }>
                  <Text allowFontScaling={false} style={styles.scanButtonText}>
                    Trevbi
                  </Text>
                  <Text allowFontScaling={false} style={styles.scanButtonText}>
                    AI recipes
                  </Text>
                </TouchableOpacity>
              </View>
              <Image
                style={styles.logoStyle}
                source={require('../../assets/images/TREVBI_Transparent_Logo.png')}
              />
            </View>
          </View>
        </ImageBackground>
        <View style={styles.tabBarContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.tabItemStyle}
            onPress={() => navigation.replace('Dashboard', {screen: 'Scan'})}>
            <Image
              style={{
                width: widthPixel(40),
                height: widthPixel(40),
                resizeMode: 'contain',
              }}
              source={require('../../assets/images/scan.png')}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontSize: fontPixel(11),
                color: '#000000',
              }}>
              SCAN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.tabItemStyle}
            onPress={() =>
              navigation.replace('Dashboard', {screen: 'AIRecipes'})
            }>
            <Image
              style={{
                width: widthPixel(40),
                height: widthPixel(40),
                resizeMode: 'contain',
              }}
              source={require('../../assets/images/ai_recipes.png')}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontSize: fontPixel(11),
                color: '#000000',
              }}>
              AI RECIPES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.tabItemStyle}
            onPress={() =>
              navigation.replace('Dashboard', {screen: 'History'})
            }>
            <Image
              style={{
                width: widthPixel(40),
                height: widthPixel(40),
                resizeMode: 'contain',
              }}
              source={require('../../assets/images/history.png')}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontSize: fontPixel(11),
                color: '#000000',
              }}>
              HISTORY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.tabItemStyle}
            onPress={() => navigation.replace('Dashboard', {screen: 'Menu'})}>
            <Image
              style={{
                width: widthPixel(40),
                height: widthPixel(40),
                resizeMode: 'contain',
              }}
              source={require('../../assets/images/menu_active.png')}
            />
            <Text
              allowFontScaling={false}
              style={{
                fontSize: fontPixel(11),
                color: '#61a148',
              }}>
              MENU
            </Text>
          </TouchableOpacity>
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
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: fontPixel(26),
    color: 'black',
    padding: heightPixel(5),
  },
  descriptionView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  descriptionTxtView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '96%',
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
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  beeContainer: {
    position: 'absolute',
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: heightPixel(0),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#efefef',
    paddingLeft: widthPixel(10),
    paddingRight: widthPixel(10),
    paddingBottom: heightPixel(12),
    paddingTop: heightPixel(5),
    height: heightPixel(70),
    borderTopColor: '#bbbbbb',
  },
  tabItemStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#063225',
    paddingVertical: heightPixel(5),
    paddingHorizontal: heightPixel(20),
    borderRadius: heightPixel(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: heightPixel(10),
    marginHorizontal: '3%',
    width: '40%',
  },
  scanButtonText: {
    color: 'white',
    fontSize: fontPixel(16),
    fontFamily: 'LEMONMILK-Medium',
  },
  scanGroupStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default WelcomeSecondScreen;
