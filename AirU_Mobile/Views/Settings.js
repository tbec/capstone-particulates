// settings screen

import React, {Component} from 'react';
import {Text, View, TouchableHighlight, ImageBackground} from 'react-native';
import styles from '../StyleSheets/Styles'

export default class Settings extends Component {
    render() {
        return (
            <View style={styles.container}>
            <ImageBackground source={require('../Resources/home_background.jpg')} style={{width: '100%', height: '100%'}}>
                    <View style={{flex: 1, alignContent: 'flex-start', 
                                    justifyContent: 'center', flexDirection: 'row', paddingTop: 20}}>
                        <Text>Settings</Text>
                    </View>
                    <View style={[styles.home, {flex: 10}]}>
                        <Setting text="Setting1"/>
                        <Setting text="Setting2"/>
                        <Setting text="Setting3"/>
                        <Setting text="Setting4"/>
                        <Setting text="Setting5"/>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

/**
 * Corresponds to a setting button. 
 * Values: 
 *  text: String - text to display on button
 *  action: action - action to perform onPress
 */
class Setting extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <TouchableHighlight 
                        style={styles.button}
                        activeOpacity={30}
                        underlayColor="yellow">
                    <Text>{this.props.text}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}