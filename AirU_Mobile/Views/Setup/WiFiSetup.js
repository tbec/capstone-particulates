import React, {Component} from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import styles from '../../StyleSheets/Styles'

export default class WiFiSetup extends Component<Props> {

    render() {
        return (
            <View style={{flex: 1}}>
                <Text>WiFiSetup page here</Text>
                <TouchableHighlight 
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('Privacy')}>
                        <Text>Go to next</Text>
                </TouchableHighlight>
            </View>
        );
    }
}