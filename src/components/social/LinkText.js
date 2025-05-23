import React from 'react';
import {Text, Linking, StyleSheet, View} from 'react-native';
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

  return <View style={styles.textContainer}>{renderTextWithLinks(text)}</View>;
};

export default LinkText;

const styles = StyleSheet.create({
  textContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    flexShrink: 1,
    paddingHorizontal: heightPixel(5),
  },
  text: {
    fontSize: fontPixel(20),
    color: 'black',
  },
  url: {
    fontSize: fontPixel(20),
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
