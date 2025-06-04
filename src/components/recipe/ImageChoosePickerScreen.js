import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const ImagePickerScreen = ({userPhotoUri, aiImageUri, onSelect, onClose}) => {
  const [selected, setSelected] = useState('user');

  const handleSelect = () => {
    const chosenImage = selected === 'user' ? userPhotoUri : aiImageUri;
    onSelect(chosenImage);
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Image to Use</Text>
      <View style={styles.imageRow}>
        <TouchableOpacity
          style={[
            styles.imageContainer,
            selected === 'user' && styles.selected,
          ]}
          onPress={() => setSelected('user')}>
          <Image source={{uri: userPhotoUri}} style={styles.image} />
          <Text style={styles.label}>Your Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.imageContainer, selected === 'ai' && styles.selected]}
          onPress={() => setSelected('ai')}>
          <Image source={{uri: aiImageUri}} style={styles.image} />
          <Text style={styles.label}>AI Image</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSelect}>
        <Text style={styles.buttonText}>Use Selected Image</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImagePickerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: '600',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageContainer: {
    marginHorizontal: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    alignItems: 'center',
  },
  selected: {
    borderColor: '#007AFF',
  },
  image: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'cover',
  },
  label: {
    marginTop: 8,
    fontWeight: '500',
    color: '#333',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
