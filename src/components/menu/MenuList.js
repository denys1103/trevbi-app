import React, {useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Dimensions,
  Linking,
  Image,
} from 'react-native';
import {fontPixel, heightPixel} from '../../config';
import {GlobalContext} from '../../context';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export function MenuList({navigation}) {
  const {logout} = useContext(GlobalContext);

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Image
          style={styles.logoStyle}
          source={require('../../../assets/images/TREVBI_Logo.jpg')}
        />
        <View style={styles.form}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.replace('SplashThird')}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              How It Works
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.replace('Profile')}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.replace('Feedback')}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              Feedback
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.replace('Recipes')}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              Recipes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.replace('History')}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              Scan History
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: heightPixel(20),
            }}>
            <Text allowFontScaling={false} style={styles.text_forgot}>
              Please check out the{' '}
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://www.trevbi.com/blog')}>
              <Text allowFontScaling={false} style={styles.link}>
                TREVBI BLOG
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={logout}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: SCREEN_HEIGHT,
  },
  form: {
    width: '80%',
    paddingVertical: heightPixel(60),
  },
  button: {
    marginTop: heightPixel(20),
    backgroundColor: '#063225',
    borderRadius: heightPixel(5),
    paddingVertical: heightPixel(8),
    paddingHorizontal: heightPixel(20),
    marginBottom: heightPixel(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: fontPixel(20),
    fontFamily: 'LEMONMILK-Medium',
  },
  link: {
    fontSize: fontPixel(18),
    color: '#218d02',
    textDecorationLine: 'underline',
    fontFamily: 'LEMONMILK-Medium',
  },
  text_forgot: {
    fontSize: fontPixel(18),
    color: 'black',
    fontFamily: 'LEMONMILK-Medium',
  },
  logoStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.28,
    resizeMode: 'cover',
  },
});
