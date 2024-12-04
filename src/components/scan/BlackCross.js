import React from 'react';
import {View, StyleSheet} from 'react-native';

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
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {
    height: 25,
    width: 2,
    backgroundColor: 'black',
    transform: [{rotate: '40deg'}],
  },
  right: {
    height: 25,
    width: 2,
    backgroundColor: 'black',
    transform: [{rotate: '100deg'}],
  },
});

export default BlackCross;
