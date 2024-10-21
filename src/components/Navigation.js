import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {default as Tabs} from './Tabs';
import MainSplash from '../screens/MainSplash';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import RegisterScreen from '../screens/RegisterScreen';
import {GlobalContext} from '../context';
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {userInfo, splashLoading} = useContext(GlobalContext);
  return (
    <Stack.Navigator>
      {splashLoading ? (
        <Stack.Screen
          name="Splash Screen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
      ) : userInfo.token ? (
        <Stack.Screen
          name="Dashboard"
          component={Tabs}
          options={{headerShown: false}}
        />
      ) : (
        <>
          <Stack.Screen
            name="Splash"
            component={MainSplash}
            options={{headerShown: false}}
          />
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
