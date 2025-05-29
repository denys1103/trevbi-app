import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SocialWelcome from './SocialWelcome';
import SocialProfile from './SocialProfile';
import CreatePost from './CreatePost';
import FeedPage from './FeedPage';
import MembersPage from './MembersPage';
import {HeaderBackButton} from '@react-navigation/elements';

const Stack = createNativeStackNavigator();

export function SocialIndex() {
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => ({
        headerStyle: {backgroundColor: '#fff'},
        headerTintColor: '#222',
        headerLeft: () => (
          <HeaderBackButton
            labelVisible={false}
            tintColor={'#222'}
            onPress={() => navigation.replace('SocialProfile')}
          />
        ),
      })}>
      <Stack.Screen
        name="SocialProfile"
        component={SocialProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SocialWelcome"
        component={SocialWelcome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePost}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FeedPage"
        component={FeedPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MembersPage"
        component={MembersPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
