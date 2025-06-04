import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {
  fontPixel,
  heightPixel,
  recipeImageRootURL,
  widthPixel,
} from '../../config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ViewDetailsComponent from './ViewDetails';
import {GlobalContext} from '../../context';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const RecipesHistory = ({navigation}) => {
  const [historyData, setHistoryData] = useState([]);
  const [searchHistoryData, setSearchHistoryData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const {getRecipeList, deleteRecipe} = useContext(GlobalContext);

  const fetchRecipesHistory = async () => {
    try {
      const validEntries = await getRecipeList();
      setHistoryData(validEntries);
      setSearchHistoryData(validEntries);
    } catch (error) {
      console.error('Error fetching recipe history:', error);
    }
  };

  const deleteHistoryItem = async item => {
    try {
      deleteRecipe(item._id);
      const myRecipes = searchHistoryData.filter(
        entry => entry._id !== item._id,
      );
      setSearchHistoryData(myRecipes);
    } catch (error) {
      console.error('Error deleting recipe history item:', error);
    }
  };

  const confirmDelete = item => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe item?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => deleteHistoryItem(item)},
      ],
      {cancelable: true},
    );
  };

  useEffect(() => {
    fetchRecipesHistory();
  }, []);

  const handleItemClick = item => {
    setSelectedItem(item);
  };

  const goBackToHistory = () => {
    setSelectedItem(null);
  };

  if (selectedItem) {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <ViewDetailsComponent
          item={selectedItem}
          onGoBack={goBackToHistory}
          setRecipes={setSearchHistoryData}
        />
      </GestureHandlerRootView>
    );
  }

  const renderItem = ({item}) => (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          handleItemClick(item);
        }}>
        <View style={styles.box}>
          <Image
            style={styles.image}
            source={
              item.img
                ? {
                    uri: recipeImageRootURL + item.img,
                  }
                : require('../../../assets/images/no_img.jpg')
            }
          />
          <View style={styles.boxContent}>
            <Text
              allowFontScaling={false}
              style={styles.recipeTitleStyle}
              numberOfLines={1}>
              {item.title ? item.title : 'No title'}
            </Text>
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
                {item.servings ? item.servings.toString() : '0'}
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
                {item.cookTime ? item.cookTime : ''}
              </Text>
            </View>
          </View>
          <Image
            style={{
              width: heightPixel(40),
              height: heightPixel(40),
              resizeMode: 'cover',
            }}
            source={
              item.cookbook
                ? require('../../../assets/images/cookbook_active.png')
                : require('../../../assets/images/cookbook.png')
            }
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              confirmDelete(item);
            }}>
            <Ionicons
              size={fontPixel(40)}
              name={'trash'}
              style={{color: 'red'}}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {searchHistoryData.length > 0 && (
        <View style={{paddingVertical: heightPixel(10)}}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[
              styles.goToBackBtnStyle,
              {width: heightPixel(120), marginBottom: heightPixel(5)},
            ]}
            onPress={() => {
              navigation.navigate('AIRecipes', {screen: 'Diets'});
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
              Let's cook
            </Text>
          </TouchableOpacity>
          <Image
            style={styles.logoStyle}
            source={require('../../../assets/images/TREVBI_Logo.jpg')}
          />
        </View>
      )}
      {searchHistoryData.length > 0 ? (
        <FlatList
          data={searchHistoryData}
          keyExtractor={(item, index) => `${item._id}`}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text allowFontScaling={false} style={styles.emptyMessage}>
              No history available
            </Text>
          }
        />
      ) : (
        <View style={{flex: 1}}>
          <ImageBackground
            source={require('../../../assets/images/vegetables.jpg')}
            resizeMode="cover"
            style={styles.vegetablesStyle}>
            <View style={styles.overlay}>
              <Image
                style={styles.logoStyle}
                source={require('../../../assets/images/TREVBI_Logo.jpg')}
              />
            </View>
          </ImageBackground>
          <ImageBackground
            source={require('../../../assets/images/girl.jpg')}
            resizeMode="cover"
            style={styles.wrapper}>
            <View style={styles.descriptionView}>
              <Text allowFontScaling={false} style={styles.titleStyle}>
                Scan your fridge or
              </Text>
              <Text allowFontScaling={false} style={styles.titleStyle}>
                Pantry - instantly
              </Text>
              <Text allowFontScaling={false} style={styles.titleStyle}>
                Get AI recipe.
              </Text>
            </View>
            <View style={{paddingVertical: heightPixel(20)}}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.descriptionStyle,
                  {
                    paddingTop: heightPixel(10),
                  },
                ]}>
                {`You can also lay your\ningredients on your counter`}
              </Text>
            </View>
            <View style={styles.descriptionView}>
              <Text
                allowFontScaling={false}
                style={[styles.titleStyle, {fontSize: fontPixel(28)}]}>
                {`Dinner just\ngot smarter!`}
              </Text>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={async () => {
                  navigation.navigate('AIRecipes', {screen: 'Diets'});
                }}>
                <Text allowFontScaling={false} style={styles.text_button}>
                  Create
                </Text>
                <Text allowFontScaling={false} style={styles.text_button}>
                  AI RECIPES
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  image: {
    width: heightPixel(60),
    height: heightPixel(60),
  },
  box: {
    padding: heightPixel(8),
    marginTop: 1,
    marginBottom: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: heightPixel(10),
  },
  recipeTitleStyle: {
    fontSize: fontPixel(18),
    color: 'black',
    fontFamily: 'LEMONMILK-Medium',
  },
  recipeServingsStyle: {
    fontSize: fontPixel(16),
    color: 'black',
    fontFamily: 'LEMONMILK-Light',
    paddingHorizontal: heightPixel(5),
  },
  goToBackBtnStyle: {
    flexDirection: 'row',
    backgroundColor: '#063225',
    borderRadius: heightPixel(15),
    paddingVertical: heightPixel(5),
    paddingLeft: heightPixel(5),
    marginLeft: heightPixel(10),
    paddingRight: heightPixel(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
  vegetablesStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.7,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.28,
    resizeMode: 'cover',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingTop: heightPixel(10),
  },
  descriptionView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  descriptionStyle: {
    textAlign: 'center',
    fontSize: fontPixel(18),
    color: 'white',
    padding: heightPixel(8),
    fontFamily: 'LEMONMILK-Regular',
  },
  text_button: {
    fontSize: fontPixel(16),
    color: 'white',
    fontFamily: 'LEMONMILK-Medium',
  },
  button: {
    marginTop: heightPixel(10),
    backgroundColor: '#063225',
    borderRadius: heightPixel(24),
    paddingVertical: heightPixel(5),
    paddingHorizontal: widthPixel(20),
    marginBottom: heightPixel(10),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: heightPixel(0),
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxAndroid: {
    alignSelf: 'center',
    transform: [{scale: 1.5}],
    borderColor: 'white',
  },
  label: {
    fontSize: fontPixel(18),
    color: 'white',
    alignSelf: 'center',
    paddingLeft: widthPixel(5),
  },
  titleStyle: {
    textAlign: 'center',
    fontSize: fontPixel(24),
    color: 'white',
    padding: heightPixel(3),
    fontFamily: 'LEMONMILK-Medium',
  },
});

export default RecipesHistory;
