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
  const {userid, userAvatar, userName, cookBookName} = route?.params || {};
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
    fetchRecipesHistory();
  };

  if (selectedItem) {
    return (
      <ViewDetailsComponent
        item={selectedItem}
        cookBookName={cookBookName}
        showEditAlert={userid == profile._id ? true : false}
        navigation={navigation}
        onGoBack={goBackToHistory}
      />
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
              {item.title ? item.title : ''}
            </Text>
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
        <Text
          allowFontScaling={false}
          style={styles.titleStyle}
          numberOfLines={1}>
          {cookBookName ? cookBookName : ''}
        </Text>
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
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: heightPixel(10),
  },
  boxContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    resizeMode: 'cover',
  },
  recipeTitleStyle: {
    fontSize: fontPixel(16),
    color: 'black',
    fontFamily: 'LEMONMILK-Medium',
    paddingVertical: heightPixel(10),
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
    width: '100%',
    textAlign: 'center',
    paddingBottom: heightPixel(10),
  },
});

export default CookbookPage;
