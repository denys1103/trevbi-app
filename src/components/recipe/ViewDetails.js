import React, {useEffect, useState, useContext} from 'react';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GlobalContext} from '../../context';
import FullScreenImageViewer from './FullScreenImageViewer';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const ViewDetailsScreen = ({item, onGoBack, setRecipes, navigation}) => {
  const {height} = useWindowDimensions();
  const [recipeResult, setRecipeResult] = useState(null);
  const [recipeImg, setRecipeImg] = useState(item.img ? item.img : '');
  const {cookbookRequest} = useContext(GlobalContext);
  const [viewerVisible, setViewerVisible] = useState(false);
  const handleImagePress = () => {
    setViewerVisible(true);
  };
  const loadData = async () => {
    try {
      setRecipeResult(item.text.replace(/[*!]/g, ''));
    } catch (error) {
      console.error('Error load item data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
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
              {/* <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  navigation.replace('EditRecipe', {
                    item: item,
                  });
                }}>
                <FontAwesome
                  size={fontPixel(28)}
                  name={'edit'}
                  style={{color: '#063225'}}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={async () => {
                  const temp_recipe = {};
                  temp_recipe.recipeId = item._id;
                  if (item.cookbook) {
                    temp_recipe.status = 0;
                    const recipeList = await cookbookRequest(temp_recipe);
                    item.cookbook = 0;
                    setRecipes(recipeList);
                  } else {
                    temp_recipe.status = 1;
                    const recipeList = await cookbookRequest(temp_recipe);
                    item.cookbook = 1;
                    setRecipes(recipeList);
                  }
                }}>
                <Image
                  style={{
                    width: heightPixel(30),
                    height: heightPixel(30),
                    resizeMode: 'cover',
                  }}
                  source={
                    item.cookbook
                      ? require('../../../assets/images/cookbook_active.png')
                      : require('../../../assets/images/cookbook.png')
                  }
                />
              </TouchableOpacity>
            </View>
            {/* <View style={styles.boxContent}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  width: '100%',
                  paddingBottom: heightPixel(5),
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={async () => {
                    const temp_recipe = {};
                    temp_recipe.recipeId = item._id;
                    if (item.cookbook) {
                      temp_recipe.status = 0;
                      const recipeList = await cookbookRequest(temp_recipe);
                      item.cookbook = 0;
                      setRecipes(recipeList);
                    } else {
                      temp_recipe.status = 1;
                      const recipeList = await cookbookRequest(temp_recipe);
                      item.cookbook = 1;
                      setRecipes(recipeList);
                    }
                  }}>
                  <Image
                    style={{
                      width: heightPixel(30),
                      height: heightPixel(30),
                      resizeMode: 'cover',
                    }}
                    source={
                      item.cookbook
                        ? require('../../../assets/images/cookbook_active.png')
                        : require('../../../assets/images/cookbook.png')
                    }
                  />
                </TouchableOpacity>
              </View>
            </View> */}
            <TouchableOpacity onPress={handleImagePress}>
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
            </TouchableOpacity>
            {recipeResult && (
              <ScrollView
                contentContainerStyle={{
                  paddingVertical: heightPixel(5),
                }}
                style={{
                  maxHeight:
                    height - heightPixel(100) - SCREEN_WIDTH * 0.28 * 0.6,
                }}>
                {recipeResult.split('\n').map((recipeItem, index) => (
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
      {viewerVisible && (
        <FullScreenImageViewer
          uri={recipeImageRootURL + recipeImg}
          onClose={() => setViewerVisible(false)}
        />
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
});

export default ViewDetailsScreen;
