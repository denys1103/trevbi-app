import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {GlobalContext} from '../../context';
import {fontPixel, heightPixel, imageURL} from '../../config';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const CommentBottomSheet = React.forwardRef(
  ({postItem, onCommentBtnPress}, ref) => {
    const snapPoints = useMemo(() => ['100%'], []);
    const inputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const {userInfo, addComment, deleteComment, updateComment} =
      useContext(GlobalContext);
    const navigation = useNavigation();

    const animatedValue = useRef(new Animated.Value(0)).current;
    const emojis = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'];

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: text.trim().length > 0 ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [text]);

    const handleSheetChanges = useCallback(index => {
      const opened = index >= 0;
      setIsOpen(opened);
      if (opened) {
        setTimeout(() => inputRef.current?.focus(), 300);
      } else {
        Keyboard.dismiss();
      }
    }, []);

    const handleSend = async () => {
      if (!text.trim()) return;
      if (editingComment) {
        const updatedPost = await updateComment({
          id: postItem._id,
          commentId: editingComment._id,
          comment: text.trim(),
        });
        onCommentBtnPress(updatedPost);
        setEditingComment(null);
      } else {
        const updatedPost = await addComment({
          id: postItem._id,
          comment: text.trim(),
        });
        onCommentBtnPress(updatedPost);
        // const newComment = {
        //   id: Date.now().toString(),
        //   user: 'You',
        //   text: replyTo ? `↪ ${replyTo.user}: ${text}` : text,
        // };
        // setComments(prev => [newComment, ...prev]);
      }
      setText('');
      setReplyTo(null);
    };

    const onEditComment = async item => {
      setReplyTo(null);
      setEditingComment(item);
      setText(item.comment);
      inputRef.current?.focus();
    };

    const onDeleteComment = async commentId => {
      try {
        const updatedPost = await deleteComment({
          id: postItem._id,
          commentId,
        });
        onCommentBtnPress(updatedPost);
      } catch (err) {
        console.error(err);
      }
    };

    const handleLongPress = item => {
      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Cancel', 'Edit', 'Delete'],
            destructiveButtonIndex: 2,
            cancelButtonIndex: 0,
          },
          buttonIndex => {
            if (buttonIndex === 1) {
              onEditComment(item);
            } else if (buttonIndex === 2) {
              onDeleteComment(item._id);
            }
          },
        );
      } else {
        Alert.alert(
          'Comment Options',
          '',
          [
            {text: 'Edit', onPress: () => onEditComment(item)},
            {
              text: 'Delete',
              onPress: () => onDeleteComment(item._id),
              style: 'destructive',
            },
            {text: 'Cancel', style: 'cancel'},
          ],
          {cancelable: true},
        );
      }
    };

    const renderComment = ({item}) => (
      // <View style={styles.commentRow}>
      //   <Text allowFontScaling={false} style={styles.commentUser}>
      //     {item.userid.fullname}
      //   </Text>
      //   <Text allowFontScaling={false} style={styles.commentText}>
      //     {item.comment}
      //   </Text>
      //   <TouchableOpacity onPress={() => setReplyTo(item)}>
      //     <Text allowFontScaling={false} style={styles.replyButton}>
      //       Reply
      //     </Text>
      //   </TouchableOpacity>
      // </View>
      <View style={styles.commentRow}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            if (item.userid._id) {
              navigation.replace('FeedPage', {
                userid: item.userid._id,
              });
            }
          }}>
          <Image
            style={styles.userAvatar}
            source={
              item.userid?.avatar
                ? {
                    uri: imageURL + item.userid.avatar,
                  }
                : require('../../../assets/images/free_user.png')
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onLongPress={() => {
            if (item.userid._id) {
              if (item.userid._id === userInfo.user._id) {
                handleLongPress(item);
              }
            }
          }}
          style={styles.userBoxContent}>
          <Text allowFontScaling={false} style={styles.flexRow}>
            <Text allowFontScaling={false} style={styles.fullnameTextStyle}>
              {item.userid?.fullname ? `${item.userid.fullname} ` : ''}
            </Text>
            <Text allowFontScaling={false} style={styles.commentTextStyle}>
              {item.comment}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );

    if (!postItem) return null;

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enableDynamicSizing={false}
        keyboardBehavior={'interactive'}
        enablePanDownToClose>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? heightPixel(100) : 0}
          style={{flex: 1}}>
          <BottomSheetFlatList
            data={postItem?.comment || []}
            keyExtractor={item => item._id}
            renderItem={renderComment}
            contentContainerStyle={{backgroundColor: 'white', flexGrow: 1}}
          />
          <View style={styles.inputWrapper}>
            {replyTo && (
              <View style={styles.replyBanner}>
                <Text allowFontScaling={false} style={styles.replyText}>
                  Replying to {replyTo.user}
                </Text>
                <TouchableOpacity onPress={() => setReplyTo(null)}>
                  <Text allowFontScaling={false} style={styles.cancelReply}>
                    ×
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.emojiRowStyle}>
              {emojis.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setText(prev => prev + emoji)}
                  activeOpacity={0.7}
                  style={styles.emojiBtnStyle}>
                  <Text allowFontScaling={false} style={styles.emojiFontStyle}>
                    {emoji}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.inputRow}>
              <Image
                style={styles.userAvatar}
                source={
                  userInfo.user?.avatar
                    ? {
                        uri: imageURL + userInfo.user.avatar,
                      }
                    : require('../../../assets/images/free_user.png')
                }
              />
              <TextInput
                ref={inputRef}
                value={text}
                onChangeText={setText}
                placeholder="Add a comment..."
                style={styles.input}
                placeholderTextColor="#888"
                multiline
              />
              <Animated.View
                style={{
                  transform: [{scale: animatedValue}],
                  opacity: animatedValue,
                }}>
                <TouchableOpacity onPress={handleSend}>
                  <Ionicons name="send" size={fontPixel(24)} color="#007AFF" />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  },
);

