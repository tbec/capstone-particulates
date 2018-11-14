import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {nav_bar} from '../Components/nav_bar'

export default class Home extends Component<Props> {
    // need way to check if already setup or if this is first time - TC
    // Pass into home? - TC
    
    render() {
        return (
            <View>
            <nav_bar/>
            </View>
        );
    }
}