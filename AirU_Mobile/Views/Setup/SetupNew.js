/**
 * Main setup page, navigates to login if not logged in otherwise navigates to first part of process (Review)
 */

import React, {Component} from 'react';
import SetupNavigation from '../../Components/Navigation'
import Login from '../Setup/Login'

export default class SetupNew extends Component<Props> {

    // checks if user has logged in previously, need to fix logic as appropriate
    constructor(Props) {
        super(Props);
        _retrieveData = async () => {
            try {
              const value = await AsyncStorage.getItem('LOGIN');
              if (value !== null) {
                console.log(value);
              }
             } catch (error) {
               console.log(error)
             }
          }

          if (_retrieveData === null) {
            this.state={ loggedIn: false}
          }
          else {
              this.state={loggedIn: true}
          }
    }

    // If logged in already go to review via navigator, otherwise have login first
    componentWillMount() {
        if (this.state.loggedIn) {
            this.props.navigation.navigate('ReviewFirst');
            return(null);
        }
    }

    render() {
        return (<Login/>)
    }

    // need way to go to SetupNavigation after Login successful
    // Change to navigation.push, when returned way to pass in variable back and logic off that?
}