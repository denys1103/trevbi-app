import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {fontPixel, heightPixel, imageURL} from '../../config';

import {GlobalContext} from '../../context';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export function ProfileEdit({setEditVisible, navigation}) {
  const {userInfo, uploadAvata, saveProfile, showModal} =
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
    return `${year}-${month}-${day}T12:00:00+00:00`;
  };

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
  const [bio, setBio] = useState(profile.bio ? profile.bio : '');
  const [cookBookName, setCookBookName] = useState(
    profile.cookBookName ? profile.cookBookName : '',
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
    temp_profile.bio = bio;
    temp_profile.cookBookName = cookBookName;
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
        showModal('File size should not exceed 10 MB.');
      }
    });
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={styles.container}>
        <View style={styles.pencilContainer}>
          <TouchableOpacity onPress={() => setEditVisible(false)}>
            <MaterialCommunityIcons
              color={'#61a148'}
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
            <Text
              allowFontScaling={false}
              style={styles.changeAvatarButtonText}>
              Change Avatar
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.form}>
          <Text allowFontScaling={false} style={styles.label}>
            Name
          </Text>
          <TextInput
            allowFontScaling={false}
            style={styles.input}
            placeholder="Enter Name"
            value={fullname}
            onChangeText={setName}
          />
          <Text allowFontScaling={false} style={styles.label}>
            Date of Birth
          </Text>
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
                allowFontScaling={false}
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
          <Text allowFontScaling={false} style={styles.label}>
            Phone Number
          </Text>
          <TextInput
            style={styles.input}
            allowFontScaling={false}
            placeholder=""
            keyboardType="phone-pad"
            value={phone_num}
            onChangeText={handlePhoneNumChange}
            maxLength={15}
            returnKeyType="done"
            autoCapitalize="none"
          />
          <Text allowFontScaling={false} style={styles.label}>
            Bio
          </Text>
          <TextInput
            textAlignVertical="top"
            allowFontScaling={false}
            multiline={true}
            numberOfLines={6}
            placeholder="Enter Bio"
            style={styles.bioInputStyle}
            value={bio}
            onChangeText={setBio}
          />
          <Text allowFontScaling={false} style={styles.label}>
            CookBook
          </Text>
          <TextInput
            allowFontScaling={false}
            style={styles.input}
            placeholder="Name your cookbook"
            value={cookBookName}
            onChangeText={setCookBookName}
          />
          <Text allowFontScaling={false} style={styles.label}>
            Email address
          </Text>
          <TextInput
            style={styles.input}
            allowFontScaling={false}
            placeholder=""
            value={email}
            onChangeText={setEmail}
            editable={false}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text allowFontScaling={false} style={styles.buttonText}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    flex: 1,
    height: SCREEN_HEIGHT + heightPixel(130),
  },
  form: {
    width: '80%',
  },
  label: {
    paddingTop: heightPixel(10),
    paddingBottom: heightPixel(5),
    fontSize: fontPixel(16),
    fontFamily: 'LEMONMILK-Medium',
  },
  input: {
    borderColor: '#c0c0c0',
    borderWidth: heightPixel(1),
    borderRadius: heightPixel(5),
    padding: heightPixel(6),
    fontSize: fontPixel(18),
    color: '#4b4b4b',
    fontFamily: 'LEMONMILK-Light',
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
    color: '#61a148',
    fontSize: fontPixel(18),
    fontFamily: 'LEMONMILK-Light',
  },
  bioInputStyle: {
    borderColor: '#c0c0c0',
    borderWidth: heightPixel(1),
    borderRadius: heightPixel(5),
    color: '#4b4b4b',
    fontFamily: 'LEMONMILK-Light',
    fontSize: fontPixel(16),
    height: heightPixel(96),
    padding: heightPixel(6),
  },
});
