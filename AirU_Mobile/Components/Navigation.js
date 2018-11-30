import {createBottomTabNavigator, createStackNavigator} from 'react-navigation'
import {Platform} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
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
import Login from '../Views/Setup/Login'
import ReviewFirst from '../Views/Setup/ReviewFirst'
import Privacy from '../Views/Setup/Privacy'
import ConnectionSetup from '../Views/Setup/ConnectionSetup'
import Confirmation from '../Views/Setup/Confirmation'

// sensor
import Sensor from '../Views/Sensor/Sensor'

// sensor if needed

// tracker if needed

// settings if needed

/**
 * Navigator used for moving between screens using react-navigation library. 
 * Update any new screen routes here as needed. Note: there should only be 1 
 * navigator in a project, so do not add another stackNavigator
 */

// Tabs across bottom of screens
const TabNavigator = createBottomTabNavigator(
  {
    Setup: {screen: Setup},
    Sensor: {screen: Sensor},
    Tracker: {screen: Tracker},
    Map: {screen: Map},
    Settings: {screen: Settings}
  },
  {
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const {routeName} = navigation.state
        
        // Icons for bottom page, if update above add image here as well
        if (routeName == 'Setup') {
          return <Icon name={Platform.OS === "ios" ? "ios-analytics" : "md-analytics"} size={20}/>
        }
        else if (routeName == 'Tracker') {
          return <Icon name={Platform.OS === "ios" ? "ios-bonfire" : "md-bonfire"} size={20}/>
        }
        else if (routeName == 'Map') {
          return <Icon name={Platform.OS === "ios" ? "ios-map" : "md-map"} size={20}/>
        }
        else if (routeName == 'Settings') {
          return <Icon name={Platform.OS === "ios" ? "ios-settings" : "md-settings"} size={20}/>
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
    Login: {screen: Login},
    ReviewFirst: {screen: ReviewFirst}, 
    Privacy: {screen: Privacy}, 
    Confirmation: {screen: Confirmation}, 
    ConnectionSetup: {screen: ConnectionSetup},
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