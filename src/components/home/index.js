import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { PhotoRecognizer } from 'react-native-vision-camera-text-recognition';
const appDir = `${RNFS.DocumentDirectoryPath}/ScanHistory`;
const myJpg = require('../../../assets/scanTest01.jpg');

export function Home() {
  const [photoPath, setPhotoPath] = useState(null);

  useEffect(() => {
    const copyFileToAppDir = async () => {
      try {
        const dirExists = await RNFS.exists(appDir);
        if (!dirExists) {
          await RNFS.mkdir(appDir);
        }

        const photoFilePath = `${appDir}/photo_${Date.now()}.jpg`;
        const sourcePath = `${RNFS.MainBundlePath}/scanTest01.jpg`;
    
        await RNFS.copyFile(sourcePath, photoFilePath);
        const photoCopyURI = Platform.OS === 'ios' ? photoFilePath : `file://${photoFilePath}`;
        console.log('photoFilePath:', photoFilePath)
        const result = await PhotoRecognizer({
          uri:photoCopyURI,
          orientation: "landscapeLeft"
        })
        console.log(JSON.stringify(result, null, 2))

        setPhotoPath(photoCopyURI);

      } catch (error) {
        console.error('Error copying file:', error);
      }
    };

    copyFileToAppDir();
  }, []);
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={myJpg} />

      {photoPath && <Image style={styles.image} source={{ uri: photoPath }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
});
