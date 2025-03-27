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
                  source={require('../../assets/images/TREVBI_Transparent_Logo.png')}
                />
                <Text style={styles.text_welcome}>Sign Up</Text>
              </View>
              <View style={(styles.input_view, {width: '65%'})}>
                <TextInput
                  style={styles.input}
                  value={name}
                  placeholder="username"
                  placeholderTextColor="#72a045aa"
                  onChangeText={text => setName(text)}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={text => setEmail(text)}
                  placeholder="e-mail"
                  placeholderTextColor="#72a045aa"
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={text => setPassword(text)}
                  placeholder="create password"
                  placeholderTextColor="#72a045aa"
                  secureTextEntry
                />
                <TextInput
                  style={styles.input}
                  value={Confpassword}
                  placeholder="verify your password"
                  placeholderTextColor="#72a045aa"
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
                    <Text style={styles.text_button}>Register</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={styles.text_forgot}>
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>Login Here</Text>
                  </TouchableOpacity>
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
    padding: heightPixel(15),
    borderWidth: heightPixel(1),
    borderColor: '#72a045',
    borderRadius: heightPixel(10),
    backgroundColor: '#ffffff',
    color: '#72a045',
    textAlign: 'center',
  },
  input_password: {
    marginBottom: widthPixel(5),
    padding: heightPixel(15),
    borderWidth: heightPixel(1),
    borderColor: '#72a045',
    borderRadius: heightPixel(10),
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
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '50%',
    height: heightPixel(100),
    resizeMode: 'contain',
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
    fontSize: fontPixel(36),
    color: 'white',
    paddingTop: heightPixel(8),
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
    borderRadius: heightPixel(5),
    paddingVertical: widthPixel(15),
    paddingHorizontal: heightPixel(20),
    marginBottom: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
  },
});

export default RegisterScreen;
