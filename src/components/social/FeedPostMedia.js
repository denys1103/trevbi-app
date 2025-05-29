import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import {fontPixel, heightPixel, postImageRootURL} from '../../config';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const AUTO_PLAY_INTERVAL = 3000;

const FeedPostMedia = ({
  media,
  isActive,
  isRepeat = false,
  width = SCREEN_WIDTH,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const flatListRef = useRef();

  useEffect(() => {
    if (isActive && media.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % media.length;
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          return nextIndex;
        });
      }, AUTO_PLAY_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [isActive, media.length]);

  const onScrollEnd = e => {
    const index = Math.floor(
      Math.floor(e.nativeEvent.contentOffset.x) / Math.floor(SCREEN_WIDTH),
    );
    setActiveIndex(index);
  };

  const toggleVideoPause = () => setIsVideoPaused(prev => !prev);

  const renderItem = ({item, index}) => {
    const isVideo = item.mime && item.mime.startsWith('video');
    const isCurrent = index === activeIndex;

    return (
      <View style={[styles.mediaContainer, {width}]}>
        {isVideo ? (
          <Video
            source={{uri: postImageRootURL + item.name}}
            style={styles.media}
            resizeMode="cover"
            muted
            repeat
            paused={
              !isRepeat ? !isCurrent || !isActive || isVideoPaused : false
            }
          />
        ) : (
          <Image
            source={{uri: postImageRootURL + item.name}}
            style={styles.media}
          />
        )}
      </View>
    );
  };

  return (
    <View style={[styles.postContainer, {width}]}>
      {/* MEDIA CAROUSEL */}
      <FlatList
        ref={flatListRef}
        data={media}
        horizontal
        pagingEnabled
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
      />

      {/* MEDIA DOT INDICATOR */}
      {media?.length > 1 && (
        <View style={styles.dotsContainer}>
          {media.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, activeIndex === i && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default FeedPostMedia;
const styles = StyleSheet.create({
  postContainer: {
    width: SCREEN_WIDTH,
    aspectRatio: 1,
    backgroundColor: 'transparent',
    marginBottom: heightPixel(16),
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: heightPixel(-15),
    marginBottom: heightPixel(4),
  },
  dot: {
    width: heightPixel(8),
    height: heightPixel(8),
    borderRadius: heightPixel(4),
    backgroundColor: '#ddd',
    marginHorizontal: heightPixel(4),
  },
  activeDot: {
    backgroundColor: '#333',
    width: heightPixel(10),
    height: heightPixel(10),
  },
});
