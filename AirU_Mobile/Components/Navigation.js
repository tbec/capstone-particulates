import {createBottomTabNavigator, createStackNavigator} from 'react-navigation'
import React from 'react';
import {Image} from 'react-native'

// home
import Home from '../Views/Home'
import Settings from '../Views/Settings'
import Map from '../Views/Map'
import Tracker from '../Views/Tracker'
import Setup from '../Views/Setup/SetupNew'
import MountingSensor from '../Views/Setup/MountingSensor'

// setup
import ReviewFirst from '../Views/Setup/ReviewFirst'
import WiFiSetup from '../Views/Setup/WiFiSetup'
import Privacy from '../Views/Setup/Privacy'
import BluetoothSetup from '../Views/Setup/BluetoothSetup'
import Confirmation from '../Views/Setup/Confirmation'
import Sensor from '../Views/Sensor/Sensor'

// sensor if needed

// tracker if needed

// settings if needed

/**
 * Navigator used for moving between screens. Update any new screen 
 * routes here as needed
 */


// Tabs across bottom of screens
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

// top level navigator
const Router = createStackNavigator(
  {
    // home or tabs
    Home: {screen: Home},
    Settings: {screen: Settings}, 
    Map: {screen: Map},
    Tracker: {screen: Tracker},
    Tabs: {screen: TabNavigator, initalRouteName: 'Home'},
    // sensor setup
    ReviewFirst: {screen: ReviewFirst}, 
    WiFiSetup: {screen: WiFiSetup}, 
    Privacy: {screen: Privacy}, 
    Confirmation: {screen: Confirmation}, 
    BluetoothSetup: {screen: BluetoothSetup},
    MountingSensor: {screen: MountingSensor}, 
    //sensor screens
    Sensor: {screen: Sensor}
  },
  {
    initalRouteName: 'Home',
    navigationOptions: ({navigation}) => ({
      header: null
    }),
  },
);

export default Router