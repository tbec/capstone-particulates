import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from 'react-navigation'

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
    Map: Map,
    Setting: Settings,
    SetupNew: SetupNew,
    Sensor: Sensor,
    Tracker: Tracker
  },
  {
    initialRouteName: 'Home',
  }
);