import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../config';
import {baseURL} from '../config';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';

export const GlobalContext = createContext({});
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalContextProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [checkEvent, setCheckEvent] = useState(false);
  const [selectedDiets, setSelectedDiets] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [userList, setUserList] = useState([]);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      // Unsubscribe to network state updates
      unsubscribe();
    };
  }, []);

  const register = async (name, email, password, Confpassword, navigation) => {
    setIsLoading(true);
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Check your internet connection.',
      });
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/create-user', {
        fullname: name,
        email,
        password,
        confirmPassword: Confpassword,
      });

      if (data.success) {
        let userInfo = data;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Alert',
          text2: 'Your account has been successfully created',
        });
        navigation.replace('Login');
      } else {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: data.message,
        });
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Check your internet connection.',
      });
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/sign-in', {
        email,
        password,
      });

      if (data.success) {
        let userInfo = data;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        if (data.token) {
          client.defaults.headers.common.authorization = data.token;
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: data.message,
        });
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Check your internet connection.',
      });
      setIsLoading(false);
      return;
    }
    client
      .post('/sign-out', {})
      .then(res => {
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
      })
      .catch(e => {
        setIsLoading(false);
      });
  };

  const uploadAvata = async (...photodata) => {
    setIsLoading(true);
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Check your internet connection.',
      });
      setIsLoading(false);
      return;
    }
    try {
      const responseData = await fetch(baseURL + '/upload-avata', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: client.defaults.headers.common.authorization,
        },
        body: photodata[0],
      });
      let data = await responseData.json();
      if (data.success) {
        setIsLoading(false);
        userInfo.user = data.user;
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setCheckEvent(!checkEvent);
        Toast.show({
          type: 'success',
          text1: 'Alert',
          text2: 'Profile picture has been updated.',
        });
      } else {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: data.message,
        });
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const saveProfile = async (...profile) => {
    setIsLoading(true);
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Check your internet connection.',
      });
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/save-profile', {
        ...profile,
      });

      if (data.success) {
        setIsLoading(false);
        userInfo.user = data.user;
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setCheckEvent(!checkEvent);
        Toast.show({
          type: 'success',
          text1: 'Alert',
          text2: 'Updates saved!',
        });
      } else {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: data.message,
        });
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const saveFeedback = async (...feedback) => {
    setIsLoading(true);
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Check your internet connection.',
      });
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/save-feedback', {
        ...feedback,
      });

      if (data.success) {
        setIsLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Alert',
          text2: 'Feedback shared!',
        });
      } else {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: data.message,
        });
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const getUserList = async () => {
    setIsLoading(true);
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Check your internet connection.',
      });
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/get-users', {});

      if (data.success) {
        setIsLoading(false);
        setUserList(data.users);
      } else {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: data.message,
        });
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const getFriendList = async () => {
    setIsLoading(true);
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Check your internet connection.',
      });
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/get-friends', {});

      if (data.success) {
        setIsLoading(false);
        setFriendList(data.friends);
      } else {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: data.message,
        });
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const followRequest = async id => {
    setIsLoading(true);
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Check your internet connection.',
      });
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/follow-request', {id});

      if (data.success) {
        setIsLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Alert',
          text2: 'Followed!',
        });
      } else {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Warning',
          text2: data.message,
        });
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

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
        checkEvent,
        setCheckEvent,
        selectedDiets,
        setSelectedDiets,
        selectedMeal,
        setSelectedMeal,
        register,
        login,
        logout,
        uploadAvata,
        saveProfile,
        saveFeedback,
        userList,
        getUserList,
        followRequest,
        friendList,
        getFriendList,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};
