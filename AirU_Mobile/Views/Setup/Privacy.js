/**
 * Screen for privacy settings
 **/ 

import React, {Component} from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import styles from '../../StyleSheets/Styles'

export default class Privacy extends Component<Props> {

    render() {
        return (
            <View style={{flex: 1}}>
                <Text>Privacy page here</Text>
                <TouchableHighlight 
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('Confirmation')}>
                        <Text>Go to next</Text>
                </TouchableHighlight>
            </View>
        );
    }
}