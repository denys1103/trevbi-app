import React from 'react';
import {
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
  StyleSheet,
} from 'react-native';
import {fontPixel, pixelSizeVertical} from '../config';

const MainSplash = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/splash.jpg')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.wrapper}>
          <View style={{flex: 3}} />
          <View
            style={{
              flex: 3,
              width: '90%',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              style={{
                paddingVertical: pixelSizeVertical(20),
                alignItems: 'flex-end',
              }}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}>
              <Text
                style={[
                  styles.text0,
                  {
                    fontFamily: 'MyriadPro-Regular',
                  },
                ]}>
                Get Started{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text0: {
    fontSize: fontPixel(20),
    color: '#61a148',
  },
});

export default MainSplash;
