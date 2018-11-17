import {createBottomTabNavigator, createStackNavigator} from 'react-navigation'
import React from 'react';
import {Image} from 'react-native'
import Home from '../Views/Home'
import Settings from '../Views/Settings'
import Map from '../Views/Map'
import Tracker from '../Views/Tracker'
import Setup from '../Views/Setup/SetupNew'

/**
 * Navigator used for moving between screens. Update any new screen 
 * routes here as needed
 */

// Home screen and options
const TabNavigator = createBottomTabNavigator(
  {
    Setup: {screen: Setup},
    Tracker: {screen: Tracker},
    Map: {screen: Map},
    Settings: {screen: Settings}
  },
  {
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const {routeName} = navigation.state
        // update me with various images to display in tabs, icons 
        // would be ideal
        if (routeName == 'Setup') {
          return <Image/>
        }
        else if (routeName == 'Tracker') {
          return <Image/>
        }
        else if (routeName == 'Map') {
          return <Image/>
        }
        else if (routeName == 'Settings') {
          return <Image/>
        }
        else
          return <Image/>
        }
      })
  }
);

const Router = createStackNavigator(
  {
    Home: {screen: Home},
    Settings: {screen: Settings}, 
    Map: {screen: Map},
    Tracker: {screen: Tracker},
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