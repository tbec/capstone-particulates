import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Router from './Components/Navigation'
import Home from './Views/Home'

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