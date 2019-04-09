/**
 * Main setup page, navigates to login if not logged in otherwise navigates to first part of process (Review)
 */

import React, {Component} from 'react';
import {AsyncStorage} from 'react-native'
import Login from '../Setup/Login'
import { LOGIN_NAME } from '../../Components/Constants'
import {accountFuncs} from '../../Components/CommonFuncs'

export default class SetupNew extends Component<Props> {

    // checks if user has logged in previously
    constructor(Props) {
        super(Props);
        this.state = {loggedIn: false}
        this.checkLogin();
    }

    componentDidMount(props) {
        this.checkLogin();
    }

    /**
     * Checks if users has previously logged into system to display appropriate view
     */
    checkLogin() {
        accountFuncs.loginKeychain().then((_res) => {
            if (accountFuncs.loginKeychain() != null) {
                this.setState({ loggedIn: false})
            } else {
                this.setState({loggedIn: true})
                this.props.navigation.navigate('ReviewFirst')
            }
        })
        // AsyncStorage.getItem(LOGIN_NAME).then((_retrieveData) => {
        //     if (_retrieveData == null) {
        //         this.setState({ loggedIn: false})
        //     }
        //     else {
        //         this.setState({loggedIn: true})
        //         this.props.navigation.navigate('ReviewFirst');
        //     }
        // })
    }

    // If logged in already go to review via navigator, otherwise have login first
    render() {
        if (this.state.loggedIn) {            
            return null;
        }
        else {
            return (<Login navigation={this.props.navigation}/>)
        }
    }
}