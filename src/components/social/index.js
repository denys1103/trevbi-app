import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SocialWelcome from './SocialWelcome';
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
            onPress={() => navigation.replace('SocialWelcome')}
          />
        ),
      })}>
      <Stack.Screen
        name="SocialWelcome"
        component={SocialWelcome}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
