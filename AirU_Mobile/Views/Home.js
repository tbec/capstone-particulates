import React, {Component} from 'react';
import {View, TouchableHighlight, Text} from 'react-native';
import {TabNavigator} from '../Components/Navigation'
import {NavigationActions} from 'react-navigation'
import styles from '../StyleSheets/Styles'

export default class Home extends Component<Props> {
    // need way to check if already setup or if this is first time, 
    // Pass into home? - TC
    
    render() {
        return (
            <View style={styles.home}>
                <Text>Here is text</Text>
                <TouchableHighlight 
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate({
                        routeName: 'Tabs',
                        params: {},
                        action: NavigationActions.navigate({routeName: 'Home'})})}>
                        <Text>Setup Sensor</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate({
                        routeName: 'Tabs',
                        params: {},
                        action: NavigationActions.navigate({routeName: 'Settings'})})}>
                        <Text>Personal Tracker</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate({
                        routeName: 'Tabs',
                        params: {},
                        action: NavigationActions.navigate({routeName: 'Settings'})})}>
                        <Text>Sensor Map</Text>
                </TouchableHighlight>
                <TouchableHighlight 
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate({
                        routeName: 'Tabs',
                        params: {},
                        action: NavigationActions.navigate({routeName: 'Settings'})})}>
                        <Text>Settings</Text>
                </TouchableHighlight> 
            </View>
        );
    }
}