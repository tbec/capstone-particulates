// settings screen

import React, {Component} from 'react';
import {Text, View, TouchableHighlight, ImageBackground, Linking} from 'react-native';
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
                        <Setting text="Adjust WiFi Network" action={() => this.props.navigation.navigate('ConnectionSetup')}/>
                        <Setting text="Modify Privacy Setting" action={() => this.props.navigation.navigate('Privacy')}/>
                        <Setting text="Contact AirU" action={() => Linking.openURL('mailto:aqandu@utah.edu')}/>
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
        this.state = {action: props.action, text: props.text}
    }

    render() {
        return (
            <View>
                <TouchableHighlight 
                        style={styles.button}
                        activeOpacity={30}
                        underlayColor="yellow"
                        onPress={this.state.action}
                        >
                    <Text>{this.state.text}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}