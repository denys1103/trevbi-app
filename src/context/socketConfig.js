import {HOST_URL} from '@env';
export const SOCKET_SERVER = HOST_URL;

export const API = {
  GETLIST: 'chat/getUsersList',
};

export const SOCKET_EVENTS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  FOLLOW_REQUEST: 'follow-request',
};
