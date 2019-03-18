/**
 * Pulls up iFrame for login page, afterwards pulls back info or token and saves locally
 */

import React, {Component} from 'react';
import {View, Text, AsyncStorage,
         TextInput, KeyboardAvoidingView, Button, Image, ImageBackground} from 'react-native';
import styles from '../../StyleSheets/Styles'
import { LOGIN_NAME, TEST_MODE, WEB_URL} from '../../Components/Constants'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import {accountFuncs} from '../../Components/CommonFuncs'

/**
 * Logs into system
 * @param navigator - React Navigator used to move between screens after login
 */
export default class Login extends Component<Props> {
    constructor(props) {
        super(props);
        this.login.bind(this)
        this.webCall = this.webCall.bind(this)

        this.state = ({login: '', password: '', error: '', loggingIn: false})
    }

    /**
     * Logs into server
     */
    async login() {
        this.setState({loggingIn: true})
        // used for testing only
        if (TEST_MODE) {
            if (this.state.login != "TEST") {
                this.setState({ error: "Invalid username or password" })
                return
            }
            else {
                this.props.navigation.navigate('ReviewFirst');
                AsyncStorage.setItem(LOGIN_NAME, this.state.login);
                return
            }
        }

        // make API call to login passing in login/password
        let result = await this.webCall();

        // if success, save locally and continue
        if (result != null && JSON.parse(result).success) {
            AsyncStorage.setItem(LOGIN_NAME, this.state.login)
            AsyncStorage.setItem(PASSWORD, this.state.password)
            accountFuncs.saveAccount(this.state.login, this.state.password)

            let toReturn = this.props.navigation.getParam('return', false);
            if (toReturn) {
                this.props.navigation.goBack()
            } else {
                this.props.navigation.navigate('ReviewFirst') 
            }
        } else {
            this.setState({error: 'Invalid username or password', loggingIn: false})
        }
    }

    /**
     * Attempts to call server to log in with specified credentials
     */
    async webCall() {
        let urlBase = WEB_URL + '/login?'
        let user = 'username=' + this.state.login
        let password = '&password=' + this.state.password

        let url = urlBase + user + password

        console.log('URL: ' + url)

        return fetch(url, {method: 'POST', credentials: 'include' })
            .then((response) => response.json())
            .then((responseJson) => {
            return responseJson })
          .catch((error) => { 
              console.error(error)
            })
    }

    render() {
        return (
            <KeyboardAwareScrollView style={[styles.container, {backgroundColor: '#b3e6ff'}]}>
                        <View style={{height: 200, alignItems: 'center', justifyContent: 'center', paddingTop: 20}}>
                            <Image source={require('../../Resources/red_cloud.jpeg')} 
                                            style={{width: '50%', height: '70%'}}/>
                        </View>
                        <KeyboardAvoidingView style={styles.textGroupBox}>
                        <Text style={styles.textInputLabel}>Username</Text>
                            <TextInput editable={true} keyboardType='default' 
                                    autoCorrect={false} placeholder='Login' secureTextEntry={false} 
                                    style={styles.textInput}
                                    onChangeText={(value) => {this.setState({login: value})}}
                                    />
                        </KeyboardAvoidingView>
                        <KeyboardAvoidingView style={styles.textGroupBox}>
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
                            color='red' 
                            disabled={(this.state.login == '' || this.state.password == '' 
                                || this.state.loggingIn)}
                        />
                        <Text style={{height: 200, color: 'red', textAlign: 'center'}}>
                            {this.state.error}
                        </Text>
                        <Button title="Register a new account"
                            onPress={() => this.props.navigation.navigate('RegisterAccount')}
                            color='blue' 
                        />
            </KeyboardAwareScrollView>
        );
    }
}