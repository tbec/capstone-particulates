/**
 * Final confirmation screen for setup process
 **/

import React, {Component} from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import styles from '../../StyleSheets/Styles'
import {NavigationActions} from 'react-navigation'

export default class Confirmation extends Component<Props> {
    render() {
        return (
            <View style={{flex: 1}}>
                <Text>Final confirmation page here</Text>
                <TouchableHighlight 
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate({
                        routeName: 'Tabs',
                        params: {},
                        action: NavigationActions.navigate({routeName: 'Sensor'})})}>
                        <Text>Go to Sensor</Text>
                </TouchableHighlight>
            </View>
        );
    }
}