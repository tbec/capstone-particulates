/**
 * Main setup page, navigates to login if not logged in otherwise navigates to first part of process (Review)
 */

import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Login from './Login'
import Review from './Review'

export default class SetupNew extends Component<Props> {

    // checks if user has logged in previously
    constructor(Props) {
        super(Props);
        _retrieveData = async () => {
            try {
              const value = await AsyncStorage.getItem('LOGIN');
              if (value !== null) {
                // We have data!!
                console.log(value);
              }
             } catch (error) {
               // Error retrieving data
             }
          }

          if (_retrieveData == null) {
            this.state={ loggedIn: false}
          }
          else {
              this.state={loggedIn: true}
          }
    }

    // If logged in already go to review, otherwise have login first
    render() {
        if (this.state.loggedIn) {
            return (
                <Review/>
            );
        } else {
            return (
              <Login/>  
            )
        }
    }
}