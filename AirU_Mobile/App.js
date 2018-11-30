import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Router from './Components/Navigation'

// Main screen. Uses Router from Navigation to load home screen, 
// do not load <Home> in here directly.
type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Router/>
    );
  }
}