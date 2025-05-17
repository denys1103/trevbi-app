import React, {useRef} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import CommentBottomSheet from './CommentBottomSheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PostItem = () => {
  const commentSheetRef = useRef(null);

  const openComments = () => {
    commentSheetRef.current?.snapToIndex(0);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableOpacity onPress={openComments}>
        <Ionicons name="chatbubble-outline" size={24} color="black" />
      </TouchableOpacity>
      <CommentBottomSheet ref={commentSheetRef} />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PostItem;
