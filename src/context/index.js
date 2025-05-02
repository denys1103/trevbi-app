import React, {createContext, useContext, useState, useEffect} from 'react';
import {
  Modal,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client, {fontPixel, heightPixel} from '../config';
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
  const [myPostList, setMyPostList] = useState([]);
  //modal setting start
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showModal = message => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
    setModalMessage('');
  };
  //modal setting end

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
      showModal('Check your internet connection.');
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
        showModal('Your account has been successfully created');
        navigation.replace('Login');
      } else {
        setIsLoading(false);
        showModal(data.message);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    if (!isConnected) {
      showModal('Check your internet connection.');
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
        showModal(data.message);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    if (!isConnected) {
      showModal('Check your internet connection.');
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
      showModal('Check your internet connection.');
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
        showModal('Profile picture has been updated.');
      } else {
        setIsLoading(false);
        showModal(data.message);
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
      showModal('Check your internet connection.');
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
        showModal('Updates saved!');
      } else {
        setIsLoading(false);
        showModal(data.message);
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
      showModal('Check your internet connection.');
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/save-feedback', {
        ...feedback,
      });

      if (data.success) {
        setIsLoading(false);
        showModal('Feedback shared!');
      } else {
        setIsLoading(false);
        showModal(data.message);
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
      showModal('Check your internet connection.');
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
        showModal(data.message);
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
      showModal('Check your internet connection.');
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
        showModal(data.message);
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
      showModal('Check your internet connection.');
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/follow-request', {id});

      if (data.success) {
        setIsLoading(false);
        userInfo.user = data.user;
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        showModal('Followed!');
      } else {
        setIsLoading(false);
        showModal(data.message);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const saveRecipe = async recipeId => {
    setIsLoading(true);
    if (!isConnected) {
      showModal('Check your internet connection.');
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/save-recipe', {
        recipeId,
      });

      if (data.success) {
        setIsLoading(false);
        showModal('The recipe has been saved!');
      } else {
        setIsLoading(false);
        showModal(data.message);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const getRecipeList = async () => {
    setIsLoading(true);
    if (!isConnected) {
      showModal('Check your internet connection.');
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/get-recipes', {});

      if (data.success) {
        setIsLoading(false);
        return data.recipes;
      } else {
        setIsLoading(false);
        showModal(data.message);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
        return [];
      }
    } catch (e) {
      setIsLoading(false);
      return [];
    }
  };

  const deleteRecipe = async recipeId => {
    setIsLoading(true);
    if (!isConnected) {
      showModal('Check your internet connection.');
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/del-recipe', {
        recipeId,
      });

      if (data.success) {
        setIsLoading(false);
        showModal('The recipe has been deleted!');
      } else {
        setIsLoading(false);
        showModal(data.message);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const uploadRecipeImg = async (...photodata) => {
    setIsLoading(true);
    if (!isConnected) {
      showModal('Check your internet connection.');
      setIsLoading(false);
      return;
    }
    try {
      const responseData = await fetch(baseURL + '/upload-recipeimg', {
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
        return data.img;
      } else {
        setIsLoading(false);
        showModal(data.message);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
        return null;
      }
    } catch (e) {
      setIsLoading(false);
      return null;
    }
  };

  const updateRecipeData = async (...recipe) => {
    setIsLoading(true);
    if (!isConnected) {
      showModal('Check your internet connection.');
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/update-recipe', {
        ...recipe,
      });

      if (data.success) {
        setIsLoading(false);
        showModal('Updates saved!');
        return data.recipes;
      } else {
        setIsLoading(false);
        showModal(data.message);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
        return [];
      }
    } catch (e) {
      setIsLoading(false);
      return [];
    }
  };

  const savePost = async (...photodata) => {
    setIsLoading(true);
    if (!isConnected) {
      showModal('Check your internet connection.');
      setIsLoading(false);
      return;
    }
    try {
      const responseData = await fetch(baseURL + '/upload-post', {
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
        setMyPostList(data.myposts);
        showModal('Your post has been successfully posted!');
      } else {
        setIsLoading(false);
        showModal(data.message);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
        setMyPostList([]);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const saveTxtPost = async (...photodata) => {
    setIsLoading(true);
    if (!isConnected) {
      showModal('Check your internet connection.');
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/upload-txtpost', {
        ...photodata,
      });
      if (data.success) {
        setIsLoading(false);
        showModal('Your post has been successfully posted!');
        setMyPostList(data.myposts);
      } else {
        setIsLoading(false);
        showModal(data.message);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
        setError(null);
        setMyPostList([]);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  const getMyPostList = async () => {
    setIsLoading(true);
    if (!isConnected) {
      showModal('Check your internet connection.');
      setIsLoading(false);
      return;
    }
    try {
      const {data} = await client.post('/get-myposts', {});

      if (data.success) {
        setIsLoading(false);
        setMyPostList(data.myposts);
      } else {
        setIsLoading(false);
        showModal(data.message);
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
        saveRecipe,
        getRecipeList,
        deleteRecipe,
        uploadRecipeImg,
        updateRecipeData,
        savePost,
        saveTxtPost,
        myPostList,
        getMyPostList,
        showModal,
        hideModal,
      }}>
      {children}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={hideModal}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalImageStyle}>
              <Image
                source={require('../../assets/images/TREVBI_Transparent_Logo.png')}
                style={{width: heightPixel(150), height: heightPixel(41.6)}}
              />
            </View>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GlobalContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: heightPixel(20),
    borderRadius: heightPixel(12),
    alignItems: 'center',
    minWidth: '70%',
  },
  modalText: {
    color: '#000',
    fontSize: fontPixel(18),
    marginBottom: heightPixel(16),
    // fontFamily: 'LEMONMILK-Light',
  },
  closeButton: {
    backgroundColor: '#063225',
    paddingHorizontal: heightPixel(20),
    paddingVertical: heightPixel(8),
    borderRadius: heightPixel(8),
  },
  closeButtonText: {
    color: '#fff',
    fontSize: fontPixel(16),
    // fontFamily: 'LEMONMILK-Light',
  },
  modalImageStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
