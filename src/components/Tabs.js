import React, {useContext} from 'react';
import {SocketContextProvider} from '../context/socket';
import {GlobalContext} from '../context';
import {SOCKET_SERVER} from '../context/socketConfig';
import {default as SubTabs} from './SubTabs';

function MyTabs() {
  const {userInfo, isLogin} = useContext(GlobalContext);
  const _user = userInfo.user;
  _user.id = _user._id;
  _user.name = _user.fullname;
  return (
    <SocketContextProvider
      user={_user}
      client_id={'trevbi_client_id'}
      client_secret={'trevbi_client_secret'}
      isLogin
      server_url={SOCKET_SERVER}>
      <SubTabs />
    </SocketContextProvider>
  );
}

export default function Tabs() {
  return <MyTabs />;
}
