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
} from 'react-native';
import {
  fontPixel,
  heightPixel,
  appDir,
  indexRecipeFilePath,
  widthPixel,
} from '../../config';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CheckBox from '@react-native-community/checkbox';
import ViewDetailsComponent from './ViewDetails';
import {GlobalContext} from '../../context';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const RecipesHistory = ({navigation}) => {
  const [historyData, setHistoryData] = useState([]);
  const [searchHistoryData, setSearchHistoryData] = useState([]);
  const [validEntriesData, setValidEntriesData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const {checkEvent} = useContext(GlobalContext);
  const [search, setSearch] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const createAppDir = async () => {
    if (!(await RNFS.exists(appDir))) {
      await RNFS.mkdir(appDir);
    }
    if (!(await RNFS.exists(indexRecipeFilePath))) {
      await RNFS.writeFile(indexRecipeFilePath, JSON.stringify([]));
    }
  };

  const fetchRecipesHistory = async () => {
    try {
      await createAppDir();
      if (await RNFS.exists(indexRecipeFilePath)) {
        const indexData = JSON.parse(await RNFS.readFile(indexRecipeFilePath));

        const validatedHistory = await Promise.all(
          indexData.map(async entry => {
            const photoExists = entry.photoPath
              ? await RNFS.exists(entry.photoPath)
              : false;
            const recipeExists = entry.recipePath
              ? await RNFS.exists(entry.recipePath)
              : false;

            return photoExists && recipeExists ? entry : null;
          }),
        );

        const validEntries = validatedHistory.filter(Boolean);
        setValidEntriesData(validEntries);
        await RNFS.writeFile(indexRecipeFilePath, JSON.stringify(validEntries));

        const historyEntries = await Promise.all(
          validEntries.map(async entry => {
            const recipeContent = await RNFS.readFile(entry.recipePath, 'utf8');
            const parsedRecipeData = JSON.parse(recipeContent);
            const extractedText = parsedRecipeData.recipe.split(
              'the ingredients detected in your photo.',
            )[1];
            const textPart = extractedText ? extractedText.slice(0, 100) : '';
            let cleanedTextPart = textPart.trim().replace(/\s*\n\s*/g, '');

            return {...entry, textPart: cleanedTextPart};
          }),
        );

        historyEntries.reverse();
        setHistoryData(historyEntries);
        setSearchHistoryData(historyEntries);
      }
    } catch (error) {
      console.error('Error fetching recipe history:', error);
    }
  };

  const deleteHistoryItem = async item => {
    try {
      const updatedValidEntriesData = validEntriesData.filter(
        entry => entry.photoPath !== item.photoPath,
      );
      setValidEntriesData(updatedValidEntriesData);
      const updatedHistory = historyData.filter(
        entry => entry.photoPath !== item.photoPath,
      );
      await RNFS.writeFile(
        indexRecipeFilePath,
        JSON.stringify(updatedValidEntriesData),
      );
      setHistoryData(updatedHistory);
      const updatedSearchHistory = searchHistoryData.filter(
        entry => entry.photoPath !== item.photoPath,
      );
      setSearchHistoryData(updatedSearchHistory);
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
  }, [checkEvent]);

  const handleItemClick = item => {
    setSelectedItem(item);
  };

  const goBackToHistory = () => {
    setSelectedItem(null);
  };

  if (selectedItem) {
    return (
      <ViewDetailsComponent item={selectedItem} onGoBack={goBackToHistory} />
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
            source={{
              uri:
                Platform.OS === 'ios'
                  ? item.photoPath
                  : `file://${item.photoPath}`,
            }}
          />
          <View style={styles.boxContent}>
            <Text
              allowFontScaling={false}
              style={styles.noAvoidStyle}
              numberOfLines={2}>
              {item.textPart ? item.textPart : 'No recipe'}
            </Text>
          </View>
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

  const searchHistory = text => {
    setSearch(text);
    if (text) {
      const newData = historyData.filter(item => {
        const itemData = item.textPart
          ? item.textPart.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setSearchHistoryData(newData);
    } else {
      setSearchHistoryData(historyData);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.overlay}>
        {/* <SearchBar
          placeholder="Search Bad Ingredient"
          onChangeText={searchHistory}
          platform={Platform.OS === 'ios' ? 'ios' : 'android'}
          containerStyle={{borderRadius:heightPixel(20), marginBottom:heightPixel(10)}}
          inputContainerStyle={{borderRadius:heightPixel(20)}}
          searchIcon={Platform.OS === 'ios' ? {name: 'search'} : null}
          clearIcon={Platform.OS === 'ios' ? {name: 'close-circle'} : null}
          value={search}
        /> */}
        {searchHistoryData.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.5}
            style={[
              styles.goToBackBtnStyle,
              {width: heightPixel(120), marginBottom: heightPixel(5)},
            ]}
            onPress={() => {
              navigation.navigate('Diets');
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
        )}
        <Image
          style={styles.logoStyle}
          source={require('../../../assets/images/TREVBI_Logo.jpg')}
        />
      </View>
      {searchHistoryData.length > 0 ? (
        <FlatList
          data={searchHistoryData}
          keyExtractor={(item, index) => `${item.photoPath}-${index}`}
          renderItem={renderItem}
          // contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text allowFontScaling={false} style={styles.emptyMessage}>
              No history available
            </Text>
          }
        />
      ) : (
        <>
          <Image
            style={styles.recipeScreenStyle}
            source={require('../../../assets/images/AI_RECIPE_SCREENS.jpg')}
          />
          <View style={styles.wrapper}>
            <View style={styles.descriptionView}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.titleStyle,
                  {
                    fontFamily: 'LEMONMILK-Bold',
                    paddingTop: heightPixel(10),
                  },
                ]}>
                No recipe? no problem!
              </Text>
            </View>
            <View style={styles.descriptionView}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'LEMONMILK-Regular',
                  fontSize: fontPixel(18),
                  textAlign: 'center',
                  color: 'black',
                }}>
                Snap a pic of your fridge or
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'LEMONMILK-Regular',
                  fontSize: fontPixel(18),
                  textAlign: 'center',
                  color: 'black',
                  paddingTop: heightPixel(10),
                }}>
                pantry—TREVBI AI will whip up the
              </Text>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'LEMONMILK-Regular',
                  fontSize: fontPixel(18),
                  textAlign: 'center',
                  color: 'black',
                  paddingTop: heightPixel(10),
                }}>
                perfect recipe for you!
              </Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('Diets');
                }}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.text_button,
                    {
                      fontFamily: 'LEMONMILK-Medium',
                    },
                  ]}>
                  Let's cook with ai
                </Text>
              </TouchableOpacity>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                  style={
                    Platform.OS === 'ios'
                      ? styles.checkbox
                      : styles.checkboxAndroid
                  }
                  boxType={'square'}
                />
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.label,
                    {
                      fontFamily: 'LEMONMILK-Light',
                    },
                  ]}>
                  DON'T SHOW THIS SCREEN AGAIN
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: heightPixel(20),
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    // alignItems: 'center',
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
  description: {
    fontSize: fontPixel(14),
    color: '#646464',
  },
  title: {
    fontSize: fontPixel(18),
    color: 'red',
  },
  noAvoidStyle: {
    fontSize: fontPixel(18),
    color: '#61a148',
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
  overlay: {
    paddingVertical: heightPixel(10),
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
  titleStyle: {
    textAlign: 'center',
    fontSize: fontPixel(24),
    color: 'black',
    padding: heightPixel(5),
  },
  recipeScreenStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.77,
    resizeMode: 'cover',
  },
  text_button: {
    fontSize: fontPixel(20),
    color: 'white',
  },
  button: {
    marginTop: heightPixel(10),
    backgroundColor: '#063225',
    borderRadius: heightPixel(20),
    paddingVertical: heightPixel(15),
    paddingHorizontal: widthPixel(20),
    marginBottom: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
  descriptionView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginVertical: heightPixel(10),
  },
  label: {
    fontSize: fontPixel(18),
    color: 'black',
    alignSelf: 'center',
    paddingLeft: widthPixel(5),
  },
});

export default RecipesHistory;
