import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {default as Tabs} from './Tabs';
import Welcome from '../screens/Welcome';
import BuzzAnimation from '../screens/BuzzAnimation';
import WelcomeSecond from '../screens/WelcomeSecond';
import WelcomeThird from '../screens/WelcomeThird';
import RecipeWelcome from './recipe/Welcome';
import Diets from './recipe/Diets';
import RecipeScan from './recipe/RecipeScan';
import TestRecipe from './recipe/TestRecipe';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import RegisterScreen from '../screens/RegisterScreen';
import {GlobalContext} from '../context';
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {userInfo, splashLoading} = useContext(GlobalContext);
  return (
    <Stack.Navigator key={userInfo?.token ? 'authenticated' : 'guest'}>
      {splashLoading ? (
        <Stack.Screen
          name="Splash Screen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
      ) : userInfo?.token ? (
        <>
          <Stack.Screen
            name="SplashThird"
            component={WelcomeThird}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Dashboard"
            component={Tabs}
            options={{headerShown: false}}
          />
          {/* <Stack.Screen
            name="RecipeWelcome"
            component={RecipeWelcome}
            options={{headerShown: false}}
          /> */}
          {/* <Stack.Screen
            name="Diets"
            component={Diets}
            options={{headerShown: false}}
          /> */}
          {/* <Stack.Screen
            name="RecipeScan"
            component={RecipeScan}
            options={{headerShown: false}}
          /> */}
        </>
      ) : (
        <>
          <Stack.Screen
            name="Splash"
            component={Welcome}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SplashSecond"
            component={WelcomeSecond}
            options={{headerShown: false}}
          />
          {/* <Stack.Screen
            name="SplashThird"
            component={WelcomeThird}
            options={{headerShown: false}}
          />
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
          <Stack.Screen
            name="Dashboard"
            component={Tabs}
            options={{headerShown: false}}
          /> */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
