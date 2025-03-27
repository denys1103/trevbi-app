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

export function ProfileEdit({setEditVisible, navigation}) {
  const {isLoading, userInfo, uploadAvata, saveProfile} =
    useContext(GlobalContext);
  useEffect(() => {
    if (!userInfo.token) {
      navigation.replace('Login');
    }
  }, [navigation, userInfo.token]);
  const profile = userInfo.user;
  const format = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const format_date = date => {
    date = new Date(date);
    if (!date) {
      date = new Date();
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  const [filePath, setFilePath] = useState(
    profile.avatar ? imageURL + profile.avatar : '',
  );
  const [fullname, setName] = useState(
    profile.fullname ? profile.fullname : '',
  );
  const [email, setEmail] = useState(profile.email);
  const [birth, setBirth] = useState(
    profile.birth ? profile.birth : format(new Date()),
  );
  const [openBirth, setOpenBirth] = useState(false);
  const [phone_num, setPhoneNum] = useState(
    profile.phone_num ? profile.phone_num : '',
  );

  const [genderValue, setGenderValue] = useState(
    profile.gender ? profile.gender : '0',
  );
  const [gender, setGender] = useState([
    {key: '0', value: 'Male'},
    {key: '1', value: 'Female'},
  ]);

  useEffect(() => {
    setFilePath(profile.avatar ? imageURL + profile.avatar : '');
  }, [profile.avatar]);

  const handlePhoneNumChange = text => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 12) {
      setPhoneNum(numericText);
    }
  };

  const handleSubmit = () => {
    const temp_profile = {};
    temp_profile.fullname = fullname;
    temp_profile.gender = genderValue;
    temp_profile.email = userInfo.user.email;
    temp_profile.birth = birth;
    temp_profile.phone_num = phone_num;
    saveProfile(temp_profile);
  };

  const chooseAvataPhotoFile = async () => {
    let options = {
      aspect: [4, 3],
      includeBase64: true,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      title: 'Select Image',
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        // alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        // alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        // alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        // alert(response.errorMessage);
        return;
      }
      if (response.assets[0].fileSize < 10000000) {
        if (response.assets[0].uri) {
          const res_data = response.assets[0];
          let data = new FormData();
          data.append('file', {
            name: res_data.fileName,
            type: res_data.type,
            uri:
              Platform.OS === 'android'
                ? res_data.uri
                : res_data.uri.replace('file://', ''),
          });
          uploadAvata(data);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: 'File size should not exceed 10 MB.',
        });
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Spinner visible={isLoading} />
      <View style={styles.pencilContainer}>
        <TouchableOpacity onPress={() => setEditVisible(false)}>
          <MaterialCommunityIcons
            color={'#7d7d7d'}
            name="arrow-left-bold-box-outline"
            size={fontPixel(28)}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={
            filePath
              ? {
                  uri: filePath,
                }
              : require('../../../assets/images/free_user.png')
          }
        />
        <TouchableOpacity
          style={styles.changeAvatarButton}
          onPress={chooseAvataPhotoFile}>
          <Text style={styles.changeAvatarButtonText}>Change Avatar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={fullname}
          onChangeText={setName}
        />
        <Text style={styles.label}>Gender</Text>
        <SelectList
          setSelected={key => setGenderValue(key)}
          placeholder={'--Select Gender--'}
          defaultOption={gender.filter(item => item.key == genderValue)[0]}
          boxStyles={{
            borderRadius: heightPixel(5),
            borderColor: '#c0c0c0',
            borderWidth: heightPixel(1),
            padding: 0,
          }}
          inputStyles={{
            fontSize: fontPixel(16),
            color: '#4b4b4b',
          }}
          data={gender}
          save="key"
        />
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setOpenBirth(true);
          }}>
          <View
            pointerEvents="none"
            style={{
              flexDirection: 'row',
              borderColor: '#c0c0c0',
              borderWidth: heightPixel(1),
              borderRadius: heightPixel(5),
            }}>
            <TextInput
              style={[
                styles.input,
                {
                  flex: 1,
                  borderColor: 'white',
                  fontFamily: 'LEMONMILK-Light',
                  fontSize: fontPixel(18),
                },
              ]}
              placeholder="Enter Date of Birth"
              value={format_date(birth)}
              editable={false}
            />
            <MaterialCommunityIcons
              style={{marginTop: heightPixel(3)}}
              color={'#7d7d7d'}
              name="calendar-month"
              size={fontPixel(32)}
            />
          </View>
        </TouchableOpacity>
        <DatePicker
          modal
          open={openBirth}
          mode="date"
          date={new Date(birth)}
          onConfirm={date => {
            setBirth(format(date));
            setOpenBirth(false);
          }}
          onCancel={() => {
            setOpenBirth(false);
          }}
        />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={phone_num}
          onChangeText={handlePhoneNumChange}
        />
        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={email}
          onChangeText={setEmail}
          editable={false}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
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
    paddingTop: heightPixel(15),
    paddingBottom: heightPixel(10),
    fontSize: fontPixel(16),
    fontFamily: 'LEMONMILK-Medium',
  },
  input: {
    borderColor: '#c0c0c0',
    borderWidth: heightPixel(1),
    borderRadius: heightPixel(5),
    padding: heightPixel(6),
    fontSize: fontPixel(20),
    color: '#4b4b4b',
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
    paddingLeft: heightPixel(20),
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    paddingTop: heightPixel(5),
    alignItems: 'center',
  },
  avatar: {
    width: heightPixel(100),
    height: heightPixel(100),
    borderRadius: heightPixel(50),
  },
  changeAvatarButton: {
    marginTop: heightPixel(8),
  },
  changeAvatarButtonText: {
    color: '#72a045',
    fontSize: fontPixel(18),
  },
});
