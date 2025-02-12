import React from 'react';
import {View, StyleSheet} from 'react-native';
import {heightPixel} from '../../config';

const BlackCross = () => {
  return (
    <View style={styles.background}>
      <View style={styles.left}>
        <View style={styles.right} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    height: heightPixel(50),
    width: heightPixel(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {
    height: heightPixel(25),
    width: heightPixel(3),
    backgroundColor: 'black',
    transform: [{rotate: '40deg'}],
  },
  right: {
    height: heightPixel(25),
    width: heightPixel(3),
    backgroundColor: 'black',
    transform: [{rotate: '100deg'}],
  },
});

export default BlackCross;
