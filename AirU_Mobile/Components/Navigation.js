import {createBottomTabNavigator, createStackNavigator} from 'react-navigation'
import React from 'react';
import {Image} from 'react-native'
import Home from '../Views/Home'
import Settings from '../Views/Settings'
import Map from '../Views/Map'
import Tracker from '../Views/Tracker'

/**
 * Navigator used for moving between screens. Update any new screen 
 * routes here as needed
 */

// Home screen and options
const TabNavigator = createBottomTabNavigator(
  {
    Home: {screen: Home},
    Settings: {screen: Settings}
  },
  {
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const {routeName} = navigation.state
        // update me with various images to display in tabs, icons 
        // would be ideal
        if (routeName == 'Home') {
          return <Image source={require("../Resources/Sensor.png")}/>
        }
        else {
          return <Image/>
        }
      }})
  }
);

const Router = createStackNavigator(
  {
    Home: {screen: Home, },
    Settings: {screen: Settings, },
    Tabs: {screen: TabNavigator, initalRouteName: 'Home'}
  },
  {
    initalRouteName: 'Home',
    navigationOptions: ({navigation}) => ({
      header: null
    }),
  },
);

export default Router