import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {default as SocketManager} from './socketManager';
import NetInfo from '@react-native-community/netinfo';

export const SocketContext = createContext({});

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({
  children,
  user,
  server_url,
  client_id,
  client_secret,
  isLogin,
}) => {
  const socketManager = useRef(
    new SocketManager(client_id, client_secret, server_url),
  ).current;

  const user_id = user?.id || 0;
  const [checkFollowSocketEvent, setCheckFollowSocketEvent] = useState(false);
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

  useEffect(() => {
    if (!server_url) {
      console.warn('You have to provide server_url');
    }
    if (!client_id || !client_secret) {
      console.warn('You have to provide the client_id and client_secret');
    }
    if (!user) {
      console.warn('You have to provide the user');
    }
  }, []);

  const onFollowRequest = res => {
    setCheckFollowSocketEvent(!checkFollowSocketEvent);
  };

  useEffect(() => {
    if (user && isLogin) {
      const tmp_user = {id: user._id, name: user.fullname};
      socketManager.connect(tmp_user);
      socketManager.onFollowRequest(onFollowRequest);
    } else {
      socketManager.offAll();
    }
  }, [user, isLogin]);

  const followSocketRequest = receiverid => {
    socketManager.emitFollowRequest(user_id, receiverid);
  };

  return (
    <SocketContext.Provider
      value={{
        socketManager,
        followSocketRequest,
        checkFollowSocketEvent,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
