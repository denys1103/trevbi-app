import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileMenu} from '../profile/index';
import {MenuList} from './MenuList';
import Feedback from './Feedback';
import HowItWork from './HowItWork';
import SocialWelcome from './SocialWelcome';
import RecipesComponent from '../recipe/Recipes';
import {HeaderBackButton} from '@react-navigation/elements';

const Stack = createNativeStackNavigator();

export function Menu() {
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => ({
        headerStyle: {backgroundColor: '#fff'},
        headerTintColor: '#222',
        headerLeft: () => (
          <HeaderBackButton
            labelVisible={false}
            tintColor={'#222'}
            onPress={() => navigation.replace('MenuList')}
          />
        ),
      })}>
      <Stack.Screen
        name="MenuList"
        component={MenuList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HowItWorks"
        component={HowItWork}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Feedback"
        component={Feedback}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Recipes"
        component={RecipesComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileMenu}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="SocialWelcome"
        component={SocialWelcome}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
