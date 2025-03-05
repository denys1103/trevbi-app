import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { GlobalContext } from '../../context';
import Spinner from 'react-native-loading-spinner-overlay';
import CheckboxTree from 'react-native-tree-checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  fontPixel,
  heightPixel,
  widthPixel,
} from '../../config';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DietsScreen = ({ navigation }) => {
  const {
    isLoading,
    selectedDiets,
    setSelectedDiets,
  } = useContext(GlobalContext);
  const recursiveData = [
    {
      name: 'Keto Diet',
      icon: '',
      childs: [
        {
          name: 'Low-carb, high-fat, moderate protein diet',
          icon: '',
        },
        {
          name: 'Focuses on fats like avocado, olive oil, meat, and cheese',
          icon: '',
        },
        {
          name: 'Avoids grains, sugar, and high-carb foods',
          icon: '',
        },
        {
          name: 'Supports fat burning and metabolic flexibility',
          icon: '',
        },
        {
          name: 'Weight loss, blood sugar control, energy levels',
          icon: '',
        },
      ],
    },
    {
      name: 'Mediterranean Diet',
      icon: '',
    },
    {
      name: 'Plant-Based / Vegan',
      icon: '',
    },
    {
      name: 'Paleo Diet',
      icon: '',
    },
    {
      name: 'Carnivore Diet',
      icon: '',
    },
    {
      name: 'Pegan Diet',
      icon: '',
    },
    {
      name: 'Low-FODMAP Diet',
      icon: '',
    },
    {
      name: 'Whole30',
      icon: '',
    },
    {
      name: 'Biohacker Diets',
      icon: '',
    },
    {
      name: 'DASH Diet',
      icon: '',
    },
    {
      name: 'Autoimmune Protocol',
      icon: '',
    },
    {
      name: 'Gluten-Free Diet',
      icon: '',
    },
  ];
  
  const ref = useRef(null);

  // useEffect(() => {
  //   console.log('selectedDiets:', selectedDiets)
  // }, [selectedDiets]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }} >
        <Spinner visible={isLoading} />
        <View
          style={styles.backgroundStyle}>
          <View style={styles.wrapper}>
            <View style={styles.titleView}>
              <Text allowFontScaling={false}
                  style={[
                  styles.titleStyle,
                  {
                      fontFamily: 'LEMONMILK-Bold',
                  },
                  ]}>
                  Tap &#9662; for diet details. ☑ Select multiple diets for TREVBI AI to create custom recipes!
              </Text>
            </View>
            <View style={styles.descriptionView}>
              <CheckboxTree
                ref={ref}
                data={recursiveData}
                keyField="name"
                textField="name"
                childField="childs"
                textStyle={{ color: 'black' }}
                iconColor="black"
                iconSize={fontPixel(24)}
                openIcon={<AntDesign name="down" size={fontPixel(24)} />}
                closeIcon={<AntDesign name="right" size={fontPixel(24)} />}
                renderItem={({ item, isSelect, isOpen, onOpen, onClose, onSelect }) => (
                  <View style={styles.wrapItem}>
                    
                    <TouchableOpacity onPress={onSelect}>
                      <Ionicons
                        size={fontPixel(24)}
                        name={isSelect ? 'checkbox-outline' : 'square-outline'}
                      />
                    </TouchableOpacity>
                    <Text allowFontScaling={false} style={styles.name}>{item.name}</Text>
                    {isOpen ? (
                      <TouchableOpacity onPress={onClose}>
                        <AntDesign size={fontPixel(24)} name="right" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={onOpen}>
                        <AntDesign size={fontPixel(24)} name="down" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                onSelect={item => {
                  setSelectedDiets(item.join(', '));
                }}
              />
            </View>
            <View style={{ alignItems: 'center', position: 'absolute', bottom: heightPixel(30), }}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={async () => {
                  navigation.navigate('RecipeScan');
                }}>
                  <Text allowFontScaling={false} style={[
                    styles.text_button,
                    {
                      fontFamily: 'LEMONMILK-Medium',
                    },
                  ]}>Find my recipe!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  backgroundStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: fontPixel(18),
    color: 'black',
    padding: heightPixel(5),
  },
  titleView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  descriptionView: {
    width: '100%',
    paddingVertical: heightPixel(20),
    paddingHorizontal: heightPixel(10),
    height: '80%',
  },
  text_button: {
    fontSize: fontPixel(20),
    color: 'white',
  },
  button: {
    backgroundColor: '#063225aa',
    borderRadius: heightPixel(20),
    paddingVertical: heightPixel(15),
    paddingHorizontal: widthPixel(30),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: heightPixel(8),
  },
  icon: {
    marginHorizontal: heightPixel(8),
  },
  name: {
    fontSize: fontPixel(18),
    marginLeft: heightPixel(8),
  },
});

export default DietsScreen;
