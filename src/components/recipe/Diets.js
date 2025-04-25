import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import {GlobalContext} from '../../context';
import Spinner from 'react-native-loading-spinner-overlay';
import CheckboxTree from 'react-native-tree-checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {fontPixel, heightPixel, widthPixel} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const DietsScreen = ({navigation}) => {
  const {
    isLoading,
    selectedDiets,
    setSelectedDiets,
    selectedMeal,
    setSelectedMeal,
  } = useContext(GlobalContext);

  const toggleMeal = meal => {
    if (selectedMeal === meal) {
      setSelectedMeal(null);
    } else {
      setSelectedMeal(meal);
    }
  };

  const meals = [
    {key: 'breakfast', label: 'Breakfast'},
    {key: 'lunch', label: 'Lunch'},
    {key: 'dinner', label: 'Dinner'},
    {key: 'bake', label: 'Bake'},
  ];
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
    {
      name: 'DASH (Dietary Approaches to Stop Hypertension) Diet',
      icon: '',
      childs: [
        {
          name: 'Emphasizes fruits, vegetables, whole grains, low-fat dairy, and limits sodium intake.',
          icon: '',
        },
      ],
    },
    {
      name: 'Flexitarian Diet',
      icon: '',
      childs: [
        {
          name: 'Semi-vegetarian diet that allows occasional meat consumption.',
          icon: '',
        },
      ],
    },
    {
      name: 'Macro Diet',
      icon: '',
      childs: [
        {
          name: 'Dietary approach that focuses on tracking the intake of macronutrients.',
          icon: '',
        },
      ],
    },
    {
      name: 'Intermittent Fasting',
      icon: '',
      childs: [
        {
          name: 'Alternating periods of eating and fasting.',
          icon: '',
        },
      ],
    },
    {
      name: 'Mind Diet',
      icon: '',
      childs: [
        {
          name: 'Combines elements of the Mediterranean and DASH diets to improve brain health.',
          icon: '',
        },
      ],
    },
    {
      name: 'Anti-Inflammatory',
      icon: '',
      childs: [
        {
          name: 'Foods that reduce inflammation, such as fruits, vegetables, and omega-3 fatty acids.',
          icon: '',
        },
      ],
    },
    {
      name: 'Gut Health',
      icon: '',
      childs: [
        {
          name: 'Focus on foods that promote a healthy gut microbiome, such as fermented foods and prebiotics.',
          icon: '',
        },
      ],
    },
  ];

  const ref = useRef(null);

  // useEffect(() => {
  //   console.log('selectedMeal:', selectedMeal);
  // }, [selectedMeal]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <Spinner visible={isLoading} />
        <View style={styles.backgroundStyle}>
          <View style={styles.wrapper}>
            <View style={styles.titleView}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[
                  styles.goToBackBtnStyle,
                  {width: heightPixel(80), marginBottom: heightPixel(5)},
                ]}
                onPress={() => {
                  navigation.replace('RecipeWelcome');
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.titleStyle,
                    {
                      fontFamily: 'LEMONMILK-Bold',
                    },
                  ]}>
                  Tap
                </Text>
                <Ionicons
                  style={{paddingHorizontal: heightPixel(2)}}
                  color={'black'}
                  size={fontPixel(16)}
                  name={'caret-down-sharp'}
                />
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.titleStyle,
                    {
                      fontFamily: 'LEMONMILK-Bold',
                    },
                  ]}>
                  for diet details.
                </Text>
                <Ionicons
                  style={{paddingHorizontal: heightPixel(2)}}
                  size={fontPixel(24)}
                  name={'checkbox-outline'}
                />
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.titleStyle,
                    {
                      fontFamily: 'LEMONMILK-Bold',
                    },
                  ]}>
                  Select
                </Text>
              </View>
              <Text
                allowFontScaling={false}
                style={[
                  styles.titleStyle,
                  {
                    fontFamily: 'LEMONMILK-Bold',
                  },
                ]}>
                multiple diets for TREVBI AI to
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.titleStyle,
                  {
                    fontFamily: 'LEMONMILK-Bold',
                  },
                ]}>
                create custom recipes!
              </Text>
            </View>
            <View style={styles.descriptionView}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: heightPixel(6),
                  paddingBottom: heightPixel(10),
                }}>
                {meals.map(meal => (
                  <View
                    key={meal.key}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => toggleMeal(meal.key)}>
                      <Ionicons
                        size={fontPixel(24)}
                        name={
                          selectedMeal === meal.key
                            ? 'checkbox-outline'
                            : 'square-outline'
                        }
                      />
                    </TouchableOpacity>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: fontPixel(14),
                        color: 'black',
                        fontFamily: 'LEMONMILK-Light',
                        marginLeft: heightPixel(5),
                      }}>
                      {meal.label}
                    </Text>
                  </View>
                ))}
              </View>
              <CheckboxTree
                ref={ref}
                data={recursiveData}
                keyField="name"
                textField="name"
                childField="childs"
                textStyle={{color: 'black'}}
                renderItem={({
                  item,
                  isSelect,
                  isOpen,
                  onOpen,
                  onClose,
                  onSelect,
                }) => (
                  <View style={styles.wrapItem}>
                    {item.childs ? (
                      <TouchableOpacity onPress={onSelect}>
                        <Ionicons
                          size={fontPixel(24)}
                          name={
                            isSelect ? 'checkbox-outline' : 'square-outline'
                          }
                        />
                      </TouchableOpacity>
                    ) : (
                      <Text allowFontScaling={false} style={styles.name}>
                        &#8226;
                      </Text>
                    )}
                    <Text allowFontScaling={false} style={styles.name}>
                      {item.name}
                    </Text>
                    {item.childs ? (
                      isOpen ? (
                        <TouchableOpacity
                          style={{paddingHorizontal: heightPixel(5)}}
                          onPress={onClose}>
                          <Ionicons
                            color={'black'}
                            size={fontPixel(16)}
                            name={'caret-forward'}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{paddingHorizontal: heightPixel(5)}}
                          onPress={onOpen}>
                          <Ionicons
                            color={'black'}
                            size={fontPixel(16)}
                            name={'caret-down-sharp'}
                          />
                        </TouchableOpacity>
                      )
                    ) : (
                      <></>
                    )}
                  </View>
                )}
                onSelect={item => {
                  setSelectedDiets(item.join(', '));
                }}
              />
              <View
                style={{
                  width: SCREEN_WIDTH,
                  paddingHorizontal: heightPixel(8),
                  marginTop: heightPixel(-10),
                  backgroundColor: 'transparent',
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontSize: fontPixel(30),
                    textAlign: 'left',
                    color: 'black',
                    padding: heightPixel(0),
                  }}>
                  &#8595;
                </Text>
              </View>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.titleStyle,
                  {
                    fontFamily: 'LEMONMILK-Bold',
                    paddingBottom: heightPixel(10),
                    paddingTop: heightPixel(0),
                    fontSize: fontPixel(16),
                  },
                ]}>
                Click "next" to skip and scan
              </Text>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={async () => {
                  navigation.navigate('RecipeScan');
                }}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.text_button,
                    {
                      fontFamily: 'LEMONMILK-Medium',
                    },
                  ]}>
                  Next
                </Text>
              </TouchableOpacity>
              <Image
                style={styles.logoStyle}
                source={require('../../../assets/images/TREVBI_Transparent_Logo.png')}
              />
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
    paddingBottom: heightPixel(10),
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: fontPixel(18),
    color: 'black',
    padding: heightPixel(0),
  },
  titleView: {
    paddingTop: heightPixel(10),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  descriptionView: {
    width: '100%',
    paddingBottom: heightPixel(20),
    paddingHorizontal: heightPixel(10),
    height: '50%',
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
    paddingRight: heightPixel(20),
    marginVertical: heightPixel(3),
  },
  icon: {
    marginHorizontal: heightPixel(8),
  },
  name: {
    fontSize: fontPixel(18),
    marginLeft: heightPixel(8),
  },
  logoStyle: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.28 * 0.4,
    resizeMode: 'cover',
    marginTop: heightPixel(10),
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
  tabItemStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DietsScreen;
