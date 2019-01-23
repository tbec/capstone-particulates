import React, {Component} from 'react';
import {TouchableHighlight, View, Text, AsyncStorage,
         TextInput, Platform, KeyboardAvoidingView, Button, Image, ImageBackground} from 'react-native';
import styles from '../../StyleSheets/Styles'
import Icon from 'react-native-vector-icons/Ionicons'
import { LOGIN_NAME, LOGIN_TOKEN, TEST_MODE } from '../../Components/Constants'

export default class RegisterAccount extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = ({username: '', password: '', email: '', error: ''})
    }

    render() {
        
    }
}