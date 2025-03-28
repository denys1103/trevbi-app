import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import {SelectList} from 'react-native-dropdown-select-list';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-toast-message';
import {fontPixel, heightPixel, imageURL} from '../../config';

import {GlobalContext} from '../../context';

export function Profile({setEditVisible, navigation}) {
  const {isLoading, userInfo, logout} = useContext(GlobalContext);
  useEffect(() => {
    if (!userInfo.token) {
      navigation.replace('Login');
    }
  }, [navigation, userInfo.token]);
  const profile = userInfo.user;

  const format_date = date => {
    date = new Date(date);
    if (!date) {
      date = new Date();
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  };

  const handleSubmit = () => {
    const temp_profile = {};
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Spinner visible={isLoading} />
      <View style={styles.pencilContainer}>
        <TouchableOpacity onPress={() => setEditVisible(true)}>
          <MaterialCommunityIcons
            color={'#72a045'}
            name="account-edit"
            size={fontPixel(28)}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={
            profile?.avatar
              ? {
                  uri: imageURL + profile.avatar,
                }
              : require('../../../assets/images/free_user.png')
          }
        />
      </View>
      <View style={styles.form}>
        <View style={styles.box}>
          <MaterialCommunityIcons
            color={'#7d7d7d'}
            name="account"
            size={fontPixel(32)}
          />
          <View style={styles.boxContent}>
            <Text allowFontScaling={false} style={styles.label}>
              Name
            </Text>
            <Text allowFontScaling={false} style={styles.profileDataStyle}>
              {profile?.fullname ? profile.fullname : ''}
            </Text>
          </View>
        </View>
        <View style={styles.box}>
          <MaterialCommunityIcons
            color={'#7d7d7d'}
            name="calendar-month"
            size={fontPixel(32)}
          />
          <View style={styles.boxContent}>
            <Text allowFontScaling={false} style={styles.label}>
              Date of Birth
            </Text>
            <Text allowFontScaling={false} style={styles.profileDataStyle}>
              {profile?.birth
                ? format_date(profile.birth)
                : format_date(new Date())}
            </Text>
          </View>
        </View>
        <View style={styles.box}>
          <MaterialCommunityIcons
            color={'#7d7d7d'}
            name="phone"
            size={fontPixel(32)}
          />
          <View style={styles.boxContent}>
            <Text allowFontScaling={false} style={styles.label}>
              Phone Number
            </Text>
            <Text allowFontScaling={false} style={styles.profileDataStyle}>
              {profile?.phone_num ? profile.phone_num : ''}
            </Text>
          </View>
        </View>
        <View style={styles.box}>
          <MaterialCommunityIcons
            color={'#7d7d7d'}
            name="email"
            size={fontPixel(32)}
          />
          <View style={styles.boxContent}>
            <Text allowFontScaling={false} style={styles.label}>
              Email address
            </Text>
            <Text allowFontScaling={false} style={styles.profileDataStyle}>
              {profile?.email ? profile.email : ''}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text allowFontScaling={false} style={styles.buttonText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  form: {
    width: '80%',
  },
  label: {
    paddingBottom: heightPixel(2),
    fontSize: fontPixel(16),
    fontFamily: 'LEMONMILK-Medium',
  },
  profileDataStyle: {
    fontSize: fontPixel(18),
  },
  button: {
    marginTop: heightPixel(20),
    backgroundColor: '#063225',
    borderRadius: heightPixel(5),
    paddingVertical: heightPixel(8),
    paddingHorizontal: heightPixel(20),
    marginBottom: heightPixel(25),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: fontPixel(20),
    fontFamily: 'LEMONMILK-Medium',
  },
  pencilContainer: {
    paddingTop: heightPixel(10),
    paddingRight: heightPixel(20),
    alignSelf: 'flex-end',
  },
  avatarContainer: {
    paddingTop: heightPixel(5),
    paddingBottom: heightPixel(20),
    alignItems: 'center',
  },
  avatar: {
    width: heightPixel(100),
    height: heightPixel(100),
    borderRadius: heightPixel(50),
  },
  box: {
    padding: heightPixel(6),
    marginTop: 1,
    marginBottom: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: heightPixel(10),
  },
});
