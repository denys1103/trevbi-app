import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import {fontPixel, heightPixel} from '../../config';
import {GlobalContext} from '../../context';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const Feedback = ({navigation}) => {
  const {checkEvent} = useContext(GlobalContext);
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.overlay}>
        <Image
          style={styles.logoStyle}
          source={require('../../../assets/images/TREVBI_Transparent_Logo.png')}
        />
      </View>
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => {
            console.log('');
          }}>
          <Text
            allowFontScaling={false}
            style={[
              styles.text_button,
              {
                fontFamily: 'LEMONMILK-Medium',
              },
            ]}>
            Share feedback
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: heightPixel(20),
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  box: {
    padding: heightPixel(8),
    marginTop: 1,
    marginBottom: 1,
    backgroundColor: 'white',
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
  overlay: {
    paddingVertical: heightPixel(10),
  },
  logoStyle: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.28 * 0.7,
    resizeMode: 'cover',
  },
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'space-space',
    alignItems: 'center',
    width: '100%',
    height: SCREEN_HEIGHT - SCREEN_WIDTH * 0.4 - heightPixel(150),
  },
  text_button: {
    fontSize: fontPixel(18),
    color: 'white',
  },
  button: {
    marginTop: heightPixel(50),
    backgroundColor: '#063225',
    borderRadius: heightPixel(5),
    paddingVertical: heightPixel(10),
    paddingHorizontal: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Feedback;
