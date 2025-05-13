import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GlobalContext} from '../../context';
import {fontPixel, heightPixel, imageURL} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const CrewPage = ({navigation, route}) => {
  const {userInfo, friendList, getFriendList} = useContext(GlobalContext);
  const [selectUserModalVisibleStatus, setSelectUserModalVisibleStatus] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const numColumns = 3;
  const profile = userInfo.user;
  useEffect(() => {
    getFriendList();
  }, []);

  const renderItem = ({item, index}) => {
    if (item.empty === true) {
      return <></>;
    }
    var itemDimension = SCREEN_WIDTH / numColumns;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedUser(item);
          // setSelectUserModalVisibleStatus(true);
        }}
        activeOpacity={0.8}>
        <View
          style={{
            ...styles.renderItemStyle,
            width: itemDimension - heightPixel(2),
          }}>
          <Image
            style={{
              width: itemDimension * 0.8,
              height: itemDimension * 0.8,
              borderRadius: itemDimension * 0.4,
            }}
            source={
              item?.avatar
                ? {
                    uri: imageURL + item.avatar,
                  }
                : require('../../../assets/images/free_user.png')
            }
          />
          <Text
            allowFontScaling={false}
            style={{fontSize: fontPixel(18), color: 'black'}}>
            {item?.fullname ? item.fullname : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const formatRow = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({id: `blank-${numberOfElementsLastRow}`, empty: true});
      numberOfElementsLastRow++;
    }
    return data;
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={[
            styles.goToBackBtnStyle,
            {width: heightPixel(80), marginBottom: heightPixel(5)},
          ]}
          onPress={() => {
            navigation.replace('SocialProfile');
          }}>
          <Ionicons
            size={fontPixel(18)}
            name={'caret-back'}
            style={{color: 'white'}}
          />
          <Text
            allowFontScaling={false}
            style={{
              fontSize: fontPixel(14),
              color: 'white',
              fontFamily: 'LEMONMILK-Medium',
            }}>
            Back
          </Text>
        </TouchableOpacity>
        <View style={styles.overlay}>
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
            <Text
              allowFontScaling={false}
              style={[styles.fullnameStyle, {maxWidth: SCREEN_WIDTH * 0.9}]}>
              {profile?.fullname ? profile.fullname : ''}
            </Text>
          </View>
          <Image
            style={styles.logoStyle}
            source={require('../../../assets/images/TREVBI_SOCIAL_LOGO_small.png')}
          />
        </View>
        <FlatList
          data={formatRow(friendList, numColumns)}
          keyExtractor={item => {
            return item._id;
          }}
          renderItem={renderItem}
          numColumns={numColumns}
        />
        {selectUserModalVisibleStatus && (
          <View style={styles.modalStyle}>
            <View style={styles.closeContainer}>
              <TouchableOpacity
                onPress={() => {
                  setSelectUserModalVisibleStatus(false);
                }}>
                <MaterialCommunityIcons
                  color={'#61a148'}
                  name="close"
                  size={fontPixel(28)}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.avatarContainer}>
              <Image
                style={styles.selectedUserAvatar}
                source={
                  selectedUser?.avatar
                    ? {
                        uri: imageURL + selectedUser.avatar,
                      }
                    : require('../../../assets/images/free_user.png')
                }
              />
              <Text
                allowFontScaling={false}
                style={{fontSize: fontPixel(20), color: 'black'}}>
                {selectedUser?.fullname ? selectedUser.fullname : ''}
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: fontPixel(16),
                  color: 'black',
                  textAlign: 'center',
                  paddingHorizontal: heightPixel(30),
                }}>
                {selectedUser?.bio ? selectedUser.bio : ''}
              </Text>
            </View>
            <View style={{width: '100%', alignItems: 'center'}}></View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  goToBackBtnStyle: {
    flexDirection: 'row',
    backgroundColor: '#063225',
    borderRadius: heightPixel(15),
    paddingVertical: heightPixel(5),
    paddingLeft: heightPixel(5),
    marginLeft: heightPixel(10),
    paddingRight: heightPixel(10),
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  overlay: {
    paddingTop: heightPixel(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: heightPixel(15),
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-start',
    width: SCREEN_WIDTH * 0.6,
  },
  avatar: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: SCREEN_WIDTH * 0.075,
  },
  logoStyle: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.15,
    resizeMode: 'cover',
  },
  fullnameStyle: {
    textAlign: 'center',
    fontSize: fontPixel(18),
    color: 'black',
    paddingLeft: heightPixel(8),
    maxWidth: SCREEN_WIDTH * 0.45,
  },
  closeContainer: {
    paddingTop: heightPixel(10),
    paddingRight: heightPixel(20),
    alignSelf: 'flex-end',
  },
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    position: 'absolute',
    top: heightPixel(0),
    width: '100%',
  },
  selectedUserAvatar: {
    width: heightPixel(180),
    height: heightPixel(180),
    borderRadius: heightPixel(90),
  },
  renderItemStyle: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPixel(3),
  },
});

export default CrewPage;
