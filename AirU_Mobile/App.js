import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

type Props = {};
export default class App extends Component<Props> {

  // need way to check if already setup or if this is first time - TC
  // Pass into home? - TC
  
  render() {
    return (
      <View style={styles.container}>
        <Home/>
      </View>
    );
  }
}