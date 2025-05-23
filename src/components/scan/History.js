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
} from 'react-native';
import {fontPixel, heightPixel, appDir, indexFilePath} from '../../config';
import RNFS from 'react-native-fs';
import ViewDetailsComponent from './ViewDetails';
// import SearchBar from 'react-native-search-bar';
import {GlobalContext} from '../../context';
import {SearchBar} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ScanHistory = ({navigation}) => {
  const [historyData, setHistoryData] = useState([]);
  const [searchHistoryData, setSearchHistoryData] = useState([]);
  const [validEntriesData, setValidEntriesData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const {checkEvent} = useContext(GlobalContext);
  const [search, setSearch] = useState('');

  const createAppDir = async () => {
    if (!(await RNFS.exists(appDir))) {
      await RNFS.mkdir(appDir);
    }
    if (!(await RNFS.exists(indexFilePath))) {
      await RNFS.writeFile(indexFilePath, JSON.stringify([]));
    }
  };

  const fetchScanHistory = async () => {
    try {
      await createAppDir();
      if (await RNFS.exists(indexFilePath)) {
        const indexData = JSON.parse(await RNFS.readFile(indexFilePath));

        const validatedHistory = await Promise.all(
          indexData.map(async entry => {
            const photoExists = entry.photoPath
              ? await RNFS.exists(entry.photoPath)
              : false;
            const avoidExists = entry.avoidPath
              ? await RNFS.exists(entry.avoidPath)
              : false;
            const blockExists = entry.blockPath
              ? await RNFS.exists(entry.blockPath)
              : false;

            return photoExists && avoidExists && blockExists ? entry : null;
          }),
        );

        const validEntries = validatedHistory.filter(Boolean);
        setValidEntriesData(validEntries);
        await RNFS.writeFile(indexFilePath, JSON.stringify(validEntries));

        const historyEntries = await Promise.all(
          validEntries.map(async entry => {
            const avoidContent = await RNFS.readFile(entry.avoidPath, 'utf8');
            const parsedAvoidData = JSON.parse(avoidContent);
            const nameArray = parsedAvoidData.avoidIngredients.map(
              doc => doc.name,
            );

            const blockContent = await RNFS.readFile(entry.blockPath, 'utf8');
            const blockAvoidData = JSON.parse(blockContent);
            const txtArray = blockAvoidData.textBlocks.map(
              doc => doc.elementText,
            );

            return {
              ...entry,
              nameArray: nameArray.join(', '),
              txtArray: txtArray.join(' '),
            };
          }),
        );

        historyEntries.reverse();
        setHistoryData(historyEntries);
        setSearchHistoryData(historyEntries);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
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
        indexFilePath,
        JSON.stringify(updatedValidEntriesData),
      );
      setHistoryData(updatedHistory);
      const updatedSearchHistory = searchHistoryData.filter(
        entry => entry.photoPath !== item.photoPath,
      );
      setSearchHistoryData(updatedSearchHistory);
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const confirmDelete = item => {
    Alert.alert(
      'Delete History',
      'Are you sure you want to delete this history item?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => deleteHistoryItem(item)},
      ],
      {cancelable: true},
    );
  };

  useEffect(() => {
    fetchScanHistory();
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
              style={item.nameArray ? styles.title : styles.noAvoidStyle}
              numberOfLines={1}>
              {item.nameArray ? item.nameArray : 'No ingredients to avoid'}
            </Text>
            <Text
              allowFontScaling={false}
              style={styles.description}
              numberOfLines={1}>
              {item.txtArray}
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
        const itemData = item.nameArray
          ? item.nameArray.toUpperCase()
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
      <View style={{paddingHorizontal: '10%'}}>
        {/*<SearchBar
          backgroundColor={'transparent'}
          placeholder="Search Bad Ingredient"
          onChangeText={searchHistory}
          onSearchButtonPress={searchHistory}
          onCancelButtonPress={searchHistory}
        />*/}
        <SearchBar
          placeholder="Search Bad Ingredient"
          onChangeText={searchHistory}
          platform={Platform.OS === 'ios' ? 'ios' : 'android'}
          containerStyle={{
            borderRadius: heightPixel(20),
            marginBottom: heightPixel(10),
          }}
          inputContainerStyle={{borderRadius: heightPixel(20)}}
          searchIcon={Platform.OS === 'ios' ? {name: 'search'} : null}
          clearIcon={Platform.OS === 'ios' ? {name: 'close-circle'} : null}
          value={search}
          allowFontScaling={false}
        />
      </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: heightPixel(20),
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
  avatar: {
    width: heightPixel(180),
    height: heightPixel(180),
    borderRadius: heightPixel(90),
  },
  list: {
    paddingVertical: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
});

export default ScanHistory;
