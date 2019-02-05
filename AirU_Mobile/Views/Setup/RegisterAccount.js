import React, {Component} from 'react';
import {View, Text, AsyncStorage,
         TextInput, KeyboardAvoidingView, Button, Image} from 'react-native';
import styles from '../../StyleSheets/Styles'
import { LOGIN_NAME, LOGIN_TOKEN, TEST_MODE } from '../../Components/Constants'

export default class RegisterAccount extends Component<Props> {
    constructor(props) {
        super(props)
        this.register = this.register.bind(this)
        this.webCall = this.webCall.bind(this)
        this.state = ({firstName: '', lastName: '', username: '', password: '', email: '', error: ''})
    }

    async register() {
        // make API call to login passing in login/password
        if (!TEST_MODE == true && this.state.username != "TEST") {
            this.setState({ error: "Invalid username or password" })
            return
        }

        // check information
        let result = await this.webCall();
        res = JSON.parse(result);

        // check results
        if (res.success) {
            AsyncStorage.setItem(LOGIN_NAME, this.state.username);
            this.props.navigation.navigate('ReviewFirst');
        } else {
            this.setState({error: 'Could not create account'})
        }
    }

    async webCall() {
        let urlBase = 'https://neat-environs-205720.appspot.com/mobile/register/user?'
        let user = 'username=' + this.state.username
        let firstName = '&firstname=' + this.state.firstName
        let lastName = '&lastname=' + this.state.lastName
        let email = '&email=' + this.state.email
        let password = '&password=' + this.state.password

        let url = urlBase + user + firstName + lastName + email + password

        console.log('URL: ' + url)

        return fetch(url, {method: 'POST'})
            .then((response) => response.json())
            .then((responseJson) => {
            return responseJson })
          .catch((error) => { console.error(error)})
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 20, backgroundColor: '#b3e6ff'}}>
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', paddingTop: 20, flexDirection: 'column'}}>
                        <Image source={require('../../Resources/red_cloud.jpeg')} 
                                        style={{width: '50%', height: '70%'}}/>
                    </View>
                    <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.textInputLabel}>First Name</Text>
                        <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='First Name' secureTextEntry={false} 
                                style={styles.textInput}
                                onChangeText={(value) => {this.setState({firstName: value})}}
                                />
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.textInputLabel}>Last Name</Text>
                        <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='Last Name' secureTextEntry={false} 
                                style={styles.textInput}
                                onChangeText={(value) => {this.setState({lastName: value})}}
                                />
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.textInputLabel}>Username</Text>
                        <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='Username' secureTextEntry={false} 
                                style={styles.textInput}
                                onChangeText={(value) => {this.setState({username: value})}}
                                />
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.textInputLabel}>Email</Text>
                        <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='Email' secureTextEntry={false} 
                                style={styles.textInput}
                                onChangeText={(value) => {this.setState({email: value})}}
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
                    <Button title="Register"
                        onPress={() => this.register()}
                        color='red' 
                        disabled={(this.state.login == "" || this.state.password == "" || this.state.email == "")}
                    />
                    <Text/>
                    <Text style={{flex: 1, color: "red", alignContent: 'center'}}>
                        {this.state.error}
                    </Text>
                </View>
            </View>
        );
    }
}