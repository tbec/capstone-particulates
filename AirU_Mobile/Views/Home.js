import React, {Component} from 'react';
import {View, TouchableHighlight, Text, ImageBackground, Image} from 'react-native';
import {NavigationActions} from 'react-navigation'
import styles from '../StyleSheets/Styles'

export default class Home extends Component<Props> {
    // need way to check if already registered and change options accordingly

    render() {
        return (
                <View style={styles.container}>
                    <ImageBackground source={require('../Resources/home_background.jpg')} style={{width: '100%', height: '100%'}}>
                        <View style={styles.header}>
                            <Image source={require('../Resources/AQ_Logo.png')} style={{width: '100%', height: '100%'}}/>
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
                        </ImageBackground>
                </View>
        );
    }
}