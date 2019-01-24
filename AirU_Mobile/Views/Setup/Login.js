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

    async login() {
        if (TEST_MODE == true && this.state.login != "TEST") {
            this.setState({ error: "Invalid username or password" })
            return
        }

        // make API call to login passing in login/password
        let result = await JSON.parse(webCall());

        // parse information and check validity


        // if success:
        AsyncStorage.setItem(LOGIN_NAME, this.state.login);
        this.props.navigation.navigate('ReviewFirst');

        // if failed, updated message and display on screen
    }

    async webCall() {
        return fetch('https://neat-environs-205720.appspot.com/ENDPOINT', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstParam: this.state.login,
              secondParam: this.state.password,
            }),
          })
          .then((response) => response.json())
          .then((json) => { return json })
          .catch((error) => { console.error(error)})
    }

    render() {
        return (
            <View style={styles.container}>
                    <View style={{flex: 20, backgroundColor: '#b3e6ff'}}>
                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', paddingTop: 20, flexDirection: 'column'}}>
                            <Image source={require('../../Resources/red_cloud.jpeg')} 
                                            style={{width: '50%', height: '60%'}}/>
                        </View>
                        <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.textInputLabel}>Username</Text>
                            <TextInput editable={true} keyboardType='default' 
                                    autoCorrect={false} placeholder='Login' secureTextEntry={false} 
                                    style={styles.textInput}
                                    onChangeText={(value) => {this.setState({login: value})}}
                                    />
                        </KeyboardAvoidingView>
                        <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={styles.textInputLabel}>Password</Text>
                            <TextInput editable={true} keyboardType='default' 
                                    autoCorrect={false} placeholder='Password' secureTextEntry={true} 
                                    style={styles.textInput}
                                    onChangeText={(value) => {this.setState({password: value})}}
                                    />
                        </KeyboardAvoidingView>
                        <Text/>
                        <Button title="Login"
                            onPress={() => this.login()}
                            color='blue' 
                            disabled={(this.state.login == '' || this.state.password == '')}
                        />
                        <Text style={{flex: 2, color: 'red'}}>
                            {this.state.error}
                        </Text>
                        <Button title="Register a new account"
                            onPress={() => this.props.navigation.navigate('RegisterAccount')}
                            color='crimson' 
                        />
                    </View>
            </View>
        );
    }
}