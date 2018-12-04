/**
 * Main setup page, navigates to login if not logged in otherwise navigates to first part of process (Review)
 */

import React, {Component} from 'react';
import {AsyncStorage} from 'react-native'
import Login from '../Setup/Login'

export default class SetupNew extends Component<Props> {

    // checks if user has logged in previously
    constructor(Props) {
        super(Props);
        this.state = {loggedIn: false}
        
        AsyncStorage.getItem('@Login').then((_retrieveData) => {
            if (_retrieveData == null) {
                this.setState={ loggedIn: false}
            }
            else {
                this.setState={loggedIn: true}
            }
        })
    }

    componentWillMount() {
        if(this.state.loggedIn){
            this.props.navigation.navigate('ReviewFirst');
        }
    }

    // If logged in already go to review via navigator, otherwise have login first
    render() {
        if (this.state.loggedIn) {
            return null
        }
        else {
            return (<Login navigation={this.props.navigation}/>)
        }
    }
}