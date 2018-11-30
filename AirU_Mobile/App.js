import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Router from './Components/Navigation'

// Main screen. Uses Router from Navigation to load home screen, 
// do not load <Home> in here directly.
export default class App extends Component {
  render() {
    return (
      <Router/>
    );
  }
}