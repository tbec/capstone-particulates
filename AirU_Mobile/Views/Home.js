import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {TabNavigator} from '../Components/Navigation'
import {NavigationActions} from 'react-navigation'

export default class Home extends Component<Props> {
    // need way to check if already setup or if this is first time - TC
    // Pass into home? - TC
    
    render() {
        return (
            <View>
                <Text>Home Screen</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate({
                    routeName: 'Tabs',
                    params: {},
                    action: NavigationActions.navigate({routeName: 'Home'})})}>
                    <Image source={require("../Resources/Sensor.png")}/>
                </TouchableOpacity>
            </View>
        );
    }
}