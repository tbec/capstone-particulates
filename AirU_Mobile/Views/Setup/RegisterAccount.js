import React, {Component} from 'react';
import {TouchableHighlight, View, Text, AsyncStorage,
         TextInput, Platform, KeyboardAvoidingView, Button, Image, ImageBackground} from 'react-native';
import styles from '../../StyleSheets/Styles'
import Icon from 'react-native-vector-icons/Ionicons'
import { LOGIN_NAME, LOGIN_TOKEN, TEST_MODE } from '../../Components/Constants'

export default class RegisterAccount extends Component<Props> {
    constructor(props) {
        super(props)
        this.register.bind(this)
        this.state = ({username: '', password: '', email: '', error: ''})
    }

    async register() {
        // make API call to login passing in login/password
        if (TEST_MODE == true && this.state.username != "TEST") {
            this.setState({ error: "Invalid username or password" })
            return
        }
        // check information
        let result = await JSON.parse(webCall());

        // check results

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
              login: this.state.login,
              email: this.state.email,
              password: this.state.password
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
                                        style={{width: '50%', height: '70%'}}/>
                    </View>
                    <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.textInputLabel}>Username</Text>
                        <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='Username' secureTextEntry={false} 
                                style={styles.textInput}
                                onChangeText={(value) => {this.setState({login: value})}}
                                />
                    </KeyboardAvoidingView>
                    <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.textInputLabel}>Email</Text>
                        <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='Email' secureTextEntry={true} 
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
                    <Text style={{flex: 2, color: "red", alignContent: 'center'}}>
                        {this.state.error}
                    </Text>
                </View>
            </View>
        );
    }
}