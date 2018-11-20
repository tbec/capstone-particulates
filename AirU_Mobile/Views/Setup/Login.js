/**
 * Pulls up iFrame for login page, afterwards pulls back info or token and saves locally
 */

import React, {Component} from 'react';
import {WebView} from 'react-native';

// WIP. Will need to go to correct URL, save token after login, and navigate to next page after done
export default class Login extends Component<Props> {
    render() {
        return (
            <WebView source={{uri: 'https://particulates.slack.com'}}/>
        );
    }
}