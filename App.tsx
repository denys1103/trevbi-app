/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './src/components/Navigation';
import {GlobalContextProvider} from './src/context/index';
import Toast from 'react-native-toast-message';
import {StyledProvider} from '@gluestack-style/react';
import {theme} from './src/config';

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <GlobalContextProvider>
        <StyledProvider config={theme}>
          <Navigation />
        </StyledProvider>
        <Toast />
      </GlobalContextProvider>
    </NavigationContainer>
  );
}

export default App;
