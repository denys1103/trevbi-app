import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  useWindowDimensions,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import client, {fontPixel, heightPixel} from '../../config';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ViewDetailsScreen = ({item, onGoBack}) => {
  const {height, width, scale} = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [recipeResult, setRecipeResult] = useState(null);

  const loadData = async () => {
    try {
      setLoading(false);
      const recipeContent = await RNFS.readFile(item.recipePath, 'utf8');
      const parsedRecipeData = JSON.parse(recipeContent);
      setRecipeResult(parsedRecipeData.recipe);
      setLoading(true);
    } catch (error) {
      setLoading(true);
      console.error('Error load item data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Spinner visible={!loading} />
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.scanPanelStyle}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={[
                styles.goToBackBtnStyle,
                {width: heightPixel(80), marginBottom: heightPixel(5)},
              ]}
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
            <Image
              source={{
                uri:
                  Platform.OS === 'ios'
                    ? item.photoPath
                    : `file://${item.photoPath}`,
              }}
              style={styles.capturedImage}
            />
            {recipeResult && (
              <ScrollView
                contentContainerStyle={{
                  paddingVertical: heightPixel(5),
                }}
                style={{
                  maxHeight: height - heightPixel(100),
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
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  scanPanelStyle: {
    padding: heightPixel(20),
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
});

export default ViewDetailsScreen;
