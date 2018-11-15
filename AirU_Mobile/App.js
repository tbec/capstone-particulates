import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from 'react-navigation'
import Home from './Views/Home'
import Settings from './Views/Settings'
import Map from './Views/Map'
import Tracker from './Views/Tracker'

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <RootStack/>
    );
  }
}

// Home screen and options
const RootStack = createStackNavigator(
  {
    Home: Home,
    // Settings: Settings,
    // Map: Map,
    // Tracker: Tracker
  },
  {
    initialRouteName: 'Home'
  }
);