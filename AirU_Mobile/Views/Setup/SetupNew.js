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

          if (_retrieveData) {
            this.state={ loggedIn: false}
          }
          else {
              this.state={loggedIn: true}
          }
    }

    // If logged in already go to review via navigator, otherwise have login first
    componentWillMount() {
        if (this.state.loggedIn) {
            this.props.navigation.push('Login');
            return(null);
        }
    }

    render() {
        return (<ReviewFirst navigation={this.props.navigation}/>)
    }

    // need way to go to SetupNavigation after Login successful
    // Change to navigation.push, when returned way to pass in variable back and logic off that?
}