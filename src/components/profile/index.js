import React, {useState, useEffect, useContext} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {ProfileEdit} from './Edit';
import {Profile} from './Profile';

import {GlobalContext} from '../../context';

export function ProfileMenu({navigation, route}) {
  const {userInfo} = useContext(GlobalContext);
  useEffect(() => {
    if (!userInfo.token) {
      navigation.replace('Login');
    }
  }, [navigation, userInfo.token]);
  const [editVisible, setEditVisible] = useState(false);

  return (
    <SafeAreaView>
      <ScrollView>
        {editVisible ? (
          <ProfileEdit
            setEditVisible={setEditVisible}
            navigation={navigation}
          />
        ) : (
          <Profile setEditVisible={setEditVisible} navigation={navigation} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
