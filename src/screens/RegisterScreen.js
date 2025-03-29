import React, {useState, useContext} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import {GlobalContext} from '../context';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import CheckBox from '@react-native-community/checkbox';

import {
  fontPixel,
  pixelSizeHorizontal,
  heightPixel,
  widthPixel,
} from '../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [Confpassword, setConfPassword] = useState(null);
  const {isLoading, register} = useContext(GlobalContext);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  // useEffect(() => {
  //   LogBox.ignoreLogs([
  //     '[notifee] no background event handler has been set. Set a handler via the "onBackgroundEvent" method.',
  //   ]);
  // }, []);

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Spinner visible={isLoading} />
        <View style={{flex: 1}}>
          <ImageBackground
            source={require('../../assets/images/background_login.jpg')}
            resizeMode="cover"
            style={styles.image}>
            <View style={styles.wrapper}>
              <View style={styles.logo_view}>
                <Image
                  style={styles.logo}
                  source={require('../../assets/images/TREVBI_Transparent_Login_Logo.png')}
                />
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.text_welcome,
                    {
                      fontFamily: 'LEMONMILK-Bold',
                    },
                  ]}>
                  Welcome
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.text_welcome_description,
                    {
                      fontFamily: 'LEMONMILK-Light',
                      paddingTop: heightPixel(10),
                    },
                  ]}>
                  Create my account
                </Text>
              </View>
              <View style={(styles.input_view, {width: '65%'})}>
                <TextInput
                  style={styles.input}
                  value={name}
                  placeholder="username"
                  placeholderTextColor="#000000aa"
                  onChangeText={text => setName(text)}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={text => setEmail(text)}
                  placeholder="e-mail"
                  placeholderTextColor="#000000aa"
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={text => setPassword(text)}
                  placeholder="create password"
                  placeholderTextColor="#000000aa"
                  secureTextEntry
                />
                <TextInput
                  style={styles.input}
                  value={Confpassword}
                  placeholder="verify your password"
                  placeholderTextColor="#000000aa"
                  onChangeText={text => setConfPassword(text)}
                  secureTextEntry
                />
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={async () => {
                      if (name && email && password && Confpassword) {
                        register(
                          name,
                          email,
                          password,
                          Confpassword,
                          navigation,
                        );
                      } else {
                        Toast.show({
                          type: 'error',
                          text1: 'Warning',
                          text2: 'Name / email / password is required!',
                        });
                      }
                    }}>
                    <Text allowFontScaling={false} style={styles.text_button}>
                      Sign me up
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingTop: heightPixel(20),
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.text_forgot,
                      {
                        fontFamily: 'LEMONMILK-Medium',
                      },
                    ]}>
                    Already have an account{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}>
                    <Text allowFontScaling={false} style={styles.link}>
                      Login Here
                    </Text>
                  </TouchableOpacity>
                </View>
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
                      styles.text_forgot,
                      {
                        fontFamily: 'LEMONMILK-Light',
                      },
                    ]}>
                    Send me tips & food alerts
                  </Text>
                </View>
              </View>
              <View style={{height: '10%'}} />
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: widthPixel(20),
    padding: heightPixel(10),
    borderWidth: heightPixel(1),
    borderColor: 'black',
    borderRadius: heightPixel(10),
    backgroundColor: '#ffffff',
    color: 'black',
    textAlign: 'center',
  },
  input_password: {
    marginBottom: widthPixel(5),
    padding: heightPixel(10),
    borderWidth: heightPixel(1),
    borderColor: 'black',
    borderRadius: heightPixel(10),
    backgroundColor: '#ffffff',
    color: 'black',
    textAlign: 'center',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  link: {
    fontSize: fontPixel(15),
    color: '#205020',
    textDecorationLine: 'underline',
    fontFamily: 'LEMONMILK-Medium',
  },
  link_white: {
    fontSize: fontPixel(15),
    color: '205020',
    textDecorationLine: 'underline',
    fontFamily: 'LEMONMILK-Medium',
  },
  logo_view: {
    height: SCREEN_HEIGHT / 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  input_view: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    resizeMode: 'contain',
  },
  text_welcome: {
    fontSize: fontPixel(28),
    color: 'black',
    marginTop: heightPixel(-20),
  },
  text_welcome_description: {
    fontSize: fontPixel(16),
    color: 'black',
    padding: heightPixel(2),
  },
  text_forgot: {
    fontSize: fontPixel(15),
    color: 'black',
  },
  text_button: {
    fontSize: fontPixel(20),
    color: 'white',
    fontFamily: 'LEMONMILK-Medium',
  },
  button: {
    marginTop: heightPixel(20),
    backgroundColor: '#063225',
    borderRadius: heightPixel(5),
    paddingVertical: widthPixel(10),
    paddingHorizontal: heightPixel(20),
    marginBottom: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: heightPixel(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    alignSelf: 'center',
    width: heightPixel(20),
    height: heightPixel(20),
    marginRight: heightPixel(10),
  },
  checkboxAndroid: {
    alignSelf: 'center',
    // transform: [{scale: 1.5}],
  },
});

export default RegisterScreen;
