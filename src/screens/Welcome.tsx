import { Canvas, Image, LinearGradient, Rect, useImage, vec } from '@shopify/react-native-skia';
import { useMemo, useState } from 'react';
import { Text, View, ImageSourcePropType, ImageStyle, Image as RNImage, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { images } from '../../assets/images/images';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Box from '../components/core/Box';
import Heading from '../components/core/Heading';

type WelcomeStepType = {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  imageStyle: ImageStyle;
  gradientBg: string[];
};

const DOT_SIZE = 11;
const DOT_SPACING = 6;

const WELCOME_STEPS: WelcomeStepType[] = [
  {
    id: '1',
    title: 'Welcome to CleanLabel!',
    description: 'CleanLabel is a mobile app that allows you to scan the ingredients of food and personal care products and instantly see their impact on your health.',
    image: images().welcomeStep1,
    imageStyle: { width: 142, height: 142 },
    gradientBg: ['rgba(102,123,104, 1)', 'rgba(102,123,104, 0.9)'],
  },
  {
    id: '2',
    title: 'Features of the app',
    description: 'CleanLabel is a food scanner app that instantly and transparently shows if a food product is good for your health or not.',
    image: images().welcomeStep2,
    imageStyle: { width: 200, height: 200 },
    gradientBg: ['rgba(155, 186, 119, 1)', 'rgba(155, 186, 119, 0.9)'],
  },
  {
    id: '3',
    title: 'Look at the app',
    description: 'Learn how to buy the best quality products from the grocery store with the CleanLabel app.',
    image: images().welcomeStep3,
    imageStyle: { width: 200, height: 200 },
    gradientBg: ['rgba(163,184,153, 1)', 'rgba(163,184,153, 0.9)'],
  },
  {
    id: '4',
    title: 'How to do it',
    description: 'Just point your camera, scan the ingredients, and find out if that box of pasta, loaf of bread, or box of cereal is made with best-in-class ingredients, or if you should put it back.',
    image: images().welcomeStep4,
    imageStyle: { width: 200, height: 200 },
    gradientBg: ['rgba(102,123,104, 1)', 'rgba(102,123,104, 0.9)'],
  },
];

export default function WelcomeScreen({ route, navigation }: any) {
  const safeTop = useSafeAreaInsets().top;
  const { width, height } = useWindowDimensions();
  const image = useImage(images().welcomeBg);

  const [currentStep, setCurrentStep] = useState(0);
  const stepAnim = useSharedValue(0);
  const color1 = useSharedValue(WELCOME_STEPS[0].gradientBg[0]);
  const color2 = useSharedValue(WELCOME_STEPS[0].gradientBg[1]);
  const colors = useDerivedValue(() => {
    return [color1.value, color2.value];
  }, []);

  const stepContent = useMemo(() => WELCOME_STEPS[currentStep], [currentStep]);
  const isLastStep = currentStep === WELCOME_STEPS.length - 1;
  const _onChangeStep = (nextStep: number) => {
    if (isLastStep) {
      return;
    }

    const nextBackgroundColor = WELCOME_STEPS[nextStep].gradientBg;
    color1.value = withTiming(nextBackgroundColor[0]);
    color2.value = withTiming(nextBackgroundColor[1]);
    stepAnim.value = withTiming(nextStep);
    setCurrentStep(nextStep);
  };

  const _renderBackground = () => {
    return (
      <Canvas style={[styles.canvas, { width, height }]}>
        <Image
          image={image}
          fit="cover"
          x={0}
          y={0}
          width={width}
          height={height}
        />
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={colors}
          />
        </Rect>
      </Canvas>
    );
  };

  const _renderHeader = () => {
    if (currentStep === 0) {
      return;
    }

    return (
      <Box
        paddingTop={safeTop + 32}
        flexDirection="row"
        mx={10}
        justifyContent="space-between">
        <Heading
          fontSize={32}
          flexGrow={1}
          textAlign="center"
          fontFamily="SatoshiBold">
          CleanLabel
        </Heading>
      </Box>
    );
  };

  const animDot = useAnimatedStyle(() => {
    const clampedStep = Math.max(stepAnim.value - 1, 0);

    return {
      height: DOT_SIZE,
      borderRadius: DOT_SIZE,
      backgroundColor: '#FFF',
      position: 'absolute',
      width: clampedStep * (DOT_SIZE + DOT_SPACING) + DOT_SIZE,
    };
  });

  const _goToAuthScreen = async () => {
    navigation.navigate('Scan');
    AsyncStorage.setItem('WELCOME_STORAGE_KEY', 'true');
  };

  const _renderActions = () => {
    if (isLastStep) {
      return (
        <TouchableOpacity
          style={styles.buttonContainer}
          activeOpacity={0.6}
          onPress={_goToAuthScreen}>
          <Heading fontSize="$xl" textAlign="center">Start Scanning</Heading>
        </TouchableOpacity>
      );
    } else if (currentStep === 0) {
      return (
        <Heading
          fontSize="$xl"
          textAlign="center">
          Tap anywhere to begin
        </Heading>
      );
    } else {
      const steps = new Array(WELCOME_STEPS.length - 2).fill(0);
      return (
        <Box alignItems="center">
          <Box
            flexDirection="row"
            alignItems="center">
            {steps.map((_, index) => (
              <Box
                key={index}
                h={DOT_SIZE}
                w={DOT_SIZE}
                borderRadius={DOT_SIZE}
                backgroundColor="#59585E"
                mr={index < steps.length - 1 ? DOT_SPACING : 0}
              />
            ))}
            <Animated.View style={[styles.activeDot, animDot]} />
          </Box>
        </Box>
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => _onChangeStep(currentStep + 1)}>
      <Box
        width={width}
        height={height}>
        {_renderBackground()}
        {_renderHeader()}
        <Box flexGrow={1} />
        <Box alignItems="center">
          <RNImage
            source={stepContent.image}
            style={stepContent.imageStyle}
          />
          <Box h={110} />
          <Heading
            px="$4"
            fontFamily="SatoshiBold"
            fontSize={32}
            textAlign="center"
            letterSpacing={0.5}
            pb="$10">
            {stepContent.title}
          </Heading>
          <Heading
            px="$8"
            size="md"
            fontWeight="$medium"
            fontFamily="$heading"
            lineHeight={24}
            letterSpacing={0.5}
            textAlign="center">
            {stepContent.description}
          </Heading>
        </Box>
        <Box flexGrow={1} />
        {_renderActions()}
        <Box flexGrow={1} />
      </Box>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  buttonContainer: { marginHorizontal: 24 },
  buttonContent: {
    borderRadius: 100,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: { position: 'absolute' },
  activeDot: { height: 11, borderRadius: 11, backgroundColor: '#FFF', position: 'absolute' },
});
