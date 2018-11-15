import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Router from './Components/Navigation'
import Home from './Views/Home'


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Router/>
    );
  }
}