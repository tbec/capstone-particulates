/**
 * Main setup page
 */

import React, {Component} from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import styles from '../../StyleSheets/Styles'

export default class ReviewFirst extends Component<Props> {

    render() {
        return (
            <View style={{flex: 1}}>
                <Text>Review page here</Text>
                <TouchableHighlight 
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('BluetoothSetup')}>
                        <Text>Go to next</Text>
                </TouchableHighlight>
            </View>
        );
    }
}