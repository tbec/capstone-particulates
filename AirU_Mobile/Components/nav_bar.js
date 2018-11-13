/**
 * Bottom nav bar component on screen. 
 *  Sensor | Tracker | Map | Settings
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {createStackNavigator} from react-navigator

export default class NavBar extends Components<Props>
{
    render(){
        return(
            <View>
                <TouchableOpacity
                    Image src=""
                    onpress={() => this.props.navigation.navigate('Sensor')}
                />
                <TouchableOpacity
                    Image src=""
                    onpress={() => this.props.navigation.navigate('Tracker')}
                />
                <TouchableOpacity
                    Image src=""
                    onpress={() => this.props.navigation.navigate('Map')}
                />
                <TouchableOpacity
                    Image src=""
                    onpress={() => this.props.navigation.navigate('Settings')}
                />
            </View>
        )
    };
}