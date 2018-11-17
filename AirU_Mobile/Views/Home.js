import React, {Component} from 'react';
import {View, TouchableHighlight, Text, Image, Touchable} from 'react-native';
import {NavigationActions} from 'react-navigation'
import styles from '../StyleSheets/Styles'

export default class Home extends Component<Props> {
    // need way to check if already registered and change options accordingly
    // need to have display background image
    
    render() {
        return (
                <View style={styles.container}>
                    <View style={styles.header}>
                    {/* header image goes here */}
                    </View>
                    <View style={styles.home}>
                    <TouchableHighlight 
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate({
                            routeName: 'Tabs',
                            params: {},
                            action: NavigationActions.navigate({routeName: 'Setup'})})}>
                            <Text>Setup Sensor</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate({
                            routeName: 'Tabs',
                            params: {},
                            action: NavigationActions.navigate({routeName: 'Tracker'})})}>
                            <Text>Personal Tracker</Text>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate({
                            routeName: 'Tabs',
                            params: {},
                            action: NavigationActions.navigate({routeName: 'Map'})})}>
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
            </View>
        );
    }
}