export default CommentBottomSheet;

const styles = StyleSheet.create({
  commentRow: {
    flexDirection: 'row',
    marginBottom: heightPixel(12),
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    paddingBottom: heightPixel(8),
    paddingHorizontal: heightPixel(10),
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: heightPixel(2),
  },
  commentText: {
    marginBottom: heightPixel(4),
  },
  replyButton: {
    color: '#007AFF',
    fontSize: fontPixel(12),
  },
  inputWrapper: {
    width: '100%',
    paddingVertical: heightPixel(10),
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderColor: '#ccc',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: heightPixel(10),
  },
  input: {
    flex: 1,
    maxHeight: heightPixel(100),
    fontSize: fontPixel(16),
    paddingVertical: heightPixel(8),
    paddingHorizontal: heightPixel(12),
    backgroundColor: '#f1f1f1',
    borderRadius: heightPixel(20),
    marginRight: heightPixel(15),
    marginLeft: heightPixel(5),
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    padding: heightPixel(6),
    paddingHorizontal: heightPixel(12),
    borderRadius: heightPixel(12),
    marginBottom: heightPixel(6),
    marginHorizontal: heightPixel(10),
  },
  replyText: {
    flex: 1,
    color: '#007AFF',
  },
  cancelReply: {
    fontSize: fontPixel(18),
    color: '#007AFF',
    paddingHorizontal: heightPixel(8),
  },
  userBoxContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: heightPixel(10),
  },
  userAvatar: {
    width: heightPixel(40),
    height: heightPixel(40),
    borderRadius: heightPixel(20),
  },
  flexRow: {
    flexDirection: 'row',
    maxWidth: SCREEN_WIDTH - heightPixel(70),
  },
  fullnameTextStyle: {
    fontWeight: 'bold',
    fontSize: fontPixel(19),
    color: 'black',
  },
  commentTextStyle: {
    fontSize: fontPixel(18),
    color: 'black',
  },
  emojiRowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: heightPixel(10),
    marginBottom: heightPixel(6),
  },
  emojiBtnStyle: {
    backgroundColor: 'white',
    borderRadius: heightPixel(20),
    paddingHorizontal: heightPixel(10),
    paddingVertical: heightPixel(4),
    marginRight: heightPixel(8),
  },
  emojiFontStyle: {
    fontSize: fontPixel(18),
  },
});
