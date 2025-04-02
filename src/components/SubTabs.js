import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getHeaderTitle} from '@react-navigation/elements';
import {Home} from './home';
import ScanComponent from './scan/index';
import IosScanComponent from './scan/ios';
import IosScanTestComponent from './scan/test';
import HistoryComponent from './scan/History';
import RecipesComponent from './recipe/Recipes';
import {Menu} from './menu/index';
import {Image, Platform} from 'react-native';

import {widthPixel, heightPixel} from '../config';

const Tab = createBottomTabNavigator();

function CustomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Scan"
      backBehaviour="initialRoute"
      screenOptions={{
        tabBarActiveTintColor: '#61a148',
        tabBarInactiveTintColor: '#000000',
        headerBackTitleVisible: true,
        tabBarStyle: {
          backgroundColor: '#efefef',
          paddingLeft: widthPixel(10),
          paddingRight: widthPixel(10),
          paddingBottom: heightPixel(12),
          paddingTop: heightPixel(5),
          height: heightPixel(70),
          borderTopColor: '#bbbbbb',
        },
        tabBarActiveBackgroundColor: '#efefef',
        tabBarShowLabel: true,
        tabBarItemStyle: {
          marginLeft: widthPixel(10),
          marginRight: widthPixel(10),
        },
        header: ({navigation, route, options}) => {
          const title = getHeaderTitle(options, route.name);
          return <></>;
        },
      }}>
      <Tab.Screen
        name="Scan"
        component={Platform.OS === 'ios' ? IosScanComponent : ScanComponent}
        options={{
          tabBarLabel: 'SCAN',
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                style={{
                  width: widthPixel(40),
                  height: widthPixel(40),
                  resizeMode: 'contain',
                }}
                source={require('../../assets/images/scan_active.png')}
              />
            ) : (
              <Image
                style={{
                  width: widthPixel(40),
                  height: widthPixel(40),
                  resizeMode: 'contain',
                }}
                source={require('../../assets/images/scan.png')}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Recipes"
        component={RecipesComponent}
        options={{
          tabBarLabel: 'RECIPES',
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                style={{
                  width: widthPixel(40),
                  height: widthPixel(40),
                  resizeMode: 'contain',
                }}
                source={require('../../assets/images/recipes_active.png')}
              />
            ) : (
              <Image
                style={{
                  width: widthPixel(40),
                  height: widthPixel(40),
                  resizeMode: 'contain',
                }}
                source={require('../../assets/images/recipes.png')}
              />
            ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryComponent}
        options={{
          tabBarLabel: 'HISTORY',
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                style={{
                  width: widthPixel(40),
                  height: widthPixel(40),
                  resizeMode: 'contain',
                }}
                source={require('../../assets/images/history_active.png')}
              />
            ) : (
              <Image
                style={{
                  width: widthPixel(40),
                  height: widthPixel(40),
                  resizeMode: 'contain',
                }}
                source={require('../../assets/images/history.png')}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarLabel: 'MENU',
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                style={{
                  width: widthPixel(40),
                  height: widthPixel(40),
                  resizeMode: 'contain',
                }}
                source={require('../../assets/images/menu_active.png')}
              />
            ) : (
              <Image
                style={{
                  width: widthPixel(40),
                  height: widthPixel(40),
                  resizeMode: 'contain',
                }}
                source={require('../../assets/images/menu.png')}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function SubTabs() {
  return <CustomTabs />;
}
