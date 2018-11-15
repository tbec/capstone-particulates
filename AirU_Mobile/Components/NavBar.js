import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {styles} from '../StyleSheets/Styles'
import {Navigation} from './Navigation'

export default class NavBar extends Component<Props>
{
    render(){
        return(
            <View style={styles.navBar}>
                <Text>NavBar</Text>
                {/* settings */}
                <TouchableOpacity onPress={() => Navigation.push('Settings')}>
                    <Image source={require("../Resources/Sensor.png")}/>
                </TouchableOpacity>
            </View>
        )
    };
}