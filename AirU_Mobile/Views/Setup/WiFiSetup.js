import React, {Component} from 'react';
import {Text, View, TouchableHighlight, Image} from 'react-native';
import NavBar from '../../Components/NavBar'
import styles from '../../StyleSheets/Styles'

export default class WiFiSetup extends Component<Props> {

    render() {
        return (
            <View style={styles.mainView}>
                <View style={{flex: 10}}>
                    <Text>WiFiSetup page here</Text>
                </View>
                <NavBar navigation={this.props.navigation} next='Privacy' previous='BluetoothSetup'/>
            </View>
        );
    }
}