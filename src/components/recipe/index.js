import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RecipeWelcome from './Welcome';
import Diets from './Diets';
import RecipeScan from './RecipeScan';
import {HeaderBackButton} from '@react-navigation/elements';

const Stack = createNativeStackNavigator();

export function RecipeIndex() {
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => ({
        headerStyle: {backgroundColor: '#fff'},
        headerTintColor: '#222',
        headerLeft: () => (
          <HeaderBackButton
            labelVisible={false}
            tintColor={'#222'}
            onPress={() => navigation.replace('RecipeWelcome')}
          />
        ),
      })}>
      <Stack.Screen
        name="RecipeWelcome"
        component={RecipeWelcome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Diets"
        component={Diets}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RecipeScan"
        component={RecipeScan}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
