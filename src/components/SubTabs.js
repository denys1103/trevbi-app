import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CommonActions, useRoute} from '@react-navigation/native';
import {getHeaderTitle} from '@react-navigation/elements';
import {Home} from './home';
import ScanComponent from './scan/index';
import IosScanComponent from './scan/ios';
import IosScanTestComponent from './scan/test';
import {RecipeIndex} from './recipe/index';
import {SocialIndex} from './social/index';
import {Menu} from './menu/index';
import {Image, Platform, Text, StyleSheet} from 'react-native';

import {widthPixel, heightPixel, fontPixel} from '../config';

const Tab = createBottomTabNavigator();

function CustomTabs() {
  const route = useRoute();
  const initialTab = route.params?.screen || 'Scan';
  return (
    <Tab.Navigator
      initialRouteName={initialTab}
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
          tabBarLabel: ({color}) => (
            <Text allowFontScaling={false} style={[styles.tabLabel, {color}]}>
              SCAN
            </Text>
          ),
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                style={styles.menuImage}
                source={require('../../assets/images/scan_active.png')}
              />
            ) : (
              <Image
                style={styles.menuImage}
                source={require('../../assets/images/scan.png')}
              />
            ),
        }}
      />
      <Tab.Screen
        name="AIRecipes"
        component={RecipeIndex}
        options={{
          tabBarLabel: ({color}) => (
            <Text allowFontScaling={false} style={[styles.tabLabel, {color}]}>
              AI RECIPES
            </Text>
          ),
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                style={styles.menuImage}
                source={require('../../assets/images/ai_recipes_active.png')}
              />
            ) : (
              <Image
                style={styles.menuImage}
                source={require('../../assets/images/ai_recipes.png')}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Social"
        component={SocialIndex}
        options={{
          tabBarLabel: ({color}) => (
            <Text allowFontScaling={false} style={[styles.tabLabel, {color}]}>
              SOCIAL
            </Text>
          ),
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                style={styles.menuImage}
                source={require('../../assets/images/social_active.png')}
              />
            ) : (
              <Image
                style={styles.menuImage}
                source={require('../../assets/images/social.png')}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarLabel: ({color}) => (
            <Text allowFontScaling={false} style={[styles.tabLabel, {color}]}>
              MENU
            </Text>
          ),
          tabBarIcon: ({focused, color, size}) =>
            focused ? (
              <Image
                style={styles.menuImage}
                source={require('../../assets/images/menu_active.png')}
              />
            ) : (
              <Image
                style={styles.menuImage}
                source={require('../../assets/images/menu.png')}
              />
            ),
        }}
        listeners={({navigation, route}) => ({
          tabPress: e => {
            const state = navigation.getState();
            const tabIndex = state.routes.findIndex(r => r.key === route.key);
            const tabState = state.routes[tabIndex]?.state;

            if (tabState && tabState.name !== 'MenuList') {
              e.preventDefault();
              navigation.dispatch(
                CommonActions.navigate({name: 'MenuList', params: {}}),
              );
            }
          },
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: fontPixel(12),
    textAlign: 'center',
  },
  menuImage: {
    width: widthPixel(40),
    height: widthPixel(40),
    resizeMode: 'contain',
  },
});

export default function SubTabs() {
  return <CustomTabs />;
}
