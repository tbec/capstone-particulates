import React, {Component} from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import styles from '../../StyleSheets/Styles'

export default class BluetoothSetup extends Component<Props> {

    render() {
        return (
            <View style={{flex: 1}}>
                <Text>BluetoothSetup page here</Text>
                <TouchableHighlight 
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('WiFiSetup')}>
                        <Text>Go to next</Text>
                </TouchableHighlight>
            </View>
        );
    }
}