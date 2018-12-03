/**
 * Main setup page, navigates to login if not logged in otherwise navigates to first part of process (Review)
 */

import React, {Component} from 'react';
import SetupNavigation from '../../Components/Navigation'
import Login from '../Setup/Login'
import ReviewFirst from './ReviewFirst';

export default class SetupNew extends Component<Props> {

    // checks if user has logged in previously
    constructor(Props) {
        super(Props);
        const _retrieveData = async () => {
            return await AsyncStorage.getItem('Login');
          }

          if (_retrieveData === null) {
            this.state={ loggedIn: false}
          }
          else {
              this.state={loggedIn: true}
          }
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
            return (<Login/>)
        }
    }
}