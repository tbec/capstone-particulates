// settings screen, currently used as dummy for testing navigation

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import NavBar from '../Components/NavBar'

export default class Settings extends Component<Props> {
    render() {
        return (
            <View>
                <Text>This is the settings screen</Text>
            </View>
        );
    }
}