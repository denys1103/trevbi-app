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

import {stringMd5} from 'react-native-quick-md5';
import Toast from 'react-native-toast-message';
import CheckBox from '@react-native-community/checkbox';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import client from '../config';
import {fontPixel, heightPixel, widthPixel} from '../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {isLoading, login, isConnected} = useContext(GlobalContext);

  const [popupVisible, setPopupVisible] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [code_1, setCode_1] = useState('');
  const [step, setStep] = useState(0);
  const [indicator, showIndicator] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const onClickSend = () => {
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Check your internet connection.',
      });
      return;
    }
    if (emailAddress === '') {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Please enter email',
      });
    } else {
      showIndicator(true);
      client
        .post('/forgot-password', {email: emailAddress, verify: true})
        .then(response => {
          showIndicator(false);
          var data = response.data;
          if (data.success) {
            setStep((step + 1) % 3);
            if (data.code != '') {
              setCode_1(data.code);
              Toast.show({
                type: 'success',
                text1: 'Warning',
                text2: 'Please check your email for verification code.',
              });
            }
          } else {
            Toast.show({
              type: 'error',
              text1: 'Warning',
              text2: 'This is an unregistered email',
            });
          }
        })
        .catch(error => {
          showIndicator(false);
          Toast.show({
            type: 'error',
            text1: 'Warning',
            text2: 'Email not sent, please try again later',
          });
        });
      showIndicator(false);
    }
  };

  const onClickVerify = () => {
    const enc = stringMd5(code);
    if (code === '' || enc !== code_1) {
      Toast.show({
        type: 'error',
        text1: 'Alert',
        text2: 'This is an invalid code.',
      });
      return;
    }

    setStep((step + 1) % 3);
  };

  const onClickReset = () => {
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Check your internet connection.',
      });
      return;
    }
    if (rePassword.length < 8 || rePassword.length > 20) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Password length between 8 and 20',
      });
      return;
    }

    if (rePassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Confirm password should be same',
      });
      return;
    }
    showIndicator(true);
    client
      .post('/forgot-password', {
        email: emailAddress,
        verify: false,
        password: rePassword,
      })
      .then(response => {
        var data = response.data;
        if (data.success) {
          showIndicator(false);
          if (data.code == '') {
            setPopupVisible(false);
            setStep(0);
            setRePassword('');
            setConfirmPassword('');
            setCode('');
            setCode_1('');
            setEmailAddress('');
            Toast.show({
              type: 'success',
              text1: 'Alert',
              text2: 'Successfully reset password.',
            });
          }
        } else {
          showIndicator(false);
          Toast.show({
            type: 'error',
            text1: 'Warning',
            text2: 'Failed, please try again later!',
          });
        }
      })
      .catch(error => {
        showIndicator(false);
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: 'Failed to reset password, please try again later.',
        });
      });
    showIndicator(false);
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={{flex: 1}}>
          <Spinner visible={isLoading || indicator} />
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
                  Food for thought
                </Text>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.text_welcome_description,
                    {
                      fontFamily: 'LEMONMILK-Light',
                      paddingBottom: heightPixel(10),
                    },
                  ]}>
                  And transparency
                </Text>
              </View>
              <View style={{height: '2%'}} />
              <View style={(styles.input_view, {width: '65%'})}>
                <View
                  style={[styles.input_box, {marginBottom: widthPixel(20)}]}>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    label="Email"
                    placeholder="example@email.com"
                    placeholderTextColor="#000000aa"
                    autoCapitalize="none"
                  />
                  <MaterialCommunityIcons
                    color={'#7d7d7d'}
                    name="email"
                    size={fontPixel(20)}
                  />
                </View>
                <View style={styles.input_box}>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={text => setPassword(text)}
                    label="Password"
                    placeholder="password"
                    autoCapitalize="none"
                    placeholderTextColor="#000000aa"
                    secureTextEntry={secureTextEntry}
                  />
                  <MaterialCommunityIcons
                    color={'#7d7d7d'}
                    name={secureTextEntry ? 'eye-off' : 'eye'}
                    size={fontPixel(20)}
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                  />
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
                        fontFamily: 'LEMONMILK-Medium',
                      },
                    ]}>
                    Remember me
                  </Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={async () => {
                      if (email && password) {
                        login(email, password);
                      } else {
                        Toast.show({
                          type: 'error',
                          text1: 'Warning',
                          text2: 'Email / password is required!',
                        });
                      }
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={[styles.text_button, {fontSize: fontPixel(20)}]}>
                      Login
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setPopupVisible(true)}>
                    <Text allowFontScaling={false} style={styles.link}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.text_button,
                      {color: 'black', fontSize: fontPixel(20)},
                    ]}>
                    Or
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                    Don't have an account{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}>
                    <Text allowFontScaling={false} style={styles.link}>
                      Sign up Here
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => navigation.navigate('SplashThird')}>
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
                        fontFamily: 'LEMONMILK-Medium',
                      },
                    ]}>
                    Continue as guest
                  </Text>
                </TouchableOpacity> */}
              </View>
              <View
                style={{
                  height: '10%',
                  width: '90%',
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                }}>
                {/* <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text allowFontScaling={false}
                    style={[
                      styles.text_forgot,
                      {
                        fontFamily: 'MyriadPro-Regular',
                      },
                    ]}>
                    or Sign up with
                  </Text>
                </View> */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}></View>
                {/* <View
                  style={{flexDirection: 'column', justifyContent: 'center'}}>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text allowFontScaling={false}
                      style={[
                        styles.text_forgot,
                        {
                          fontFamily: 'MyriadPro-Regular',
                        },
                      ]}>
                      By Signing In, you agree with our{' '}
                    </Text>
                    <TouchableOpacity onPress={() => console.log('Terms')}>
                      <Text allowFontScaling={false} style={styles.link_white}>Terms</Text>
                    </TouchableOpacity>
                    <Text allowFontScaling={false}
                      style={[
                        styles.text_forgot,
                        {
                          fontFamily: 'MyriadPro-Regular',
                        },
                      ]}>
                      , Learn how we process
                    </Text>
                  </View>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text allowFontScaling={false}
                      style={[
                        styles.text_forgot,
                        {
                          fontFamily: 'MyriadPro-Regular',
                        },
                      ]}>
                      your data in our{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => console.log('Privacy Policy')}>
                      <Text allowFontScaling={false} style={styles.link_white}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <Text allowFontScaling={false}
                      style={[
                        styles.text_forgot,
                        {
                          fontFamily: 'MyriadPro-Regular',
                        },
                      ]}>
                      {' '}
                      and{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => console.log('Cookies Policy')}>
                      <Text allowFontScaling={false} style={styles.link_white}>Cookies Policy</Text>
                    </TouchableOpacity>
                  </View>
                </View> */}
              </View>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
      {popupVisible && (
        <View style={styles.popup_view}>
          <View style={styles.popup_header_view}>
            <Text allowFontScaling={false} style={styles.popup_header_text}>
              Password Recovery
            </Text>
          </View>
          <View style={styles.popup_body_view}>
            <Text allowFontScaling={false} style={styles.label}>
              {step == 0 && 'Email address'}
              {step == 1 && 'Code'}
              {step == 2 && 'New Password'}
            </Text>
            {step == 0 && (
              <TextInput
                style={styles.popup_input}
                value={emailAddress}
                onChangeText={setEmailAddress}
              />
            )}
            {step == 1 && (
              <TextInput
                style={styles.popup_input}
                value={code}
                onChangeText={setCode}
              />
            )}
            {step == 2 && (
              <TextInput
                style={styles.popup_input}
                value={rePassword}
                onChangeText={setRePassword}
                secureTextEntry={true}
                autoCapitalize="none"
              />
            )}
            {step == 2 && (
              <Text allowFontScaling={false} style={styles.label}>
                Confirm Password
              </Text>
            )}
            {step == 2 && (
              <TextInput
                style={styles.popup_input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                autoCapitalize="none"
              />
            )}
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {step == 0 && (
                <TouchableOpacity
                  style={styles.popup_button}
                  activeOpacity={0.7}
                  onPress={onClickSend}>
                  <Text allowFontScaling={false} style={styles.text_button}>
                    Send
                  </Text>
                </TouchableOpacity>
              )}
              {step == 1 && (
                <TouchableOpacity
                  style={styles.popup_button}
                  activeOpacity={0.7}
                  onPress={onClickVerify}>
                  <Text allowFontScaling={false} style={styles.text_button}>
                    Verify
                  </Text>
                </TouchableOpacity>
              )}
              {step == 2 && (
                <TouchableOpacity
                  style={styles.popup_button}
                  activeOpacity={0.7}
                  onPress={onClickReset}>
                  <Text allowFontScaling={false} style={styles.text_button}>
                    Reset
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.popup_button,
                  {
                    backgroundColor: '#aaa',
                  },
                ]}
                onPress={() => {
                  setPopupVisible(false);
                  setStep(0);
                  setRePassword('');
                  setConfirmPassword('');
                  setCode('');
                  setCode_1('');
                  setEmailAddress('');
                }}>
                <Text allowFontScaling={false} style={styles.text_button}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: 'black',
    fontFamily: 'LEMONMILK-Light',
    flex: 1,
  },
  input_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: heightPixel(10),
    borderWidth: heightPixel(1),
    borderColor: 'black',
    borderRadius: heightPixel(10),
    backgroundColor: '#ffffff',
    marginBottom: widthPixel(5),
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
    color: '#218d02',
    textDecorationLine: 'underline',
    fontFamily: 'LEMONMILK-Medium',
  },
  link_white: {
    fontSize: fontPixel(15),
    color: '#218d02',
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
    fontSize: fontPixel(18),
    color: 'black',
    padding: heightPixel(2),
  },
  text_forgot: {
    fontSize: fontPixel(15),
    color: 'black',
  },
  text_button: {
    fontSize: fontPixel(18),
    color: 'white',
    fontFamily: 'LEMONMILK-Medium',
  },
  button: {
    // marginTop: heightPixel(20),
    backgroundColor: '#063225',
    borderRadius: heightPixel(5),
    paddingVertical: widthPixel(10),
    paddingHorizontal: heightPixel(20),
    // marginBottom: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
  },
  popup_view: {
    backgroundColor: '#eeeeee',
    width: (SCREEN_WIDTH / 10) * 8,
    justifyContent: 'center',
    borderRadius: heightPixel(8),
    position: 'absolute',
    left: SCREEN_WIDTH / 10,
    top: SCREEN_HEIGHT / 4,
    borderWidth: heightPixel(1),
    borderColor: '#d1d1d1',
    zIndex: 5,
    elevation: 5,
  },
  popup_header_view: {
    backgroundColor: '#428242',
    alignSelf: 'center',
    color: 'white',
    width: '100%',
    padding: heightPixel(5),
    borderTopLeftRadius: heightPixel(8),
    borderTopRightRadius: heightPixel(8),
  },
  popup_header_text: {
    alignSelf: 'center',
    color: 'white',
    fontSize: fontPixel(22),
    fontFamily: 'LEMONMILK-Light',
  },
  popup_body_view: {
    alignSelf: 'center',
    color: 'white',
    width: '100%',
    padding: heightPixel(20),
  },
  label: {
    marginTop: heightPixel(10),
    marginBottom: heightPixel(5),
    fontSize: fontPixel(16),
    color: '#72a045',
    fontFamily: 'LEMONMILK-Light',
  },
  popup_input: {
    borderColor: '#72a045',
    borderWidth: 1,
    borderRadius: heightPixel(5),
    padding: heightPixel(6),
    fontSize: fontPixel(21),
    color: '#72a045',
    fontFamily: 'LEMONMILK-Light',
  },
  popup_button: {
    marginTop: heightPixel(20),
    backgroundColor: '#428242',
    borderRadius: heightPixel(5),
    paddingVertical: widthPixel(10),
    paddingHorizontal: heightPixel(10),
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
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

export default LoginScreen;
