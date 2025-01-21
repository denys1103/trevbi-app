import React, { useState, useEffect, useContext } from 'react';
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
  Linking,
  Button,
} from 'react-native';
import { GlobalContext } from '../context';
import Spinner from 'react-native-loading-spinner-overlay';

import { stringMd5 } from 'react-native-quick-md5';
import Toast from 'react-native-toast-message';
import client from '../config';
import {
  fontPixel,
  pixelSizeHorizontal,
  heightPixel,
  widthPixel,
} from '../config';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const {
    isLoading,
    error,
    isConnected,
  } = useContext(GlobalContext);
 
  const [popupVisible, setPopupVisible] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [code_1, setCode_1] = useState('');
  const [step, setStep] = useState(0);
  const [indicator, showIndicator] = useState(false);

  const onClickSend = () => {
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Check your internet connection.',
      });
      return;
    }
    if (emailAddress == '') {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Please enter email',
      });
    } else {
      // showIndicator(true);
      // client
      //   .post('/forgot-password', { email: emailAddress, verify: true })
      //   .then(response => {
      //     showIndicator(false);
      //     var data = response.data;
      //     console.log(data)
      //     if (data.success) {
      //       setStep((step + 1) % 3);
      //       if (data.code != '') {
      //         setCode_1(data.code);
      //         Toast.show({
      //           type: 'success',
      //           text1: 'Warning',
      //           text2: 'Please check your email for verification code.',
      //         });
      //       }
      //     } else {
      //       Toast.show({
      //         type: 'error',
      //         text1: 'Warning',
      //         text2: 'This is an unregistered email',
      //       });
      //     }
      //   })
      //   .catch(error => {
      //     showIndicator(false);
      //     console.log(error.response.data);
      //     Toast.show({
      //       type: 'error',
      //       text1: 'Warning',
      //       text2: 'Email not sent, please try again later',
      //     });
      //   });
      // showIndicator(false);
    }
  };

  const onClickVerify = () => {
    const enc = stringMd5(code);
    console.log(enc,code_1,code)
    if (code == '' || enc != code_1) {
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

    if (rePassword != confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Confirm password should be same',
      });
      return;
    }
    showIndicator(true);
    // client
    //   .post('/forgot-password', { email: emailAddress, verify: false, password: rePassword })
    //   .then(response => {
    //     var data = response.data;
    //     if (data.success) {
    //       showIndicator(false);
    //       if (data.code == '') {
    //         setPopupVisible(false);
    //         setStep(0);
    //         setRePassword('');
    //         setConfirmPassword('');
    //         setCode('');
    //         setCode_1('');
    //         setEmailAddress('');
    //         Toast.show({
    //           type: 'success',
    //           text1: 'Alert',
    //           text2: 'Successfully reset password.',
    //         });
    //       }
    //     } else {
    //       showIndicator(false);
    //       Toast.show({
    //         type: 'error',
    //         text1: 'Warning',
    //         text2: 'Failed, please try again later!',
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     showIndicator(false);
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Warning',
    //       text2: 'Failed to reset password, please try again later.',
    //     });
    //   })
    showIndicator(false);
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={{ flex: 1 }} >
          <Spinner visible={isLoading || indicator} />
          <ImageBackground
            source={require('../../assets/images/background_login.jpg')}
            resizeMode="cover"
            style={styles.image}>
            <View style={styles.wrapper}>
              <View style={styles.logo_view}>
                <Image
                  style={styles.logo}
                  source={require('../../assets/images/TREVBI_Transparent_Logo.png')}
                />
                <Text
                  style={[
                    styles.text_welcome,
                    {
                      fontFamily: 'MyriadPro-Regular',
                    },
                  ]}>
                  Welcome!
                </Text>
              </View>
              <View style={{ height: '5%' }} />
              <View style={(styles.input_view, { width: '65%' })}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={text => setEmail(text)}
                  label="Email"
                  placeholder="example@email.com"
                  placeholderTextColor="#72a045aa"
                  autoCapitalize="none"
                />

                <TextInput
                  style={styles.input_password}
                  value={password}
                  onChangeText={text => setPassword(text)}
                  label="Password"
                  placeholder="password"
                  autoCapitalize="none"
                  placeholderTextColor="#72a045aa"
                  secureTextEntry
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text
                    style={[
                      styles.text_forgot,
                      {
                        fontFamily: 'MyriadPro-Regular',
                      },
                    ]}>
                    forgot password?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setPopupVisible(true);
                    }}>
                    <Text style={styles.link}>Click Here</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={async () => {
                      // login(email, password, fcmToken);
                    }}>
                    <Text style={styles.text_button}>Login</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.text_forgot,
                      {
                        fontFamily: 'MyriadPro-Regular',
                      },
                    ]}>
                    Don't have an account?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Register Here</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  height: '25%',
                  width: '90%',
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text
                    style={[
                      styles.text_forgot,
                      {
                        fontFamily: 'MyriadPro-Regular',
                      },
                    ]}>
                    or Sign up with
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}>
                </View>
                <View
                  style={{ flexDirection: 'column', justifyContent: 'center' }}>
                  <View
                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text
                      style={[
                        styles.text_forgot,
                        {
                          fontFamily: 'MyriadPro-Regular',
                        },
                      ]}>
                      By Signing In, you agree with our{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        console.log('Terms')
                      }>
                      <Text style={styles.link_white}>Terms</Text>
                    </TouchableOpacity>
                    <Text
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
                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text
                      style={[
                        styles.text_forgot,
                        {
                          fontFamily: 'MyriadPro-Regular',
                        },
                      ]}>
                      your data in our{' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        console.log('Privacy Policy')
                      }>
                      <Text style={styles.link_white}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <Text
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
                      onPress={() =>
                        console.log('Cookies Policy')
                      }>
                      <Text style={styles.link_white}>Cookies Policy</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      </KeyboardAvoidingView>
      {popupVisible && (
        <View style={styles.popup_view}>
          <View style={styles.popup_header_view}>
            <Text style={styles.popup_header_text}>Password Recovery</Text>
          </View>
          <View style={styles.popup_body_view}>
            <Text
              style={[
                styles.label,
                {
                  fontFamily: 'MyriadPro-Regular',
                },
              ]}>
              {step == 0 && 'Email address'}
              {step == 1 && 'Code'}
              {step == 2 && 'New Password'}
            </Text>
            {step == 0 && (
              <TextInput
                style={[
                  styles.popup_input,
                  {
                    fontFamily: 'MyriadPro-Regular',
                  },
                ]}
                value={emailAddress}
                onChangeText={setEmailAddress}
              />
            )}
            {step == 1 && (
              <TextInput
                style={[
                  styles.popup_input,
                  {
                    fontFamily: 'MyriadPro-Regular',
                  },
                ]}
                value={code}
                onChangeText={setCode}
              />
            )}
            {step == 2 && (
              <TextInput
                style={[
                  styles.popup_input,
                  {
                    fontFamily: 'MyriadPro-Regular',
                  },
                ]}
                value={rePassword}
                onChangeText={setRePassword}
              />
            )}
            {step == 2 && (
              <Text
                style={[
                  styles.label,
                  {
                    fontFamily: 'MyriadPro-Regular',
                  },
                ]}>
                Confirm Password
              </Text>
            )}
            {step == 2 && (
              <TextInput
                style={[
                  styles.popup_input,
                  {
                    fontFamily: 'MyriadPro-Regular',
                  },
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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
                  onPress={() => {
                    onClickSend();
                  }}>
                  <Text style={styles.text_button}>Send</Text>
                </TouchableOpacity>
              )}
              {step == 1 && (
                <TouchableOpacity
                  style={styles.popup_button}
                  activeOpacity={0.7}
                  onPress={() => {
                    onClickVerify();
                  }}>
                  <Text style={styles.text_button}>Verify</Text>
                </TouchableOpacity>
              )}
              {step == 2 && (
                <TouchableOpacity
                  style={styles.popup_button}
                  activeOpacity={0.7}
                  onPress={() => {
                    onClickReset();
                  }}>
                  <Text style={styles.text_button}>Reset</Text>
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
                <Text style={styles.text_button}>Cancel</Text>
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
    marginBottom: widthPixel(20),
    padding: heightPixel(15),
    borderWidth: 1,
    borderColor: '#72a045',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    color: '#72a045',
    textAlign: 'center',
  },
  input_password: {
    marginBottom: widthPixel(5),
    padding: heightPixel(15),
    borderWidth: 1,
    borderColor: '#72a045',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    color: '#72a045',
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
    fontSize: fontPixel(12),
    color: '#205020',
    textDecorationLine: 'underline',
  },
  link_white: {
    fontSize: fontPixel(12),
    color: 'white',
    textDecorationLine: 'underline',
  },
  logo_view: {
    height: SCREEN_HEIGHT / 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  input_view: {
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '50%',
    height: 100,
    resizeMode: 'contain',
    marginTop: heightPixel(20),
  },
  text0: {
    fontSize: fontPixel(48),
    color: 'white',
    paddingHorizontal: pixelSizeHorizontal(40),
  },
  text1: {
    fontSize: fontPixel(48),
    color: 'white',
  },
  text2: {
    fontSize: fontPixel(20),
    color: 'white',
  },
  text_welcome: {
    fontSize: fontPixel(28),
    color: 'white',
    paddingTop: heightPixel(12),
  },
  text_forgot: {
    fontSize: fontPixel(12),
    color: 'white',
  },
  text_button: {
    fontSize: fontPixel(20),
    color: 'white',
  },
  button: {
    marginTop: heightPixel(20),
    backgroundColor: '#428242',
    borderRadius: 5,
    paddingVertical: widthPixel(15),
    paddingHorizontal: 20,
    marginBottom: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
  },
  to_link: {
    width: heightPixel(60),
    height: heightPixel(60),
  },
  selectModalStyle: {
    justifyContent: 'center',
    backgroundColor: 'white',
    width: SCREEN_WIDTH * 0.8,
    height: heightPixel(300),
    padding: heightPixel(10),
    alignItems: 'center',
    borderRadius: heightPixel(10),
    position: 'absolute',
    left: SCREEN_WIDTH * 0.1,
    top: SCREEN_HEIGHT / 3,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    zIndex: 5,
    elevation: 5,
  },
  modal_box_title: {
    fontSize: fontPixel(24),
    color: '#242424',
  },
  dropdown3BtnStyle: {
    width: '100%',
    marginBottom: widthPixel(10),
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: '#555555',
    color: 'white',
    textAlign: 'center',
  },
  dropdown3BtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: heightPixel(18),
  },
  dropdown3BtnImage: {
    width: heightPixel(40),
    height: heightPixel(40),
    resizeMode: 'cover',
  },
  dropdown3BtnTxt: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: heightPixel(12),
  },
  dropdown3DropdownStyle: { backgroundColor: 'slategray' },
  dropdown3RowStyle: {
    backgroundColor: 'slategray',
    borderWidth: 1,
    borderColor: 'black',
    borderBottomColor: '#444',
    height: heightPixel(50),
  },
  dropdown3RowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: heightPixel(18),
  },
  dropdownRowImage: {
    width: heightPixel(40),
    height: heightPixel(40),
    resizeMode: 'cover',
  },
  dropdown3RowTxt: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginHorizontal: heightPixel(12),
  },
  select_button: {
    marginTop: heightPixel(20),
    backgroundColor: '#428242',
    borderRadius: 5,
    paddingVertical: widthPixel(10),
    paddingHorizontal: widthPixel(30),
    marginBottom: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  popup_view: {
    backgroundColor: '#eeeeee',
    width: (SCREEN_WIDTH / 10) * 8,
    justifyContent: 'center',
    borderRadius: heightPixel(8),
    position: 'absolute',
    left: SCREEN_WIDTH / 10,
    top: SCREEN_HEIGHT / 4,
    borderWidth: 1,
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
    fontSize: fontPixel(24),
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
  },
  popup_input: {
    borderColor: '#72a045',
    borderWidth: 1,
    borderRadius: heightPixel(5),
    padding: heightPixel(6),
    fontSize: fontPixel(21),
    color: '#72a045',
  },
  popup_button: {
    marginTop: heightPixel(20),
    backgroundColor: '#428242',
    borderRadius: heightPixel(5),
    paddingVertical: widthPixel(10),
    paddingHorizontal: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
});

export default LoginScreen;
