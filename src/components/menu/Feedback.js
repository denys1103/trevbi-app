import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {fontPixel, heightPixel} from '../../config';
import {GlobalContext} from '../../context';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const Feedback = ({navigation}) => {
  const {isLoading, checkEvent, saveFeedback} = useContext(GlobalContext);
  const [search, setSearch] = useState('');
  const [missingIngredient, setMissingIngredient] = useState('');
  const [challengeIngredient, setChallengeIngredient] = useState('');
  const [reportIssue, setReportIssue] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    const temp_feedback = {};
    if (missingIngredient || challengeIngredient || reportIssue || message) {
      temp_feedback.missingIngredient = missingIngredient;
      temp_feedback.challengeIngredient = challengeIngredient;
      temp_feedback.reportIssue = reportIssue;
      temp_feedback.message = message;
      saveFeedback(temp_feedback);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <Spinner visible={isLoading} />
          <View style={styles.overlay}>
            <Image
              style={styles.logoStyle}
              source={require('../../../assets/images/TREVBI_Transparent_Logo.png')}
            />
            <View style={styles.descriptionPanel}>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'LEMONMILK-Bold',
                  paddingTop: heightPixel(5),
                  color: 'black',
                  fontSize: fontPixel(16),
                  textAlign: 'center',
                }}>
                {`We value your input and invite\nyou to share your thoughts to\nhelp us improve trevbi`}
              </Text>
            </View>
          </View>
          <ImageBackground
            source={require('../../../assets/images/background_feedback.jpg')}
            resizeMode="fill"
            style={styles.wrapper}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'LEMONMILK-Medium',
                paddingTop: heightPixel(10),
                paddingLeft: Platform.OS === 'ios' ? SCREEN_WIDTH * 0.05 : 0,
                color: 'black',
                fontSize: fontPixel(18),
                alignSelf: 'left',
                width: '90%',
              }}>
              Feedback options:
            </Text>
            <Text allowFontScaling={false} style={styles.text_label}>
              Missing ingredient: "suggest an ingredient"
            </Text>
            <TextInput
              textAlignVertical="top"
              allowFontScaling={false}
              multiline={true}
              numberOfLines={3}
              style={styles.textInputStyle}
              value={missingIngredient}
              onChangeText={setMissingIngredient}
            />
            <Text allowFontScaling={false} style={styles.text_label}>
              Ingredient dispute: "challenge an ingredient"
            </Text>
            <TextInput
              textAlignVertical="top"
              allowFontScaling={false}
              multiline={true}
              numberOfLines={3}
              style={styles.textInputStyle}
              value={challengeIngredient}
              onChangeText={setChallengeIngredient}
            />
            <Text allowFontScaling={false} style={styles.text_label}>
              {`Technical issue or suggestion: "report\nissue/suggestion"`}
            </Text>
            <TextInput
              textAlignVertical="top"
              allowFontScaling={false}
              multiline={true}
              numberOfLines={3}
              style={styles.textInputStyle}
              value={reportIssue}
              onChangeText={setReportIssue}
            />
            <Text allowFontScaling={false} style={styles.text_label}>
              Message team trevbi:
            </Text>
            <TextInput
              textAlignVertical="top"
              allowFontScaling={false}
              multiline={true}
              numberOfLines={3}
              style={styles.textInputStyle}
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.7}
              onPress={handleSubmit}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.text_button,
                  {
                    fontFamily: 'LEMONMILK-Medium',
                  },
                ]}>
                Share feedback
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: heightPixel(20),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: SCREEN_HEIGHT,
    backgroundColor: 'white',
    marginBottom: heightPixel(100),
  },
  box: {
    padding: heightPixel(8),
    marginTop: 1,
    marginBottom: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContent: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: heightPixel(10),
  },
  overlay: {
    paddingTop: heightPixel(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoStyle: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.28 * 0.7,
    resizeMode: 'cover',
  },
  wrapper: {
    flexDirection: 'column',
    justifyContent: 'space-space',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.55,
  },
  text_button: {
    fontSize: fontPixel(18),
    color: 'white',
  },
  button: {
    marginTop: heightPixel(50),
    backgroundColor: '#063225',
    borderRadius: heightPixel(5),
    paddingVertical: heightPixel(10),
    paddingHorizontal: heightPixel(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputStyle: {
    borderColor: '#c0c0c0',
    borderWidth: heightPixel(1),
    borderRadius: heightPixel(5),
    color: '#4b4b4b',
    fontSize: fontPixel(18),
    height: heightPixel(48),
    paddingHorizontal: heightPixel(2),
    paddingVertical: heightPixel(0),
    width: '90%',
    fontFamily: 'LEMONMILK-Light',
  },
  descriptionPanel: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    paddingVertical: heightPixel(5),
    borderWidth: heightPixel(2),
    borderTopColor: 'black',
    borderBottomColor: 'black',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  text_label: {
    fontFamily: 'LEMONMILK-Medium',
    paddingVertical: heightPixel(5),
    paddingLeft: Platform.OS === 'ios' ? SCREEN_WIDTH * 0.05 : 0,
    color: 'black',
    fontSize: fontPixel(13),
    alignSelf: 'left',
    width: '90%',
  },
});

export default Feedback;
