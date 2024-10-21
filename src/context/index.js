import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../config';
import { baseURL } from '../config';
import { showAlert, closeAlert } from 'react-native-customisable-alert';
import NetInfo from '@react-native-community/netinfo';

export const GlobalContext = createContext({});
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      // Unsubscribe to network state updates
      unsubscribe();
    };
  }, []);

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);

      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
        if (userInfo.token) {
          client.defaults.headers.common.authorization = userInfo.token;
        }
      }

      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        userInfo,
        splashLoading,
        error,
        isConnected,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};
