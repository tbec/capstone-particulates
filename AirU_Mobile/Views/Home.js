import React, {Component} from 'react';
import {View, TouchableHighlight, Text, ImageBackground, Image} from 'react-native';
import {NavigationActions} from 'react-navigation'
import  styles  from '../StyleSheets/Styles';
export default class Home extends Component<Props> {
    render() {
        return (
                <View style={styles.container}>
                    <ImageBackground source={require('../Resources/home_background.jpg')} style={{width: '100%', height: '100%'}}>
                        <View style={styles.header}>
                            <Image source={require('../Resources/AQ_Logo.png')} style={{width: '100%', height: '100%'}}/>
                        </View>
                        <View style={[styles.home, {flex: 100}]}>
                            {/* Setup/Sensor */}
                            <TouchableHighlight 
                                testID={'SensorButton'}
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate({
                                    routeName: 'Tabs',
                                    params: {},
                                    action: NavigationActions.navigate({routeName: 'Sensor'})})}>
                                    <Text style={styles.buttonText}>Sensor</Text>
                            </TouchableHighlight>
                            {/* Personal Exposure Tracker */}
                            <TouchableHighlight 
                                testID={'TrackerButton'}
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate({
                                    routeName: 'Tabs',
                                    params: {},
                                    action: NavigationActions.navigate({routeName: 'Tracker'})})}>
                                    <Text style={styles.buttonText}>Personal Tracker</Text>
                            </TouchableHighlight>
                            {/* AQandU Map page */}
                            <TouchableHighlight 
                                testID={'MapButton'}
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate({
                                    routeName: 'Tabs',
                                    params: {},
                                    action: NavigationActions.navigate({routeName: 'Map'})})}>
                                    <Text style={styles.buttonText}>Sensor Map</Text>
                            </TouchableHighlight>
                            {/* Settings */}
                            <TouchableHighlight 
                                testID={'SettingsButton'}
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate({
                                    routeName: 'Tabs',
                                    params: {},
                                    action: NavigationActions.navigate({routeName: 'Settings'})})}>
                                    <Text style={styles.buttonText}>Settings</Text>
                            </TouchableHighlight>
                            </View>
                        </ImageBackground>
                </View>
        );
    }
}