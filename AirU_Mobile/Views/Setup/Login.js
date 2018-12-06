/**
 * Pulls up iFrame for login page, afterwards pulls back info or token and saves locally
 */

import React, {Component} from 'react';
import {WebView, TouchableHighlight, View, Platform, AsyncStorage} from 'react-native';
import styles from '../../StyleSheets/Styles'
import Icon from 'react-native-vector-icons/Ionicons'

// WIP. Will need to go to correct URL, save token after login, and navigate to next page after done
export default class Login extends Component<Props> {

    login() {
        AsyncStorage.setItem('Login', 'Login');
        this.props.navigation.navigate('ReviewFirst');
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <WebView style={{flex: 10}} source={{uri: 'http://10.0.2.2:5000'}}/>
                <View style={styles.navBar}>
                    <TouchableHighlight 
                            style={styles.previousButton}
                            activeOpacity={30}
                            underlayColor="yellow"
                            onPress={() => this.props.navigation.navigate('Sensor')}>
                                <Icon name={Platform.OS === "ios" ? "ios-close" : "md-close"} size={40}/>
                    </TouchableHighlight>
                    <TouchableHighlight 
                            style={styles.nextButton}
                            activeOpacity={30}
                            underlayColor="yellow"
                            onPress={() => this.login()}>
                                <Icon name={Platform.OS === "ios" ? "ios-checkmark" : "md-checkmark"} size={40}/>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}