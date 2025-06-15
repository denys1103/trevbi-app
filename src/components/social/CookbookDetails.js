import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import {fontPixel, heightPixel, recipeImageRootURL} from '../../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const CookbookDetails = ({item, onGoBack}) => {
  const {height, width, scale} = useWindowDimensions();
  const [recipeResult, setRecipeResult] = useState(null);
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);
  const [title, setTitle] = useState(item.title ? item.title : 'No Title');
  const [recipeImg, setRecipeImg] = useState(item.img ? item.img : '');
  const [servings, setServings] = useState(
    item.servings ? item.servings.toString() : '',
  );
  const [cookTime, setCookTime] = useState(item.cookTime ? item.cookTime : '');
  const loadData = async () => {
    try {
      setRecipeResult(item.text);
    } catch (error) {
      console.error('Error load item data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      {!modalVisibleStatus && (
        <View style={styles.container}>
          <View style={StyleSheet.absoluteFill}>
            <View style={styles.scanPanelStyle}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: heightPixel(5),
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[styles.goToBackBtnStyle, {width: heightPixel(80)}]}
                  onPress={onGoBack}>
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
              </View>
              <View style={styles.boxContent}>
                <Text
                  allowFontScaling={false}
                  style={styles.recipeTitleStyle}
                  numberOfLines={1}>
                  {title}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingBottom: heightPixel(5),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <MaterialCommunityIcons
                      size={fontPixel(24)}
                      name={'account-supervisor-outline'}
                      style={{color: 'black'}}
                    />
                    <Text
                      allowFontScaling={false}
                      style={styles.recipeServingsStyle}
                      numberOfLines={1}>
                      {servings}
                    </Text>
                    <MaterialCommunityIcons
                      size={fontPixel(24)}
                      name={'clock-time-three-outline'}
                      style={{color: 'black', paddingLeft: heightPixel(5)}}
                    />
                    <Text
                      allowFontScaling={false}
                      style={styles.recipeServingsStyle}
                      numberOfLines={1}>
                      {cookTime}
                    </Text>
                  </View>
                </View>
              </View>
              <Image
                source={
                  recipeImg
                    ? {
                        uri: recipeImageRootURL + recipeImg,
                      }
                    : require('../../../assets/images/no_img.jpg')
                }
                style={styles.capturedImage}
              />
              {recipeResult && (
                <ScrollView
                  contentContainerStyle={{
                    paddingVertical: heightPixel(5),
                  }}
                  style={{
                    maxHeight:
                      height - heightPixel(100) - SCREEN_WIDTH * 0.28 * 0.6,
                  }}>
                  {recipeResult
                    .replace(/\*/g, '')
                    .split('\n')
                    .map((recipeItem, index) => (
                      <Text
                        allowFontScaling={false}
                        key={index}
                        style={styles.recipeItem}>
                        {recipeItem}
                      </Text>
                    ))}
                </ScrollView>
              )}
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
              <Image
                style={styles.logoStyle}
                source={require('../../../assets/images/TREVBI_Transparent_Logo.png')}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  scanPanelStyle: {
    padding: heightPixel(20),
    paddingTop: heightPixel(10),
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  capturedImage: {
    width: '100%',
    height: heightPixel(200),
  },
  recipeItem: {
    fontSize: fontPixel(14),
    color: '#2e2e34',
    marginBottom: heightPixel(3),
    fontFamily: 'LEMONMILK-Regular',
  },
  goToBackBtnStyle: {
    flexDirection: 'row',
    backgroundColor: '#063225',
    borderRadius: heightPixel(15),
    paddingVertical: heightPixel(5),
    paddingLeft: heightPixel(5),
    paddingRight: heightPixel(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoStyle: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.28 * 0.6,
    resizeMode: 'cover',
    marginTop: heightPixel(0),
    alignSelf: 'center',
  },
  boxContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: heightPixel(10),
  },
  recipeTitleStyle: {
    fontSize: fontPixel(18),
    color: 'black',
    fontFamily: 'LEMONMILK-Medium',
    textAlign: 'center',
    width: '100%',
  },
  recipeServingsStyle: {
    fontSize: fontPixel(16),
    color: 'black',
    fontFamily: 'LEMONMILK-Light',
    paddingHorizontal: heightPixel(5),
  },
});

export default CookbookDetails;
