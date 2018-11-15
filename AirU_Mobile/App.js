import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Navigation from './Components/Navigation'


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Navigation/>
    );
  }
}