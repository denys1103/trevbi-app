import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getHeaderTitle} from '@react-navigation/elements';
import {Home} from './home';
import {
  widthPixel,
} from '../config';

const Tab = createBottomTabNavigator();

function CustomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehaviour="initialRoute"
      screenOptions={{
        tabBarActiveTintColor: '#1da1f2',
        tabBarInactiveTintColor: '#000000',
        headerBackTitleVisible: true,
        tabBarStyle: {
          backgroundColor: '#efefef',
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 5,
          paddingTop: 5,
          height: widthPixel(60),
          borderTopColor: '#bbbbbb',
        },
        tabBarActiveBackgroundColor: '#efefef',
        tabBarShowLabel: true,
        tabBarItemStyle: {marginLeft: 10, marginRight: 10},
        header: ({navigation, route, options}) => {
          const title = getHeaderTitle(options, route.name);

          return <></>;
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'HOME',
        }}
      />
    </Tab.Navigator>
  );
}

export default function SubTabs() {
  return <CustomTabs />;
}