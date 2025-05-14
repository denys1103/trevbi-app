import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {getLinkPreview} from 'link-preview-js';
import {fontPixel, heightPixel} from '../../config';

const LinkPreviewCard = ({text}) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const urlMatch = text?.match(/https?:\/\/[^\s]+/);
    if (urlMatch && urlMatch[0]) {
      getLinkPreview(urlMatch[0])
        .then(data => {
          setPreview(data);
        })
        .catch(err => console.warn('Preview fetch failed:', err));
    }
  }, [text]);

  if (!preview) return null;

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(preview.url)}
      style={styles.previewBox}>
      {preview.images?.[0] && (
        <Image source={{uri: preview.images[0]}} style={styles.previewImage} />
      )}
      <Text allowFontScaling={false} style={styles.previewTitle}>
        {preview.title}
      </Text>
      <Text
        allowFontScaling={false}
        numberOfLines={2}
        style={styles.previewDesc}>
        {preview.description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  previewBox: {
    borderWidth: heightPixel(1),
    borderColor: '#ddd',
    borderRadius: heightPixel(8),
    padding: heightPixel(10),
    backgroundColor: '#f9f9f9',
    marginTop: heightPixel(8),
  },
  previewImage: {
    width: '100%',
    height: heightPixel(180),
    borderRadius: heightPixel(6),
    marginBottom: heightPixel(8),
  },
  previewTitle: {
    fontWeight: 'bold',
    fontSize: fontPixel(16),
  },
  previewDesc: {
    fontSize: fontPixel(13),
    color: '#666',
  },
});

export default LinkPreviewCard;
