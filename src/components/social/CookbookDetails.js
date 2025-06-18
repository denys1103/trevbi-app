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
  Platform,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import {fontPixel, heightPixel, recipeImageRootURL} from '../../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Share from 'react-native-share';
import {GlobalContext} from '../../context';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const CookbookDetails = ({
  item,
  cookBookName,
  showEditAlert,
  navigation,
  onGoBack,
}) => {
  const {height, width, scale} = useWindowDimensions();
  const [recipeResult, setRecipeResult] = useState(null);
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);
  const [title, setTitle] = useState(item.title ? item.title : '');
  const [recipeImg, setRecipeImg] = useState(item.img ? item.img : '');
  const [servings, setServings] = useState(
    item.servings ? item.servings.toString() : '',
  );
  const [cookTime, setCookTime] = useState(item.cookTime ? item.cookTime : '');
  const {cookbookRequest} = useContext(GlobalContext);
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

  const onEditCookBook = async item => {
    navigation.navigate('Menu', {
      screen: 'Recipes',
      params: {selectitem: item},
    });
  };

  const onShareCookBook = async item => {
    const recipeImageUrl = recipeImg ? recipeImageRootURL + recipeImg : '';
    // const shareLink = `https://myapp.com/post/${post._id}`;
    const shareLink = `https://www.trevbi.com/beta`;
    const shareOptions = {
      title: item.title ? item.title : '',
      message: `Take a look at this! \n\n${shareLink}`,
      url: recipeImageUrl,
      failOnCancel: false,
    };
    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const onDeleteCookBook = async id => {
    try {
      const temp_recipe = {};
      temp_recipe.recipeId = id;
      temp_recipe.status = 0;
      await cookbookRequest(temp_recipe);
      onGoBack();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCookBookEditPress = item => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Edit', 'Share', 'Delete'],
          destructiveButtonIndex: 3,
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            onEditCookBook(item);
          } else if (buttonIndex === 2) {
            onShareCookBook(item);
          } else if (buttonIndex === 3) {
            onDeleteCookBook(item._id);
          }
        },
      );
    } else {
      Alert.alert(
        'Options',
        '',
        [
          {text: 'Edit', onPress: () => onEditCookBook(item)},
          {text: 'Share', onPress: () => onShareCookBook(item)},
          {
            text: 'Delete',
            onPress: () => onDeleteCookBook(item._id),
            style: 'destructive',
          },
          {text: 'Cancel', style: 'cancel'},
        ],
        {cancelable: true},
      );
    }
  };

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
              {showEditAlert ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.boxContent}
                  onPress={() => {
                    handleCookBookEditPress(item);
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.titleStyle,
                      {flex: 1, paddingLeft: heightPixel(20)},
                    ]}
                    numberOfLines={1}>
                    {cookBookName ? cookBookName : ''}
                  </Text>
                  <Entypo
                    size={fontPixel(18)}
                    name={'dots-three-vertical'}
                    style={styles.iconStyle}
                  />
                </TouchableOpacity>
              ) : (
                <Text
                  allowFontScaling={false}
                  style={[styles.titleStyle, {paddingVertical: heightPixel(5)}]}
                  numberOfLines={1}>
                  {cookBookName ? cookBookName : ''}
                </Text>
              )}
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
              <Text
                allowFontScaling={false}
                style={styles.recipeTitleStyle}
                numberOfLines={1}>
                {title}
              </Text>
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
                    .replace(/[*!]/g, '')
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    paddingVertical: heightPixel(5),
  },
  recipeTitleStyle: {
    fontSize: fontPixel(16),
    color: 'black',
    fontFamily: 'LEMONMILK-Medium',
    textAlign: 'center',
    width: '100%',
    paddingVertical: heightPixel(5),
  },
  recipeServingsStyle: {
    fontSize: fontPixel(16),
    color: 'black',
    fontFamily: 'LEMONMILK-Light',
    paddingHorizontal: heightPixel(5),
  },
  titleStyle: {
    fontSize: fontPixel(18),
    color: 'black',
    fontFamily: 'LEMONMILK-Medium',
    textAlign: 'center',
    // flex: 1,
  },
  iconStyle: {
    color: 'black',
    marginLeft: heightPixel(10),
  },
});

export default CookbookDetails;
