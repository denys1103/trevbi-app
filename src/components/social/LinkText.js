import React from 'react';
import {Text, Linking, StyleSheet} from 'react-native';
import {fontPixel, heightPixel} from '../../config';

const LinkText = ({text}) => {
  const renderTextWithLinks = input => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parts = input.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <Text
            key={index}
            style={styles.url}
            onPress={() => Linking.openURL(part)}
            allowFontScaling={false}>
            {part}
          </Text>
        );
      } else {
        return (
          <Text key={index} style={styles.text} allowFontScaling={false}>
            {part}
          </Text>
        );
      }
    });
  };

  return <Text style={styles.textContainer}>{renderTextWithLinks(text)}</Text>;
};

export default LinkText;

const styles = StyleSheet.create({
  textContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    flexShrink: 1,
  },
  text: {
    fontSize: fontPixel(18),
    color: 'black',
  },
  url: {
    fontSize: fontPixel(18),
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
