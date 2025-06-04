import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const ZoomPanImage = ({source, onClose}) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      const newScale = savedScale.value * e.scale;
      scale.value = Math.max(1, Math.min(4, newScale)); // limit zoom between 1x and 4x
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      if (scale.value > 1) {
        // When zoomed in, allow free movement
        translateX.value = e.translationX;
        translateY.value = e.translationY;
      } else {
        // When not zoomed, only allow vertical drag to close
        translateY.value = e.translationY;
      }
    })
    .onEnd(e => {
      if (scale.value === 1 && Math.abs(e.translationY) > 120) {
        runOnJS(onClose)();
      } else {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      }
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));

    const maxTranslateX = (SCREEN_WIDTH * scale.value - SCREEN_WIDTH) / 2;
    const maxTranslateY = (SCREEN_HEIGHT * scale.value - SCREEN_HEIGHT) / 2;

    return {
      transform: [
        {scale: scale.value},
        {translateX: clamp(translateX.value, maxTranslateX)},
        {translateY: clamp(translateY.value, maxTranslateY)},
      ],
    };
  });

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.Image
        source={source}
        style={[styles.image, animatedStyle]}
        resizeMode="contain"
      />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

export default ZoomPanImage;
