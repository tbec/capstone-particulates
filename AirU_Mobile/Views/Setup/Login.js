/**
 * Pulls up iFrame for login page, afterwards pulls back info or token and saves locally
 */

import React, {Component} from 'react';
import {TouchableHighlight, View, Text, AsyncStorage,
         TextInput, Platform, KeyboardAvoidingView, Button, Image, ImageBackground} from 'react-native';
import styles from '../../StyleSheets/Styles'
import Icon from 'react-native-vector-icons/Ionicons'
import { LOGIN_NAME, LOGIN_TOKEN, TEST_MODE } from '../../Components/Constants'

// WIP. Will need to go to correct URL, save token after login, and navigate to next page after done
export default class Login extends Component<Props> {
    constructor(props) {
        super(props);
        this.login.bind(this)
        this.state = ({login: '', password: '', error: ''})
    }

    login() {
        // make API call to login passing in login/password

        // check information

        // if success:
        AsyncStorage.setItem(LOGIN_NAME, this.state.login);
        this.props.navigation.navigate('ReviewFirst');

        // if failed, updated message and display on screen
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.home}>
                <Image source={require('../../Resources/red_cloud.jpeg')} 
                                style={{flex: 2, width: 100, height: 50, alignContent: 'center', justifyContent: 'center'}}/>
                    <KeyboardAvoidingView style={{flex: 5}}>
                        <Text>Username</Text>
                        <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='Login' secureTextEntry={false} 
                                style={{borderWidth: 2, borderColor: 'black', 
                                width: '100%', height: 40, alignContent: 'center', justifyContent: 'center', paddingBottom: 10}}
                                onChangeText={(value) => {this.setState({login: value})}}
                                />
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView style={{flex: 5}}>
                        <Text>Password</Text>
                        <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='Password' secureTextEntry={true} 
                                style={{borderWidth: 2, borderColor: 'black', 
                                width: '100%', height: 40, alignContent: 'center', justifyContent: 'center', paddingBottom: 10}}
                                onChangeText={(value) => {this.setState({password: value})}}
                                />
                    </KeyboardAvoidingView>
                    <Button title="Connect"
                        onPress={() => this.login()}
                        color='red' 
                        disabled={(this.state.login == "" || this.state.password == "")}
                    />
                    <Text style={{flex: 2, color: "red"}}>
                        {this.state.error}
                    </Text>
                </View>
            </View>
        );
    }
}