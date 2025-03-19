import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {Image} from 'react-native-svg';

const {width, height} = Dimensions.get('window');

const BuzzeAnimationScreen = () => {
  const x = useSharedValue(width / 2 - 50);
  const y = useSharedValue(height / 2 - 90);

  useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(width - 100, {duration: 1000}),
        withTiming(50, {duration: 1000}),
      ),
      -1,
      true,
    );

    y.value = withRepeat(
      withSequence(
        withTiming(height / 4, {duration: 800}),
        withTiming((3 * height) / 4 - 200, {duration: 800}),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: x.value}, {translateY: y.value}],
  }));

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>The Buzz is out</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>BUZZ OVER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>BUZZ ON</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>BUZZ IN</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View style={[styles.beeContainer, animatedStyle]}>
        <Svg width={100} height={90}>
          <Image
            href={require('../../assets/images/buzz1.png')}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
        </Svg>
      </Animated.View>
    </>
  );
};

export default BuzzeAnimationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  beeContainer: {
    position: 'absolute',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#f5a623',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
