/**
 * Pulls up iFrame for login page, afterwards pulls back info or token and saves locally
 */

import React, {Component} from 'react';
import {WebView} from 'react-native';

export default class Map extends Component<Props> {
    render() {
        return (
            <WebView source={{uri: 'http://www.aqandu.org'}}/>
        );
    }
}