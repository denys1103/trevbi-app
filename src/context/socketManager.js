import io from 'socket.io-client';
import {API, SOCKET_EVENTS} from './socketConfig';

class SocketManager {
  constructor(client_id, client_secret, server_address) {
    if (SocketManager._instance) return SocketManager._instance;
    SocketManager._instance = this;

    this.client_id = client_id;
    this.client_secret = client_secret;
    this.server_address = server_address;

    this.socket = io(server_address, {
      autoConnect: true,
      transports: ['websocket'],
    });
  }

  connect(user) {
    if (!this.socket.connected) {
      this.socket.connect();
    }

    this.socket.off('connect');
    this.socket.on('connect', () => {
      this.socket.emit(SOCKET_EVENTS.CONNECTED, {
        user,
        client_id: this.client_id,
        client_secret: this.client_secret,
      });
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECTED, () => {
      console.log('Server says disconnected');
    });
  }

  emitFollowRequest(senderid, receiverid) {
    this.socket.emit(SOCKET_EVENTS.FOLLOW_REQUEST, {
      senderid,
      receiverid,
    });
  }

  onFollowRequest(callback) {
    this.socket.off(SOCKET_EVENTS.FOLLOW_REQUEST);
    this.socket.on(SOCKET_EVENTS.FOLLOW_REQUEST, callback);
  }

  offAll() {
    Object.values(SOCKET_EVENTS).forEach(event => this.socket.off(event));
    this.socket.off('connect');
    this.socket.disconnect();
    SocketManager._instance = null;
  }
}

export default SocketManager;
