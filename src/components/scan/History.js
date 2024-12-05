import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import {
  fontPixel,
  heightPixel,
  appDir,
  indexFilePath,
} from '../../config';
import RNFS from 'react-native-fs';

const ScanHistory = ({ navigation }) => {
  const [historyData, setHistoryData] = useState([]);

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
          indexData.map(async (entry) => {
            const photoExists = await RNFS.exists(entry.photoPath);
            const aboidExists = await RNFS.exists(entry.avoidPath);
            const blockExists = await RNFS.exists(entry.blockPath);

            return photoExists && aboidExists && blockExists ? entry : null;
          })
        );

        const validEntries = validatedHistory.filter(Boolean);

        await RNFS.writeFile(indexFilePath, JSON.stringify(validEntries));

        const historyEntries = await Promise.all(
          validEntries.map(async (entry) => {
            const avoidContent = await RNFS.readFile(entry.avoidPath, 'utf8');
            const parsedAvoidData = JSON.parse(avoidContent);
            const nameArray = parsedAvoidData.avoidIngredients.map(doc => doc.name);

            const blockContent = await RNFS.readFile(entry.blockPath, 'utf8');
            const blockAvoidData = JSON.parse(blockContent);
            const txtArray = blockAvoidData.textBlocks.map(doc => doc.elementText);

            return {...entry, nameArray: nameArray.join(', '), txtArray: txtArray.join(' ')};
          })
        );

        setHistoryData(historyEntries);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };
  useEffect(() => {
    fetchScanHistory();
  }, []);

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          // console.log('onpress');
          viewDetails(item)
        }}>
        <View style={styles.box}>
          <Image
            style={styles.image}
            source={{ uri: Platform.OS === 'ios' ? item.photoPath : `file://${item.photoPath}` }}
          />
          <View style={styles.boxContent}>
            <Text style={item.nameArray?styles.title:styles.noAvoidStyle} numberOfLines={1}>
              {item.nameArray?item.nameArray:'No ingredients to avoid'}
            </Text>
            <Text style={styles.description} numberOfLines={1}>
              {item.txtArray}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const viewDetails = async (item) => {
    try {
      const avoidContent = await RNFS.readFile(item.avoidPath, 'utf8');
      const parsedData = JSON.parse(avoidContent);
    } catch (error) {
      console.error('Error reading item details:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={historyData}
        keyExtractor={(item, index) => `${item.photoPath}-${index}`}
        renderItem={renderItem}
        // contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No history available</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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