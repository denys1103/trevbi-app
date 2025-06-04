import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  StatusBar,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import ZoomPanSwipeImage from './ZoomPanSwipeImage';
import {fontPixel, heightPixel} from '../../config';

const FullScreenImageViewer = ({uri, onClose}) => {
  return (
    <Modal
      visible={true}
      transparent={false}
      animationType="fade"
      presentationStyle="fullScreen">
      <GestureHandlerRootView style={{flex: 1}}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <ZoomPanSwipeImage source={{uri}} onClose={onClose} />
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  closeButton: {
    position: 'absolute',
    top:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + heightPixel(10)
        : heightPixel(50),
    right: heightPixel(20),
    zIndex: heightPixel(10),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: heightPixel(20),
    padding: heightPixel(10),
  },
  closeText: {
    fontSize: fontPixel(16),
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FullScreenImageViewer;
