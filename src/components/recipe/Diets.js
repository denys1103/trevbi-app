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
          name: 'Best For: Weight loss, blood sugar control, energy levels',
          icon: '',
        },
      ],
    },
    {
      name: 'Mediterranean Diet',
      icon: '',
      childs: [
        {
          name: 'Rich in whole foods, lean proteins, and healthy fats',
          icon: '',
        },
        {
          name: 'Includes olive oil, fish, nuts, whole grains, fruits, and vegetables',
          icon: '',
        },
        {
          name: 'Limits processed foods, red meat, and refined sugars',
          icon: '',
        },
        {
          name: 'Best For: Heart health, longevity, anti-inflammatory benefits',
          icon: '',
        },
      ],
    },
    {
      name: 'Plant-Based / Vegan',
      icon: '',
      childs: [
        {
          name: 'No animal products, nutrient-dense plants, and whole foods',
          icon: '',
        },
        {
          name: 'Includes fruits, vegetables, legumes, nuts, and seeds',
          icon: '',
        },
        {
          name: 'Avoid meat, dairy, eggs, and processed animal products',
          icon: '',
        },
        {
          name: 'Best For: Ethical eating, weight management, reducing chronic disease risk',
          icon: '',
        },
      ],
    },
    {
      name: 'Paleo Diet',
      icon: '',
      childs: [
        {
          name: 'Whole, unprocessed foods based on ancestral eating',
          icon: '',
        },
        {
          name: 'Includes grass-fed meat, fish, nuts, fruits, and vegetables',
          icon: '',
        },
        {
          name: 'Avoid grains, dairy, legumes, and processed foods',
          icon: '',
        },
        {
          name: 'Best For: Digestion, inflammation reduction, and energy levels',
          icon: '',
        },
      ],
    },
    {
      name: 'Carnivore Diet',
      icon: '',
      childs: [
        {
          name: 'All-meat, zero-carb, high-fat diet',
          icon: '',
        },
        {
          name: 'Includes beef, pork, chicken, fish, eggs, and organ meats',
          icon: '',
        },
        {
          name: 'Avoid fruits, vegetables, grains, legumes, and processed food',
          icon: '',
        },
        {
          name: 'Best For: Simplicity, weight loss, mental clarity',
          icon: '',
        },
      ],
    },
    {
      name: 'Pegan Diet',
      icon: '',
      childs: [
        {
          name: 'A mix of Paleo and Vegan principles',
          icon: '',
        },
        {
          name: 'Includes mostly plants, with some high-quality animal proteins',
          icon: '',
        },
        {
          name: 'Avoid processed foods, dairy, refined grains',
          icon: '',
        },
        {
          name: 'Best For: Balanced, anti-inflammatory eating',
          icon: '',
        },
      ],
    },
    {
      name: 'Low-FODMAP Diet',
      icon: '',
      childs: [
        {
          name: 'Designed for gut health, reducing fermentable carbs',
          icon: '',
        },
        {
          name: 'Includes lean meats, eggs, lactose-free dairy, and low-FODMAP fruits & veggies',
          icon: '',
        },
        {
          name: 'Avoid onions, garlic, beans, wheat, dairy, and certain sweeteners',
          icon: '',
        },
        {
          name: 'Best For: IBS, bloating, digestive health',
          icon: '',
        },
      ],
    },
    {
      name: 'Whole30',
      icon: '',
      childs: [
        {
          name: 'A 30-day reset eliminating processed foods, sugars, and dairy',
          icon: '',
        },
        {
          name: 'Includes whole, nutrient-dense foods like meat, seafood, eggs, vegetables',
          icon: '',
        },
        {
          name: 'Avoid grains, dairy, legumes, added sugar, alcohol',
          icon: '',
        },
        {
          name: 'Best For: Food sensitivities, weight loss, metabolism reset',
          icon: '',
        },
      ],
    },
    {
      name: 'Biohacker Diets',
      icon: '',
      childs: [
        {
          name: 'Focuses on longevity, brain health, and metabolic flexibility',
          icon: '',
        },
        {
          name: 'Includes high-fat, nutrient-dense foods like MCT oil, wild-caught fish, grass-fed meat',
          icon: '',
        },
        {
          name: 'Avoid processed foods, sugar, high-glycemic carbs',
          icon: '',
        },
        {
          name: 'Best For: Cognitive function, anti-aging, mental clarity',
          icon: '',
        },
      ],
    },
    {
      name: 'DASH Diet',
      icon: '',
      childs: [
        {
          name: 'Designed for heart health and reducing hypertension',
          icon: '',
        },
        {
          name: 'Includes lean proteins, whole grains, fruits, vegetables, and healthy fats',
          icon: '',
        },
        {
          name: 'Limits sodium, processed foods, and excess sugar',
          icon: '',
        },
        {
          name: 'Best For: Heart disease prevention, blood pressure control',
          icon: '',
        },
      ],
    },
    {
      name: 'Autoimmune Protocol (AIP)',
      icon: '',
      childs: [
        {
          name: 'Eliminates inflammatory foods to help manage autoimmune diseases',
          icon: '',
        },
        {
          name: 'Includes grass-fed meat, wild-caught fish, bone broth, fermented foods',
          icon: '',
        },
        {
          name: 'Avoid grains, dairy, legumes, processed foods, nightshades',
          icon: '',
        },
        {
          name: 'Best For: Reducing inflammation, managing autoimmune conditions',
          icon: '',
        },
      ],
    },
    {
      name: 'Gluten-Free Diet',
      icon: '',
      childs: [
        {
          name: 'No gluten-containing grains like wheat, barley, and rye',
          icon: '',
        },
        {
          name: 'Includes gluten-free grains like quinoa, rice, buckwheat, and oats',
          icon: '',
        },
        {
          name: 'Avoid bread, pasta, baked goods containing wheat',
          icon: '',
        },
        {
          name: 'Best For: Celiac disease, gluten sensitivities',
          icon: '',
        },
      ],
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
                // openIcon={<AntDesign name="down" size={fontPixel(24)} />}
                closeIcon={<AntDesign name="right" size={fontPixel(24)} />}
                renderItem={({ item, isSelect, isOpen, onOpen, onClose, onSelect }) => (
                  <View style={styles.wrapItem}>
                    {item.childs ?
                      <TouchableOpacity onPress={onSelect}>
                        <Ionicons
                          size={fontPixel(24)}
                          name={isSelect ? 'checkbox-outline' : 'square-outline'}
                        />
                      </TouchableOpacity>
                      :
                      <Text allowFontScaling={false} style={styles.name}>&#8226;</Text>
                    }
                    <Text allowFontScaling={false} style={styles.name}>{item.name}</Text>
                    {item.childs ? 
                      (isOpen ? 
                        (
                          <TouchableOpacity style={{paddingHorizontal: heightPixel(5)}} onPress={onClose}>
                            <Ionicons
                              size={fontPixel(16)}
                              name={'caret-forward'}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity style={{paddingHorizontal: heightPixel(5)}} onPress={onOpen}>
                            <Ionicons
                              size={fontPixel(16)}
                              name={'caret-down-sharp'}
                            />
                          </TouchableOpacity>
                        )
                      ):<></>
                    }
                  </View>
                )}
                onSelect={item => {
                  setSelectedDiets(item.join(', '));
                }}
              />
            </View>
            <View style={{ alignItems: 'center', bottom: heightPixel(20), }}>
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
    height: '70%',
  },
  text_button: {
    fontSize: fontPixel(20),
    color: 'white',
  },
  button: {
    backgroundColor: '#063225',
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
