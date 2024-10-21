/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './src/components/Navigation';
import {GlobalContextProvider} from './src/context/index';
import CustomisableAlert from 'react-native-customisable-alert';
import Toast from 'react-native-toast-message';

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <GlobalContextProvider>
        <Navigation />
        <CustomisableAlert
          dismissable
          titleStyle={{
            fontSize: 18,
            fontWeight: 'bold',
          }}
          btnLabelStyle={{
            color: 'white',
            paddingHorizontal: 55,
            textAlign: 'center',
            backgroundColor: '#1E90FF',
          }}
        />
        <Toast />
      </GlobalContextProvider>
    </NavigationContainer>
  );
}


export default App;
