import React, {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {GlobalContext} from '../../context';
import ViewDetailsComponent from './CookbookDetails';
import {
  fontPixel,
  heightPixel,
  imageURL,
  recipeImageRootURL,
} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const CookbookPage = ({navigation, route}) => {
  const {userid, userAvatar, userName} = route?.params || {};
  const {userInfo, getUserRecipeList} = useContext(GlobalContext);
  const [historyData, setHistoryData] = useState([]);
  const [searchHistoryData, setSearchHistoryData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const profile = userInfo.user;

  const fetchRecipesData = async () => {
    setRefreshing(true);
    fetchRecipesHistory();
    setRefreshing(false);
  };

  const fetchRecipesHistory = async () => {
    try {
      const validEntries = await getUserRecipeList(userid);
      setHistoryData(validEntries);
      setSearchHistoryData(validEntries);
    } catch (error) {
      console.error('Error fetching recipe history:', error);
    }
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
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.overlay}
          onPress={() => {
            if (userid) {
              if (userid == profile._id) {
                navigation.replace('SocialProfile');
              } else {
                navigation.replace('FeedPage', {userid});
              }
            }
          }}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={
                userAvatar
                  ? {
                      uri: imageURL + userAvatar,
                    }
                  : require('../../../assets/images/free_user.png')
              }
            />
            <Text
              allowFontScaling={false}
              style={[styles.fullnameStyle, {maxWidth: SCREEN_WIDTH * 0.9}]}>
              {userName ? userName : ''}
            </Text>
          </View>
          <Image
            style={styles.logoStyle}
            source={require('../../../assets/images/TREVBI_SOCIAL_LOGO_small.png')}
          />
        </TouchableOpacity>
        <FlatList
          data={searchHistoryData}
          keyExtractor={(item, index) => `${item._id}`}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text allowFontScaling={false} style={styles.emptyMessage}>
              There is no cookbook
            </Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchRecipesData()}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  overlay: {
    paddingTop: heightPixel(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: heightPixel(15),
    paddingBottom: heightPixel(20),
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-start',
    width: SCREEN_WIDTH * 0.6,
  },
  avatar: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: SCREEN_WIDTH * 0.075,
  },
  logoStyle: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.15,
    resizeMode: 'cover',
  },
  fullnameStyle: {
    textAlign: 'center',
    fontSize: fontPixel(18),
    color: 'black',
    paddingLeft: heightPixel(8),
    maxWidth: SCREEN_WIDTH * 0.45,
  },
  userAvatar: {
    width: heightPixel(60),
    height: heightPixel(60),
    borderRadius: heightPixel(30),
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
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
  image: {
    width: heightPixel(60),
    height: heightPixel(60),
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
});

export default CookbookPage;
