import React, {Component} from 'react';
import {Text, View, TouchableHighlight,Image} from 'react-native';
import NavBar from '../../Components/NavBar'
import styles from '../../StyleSheets/Styles'

export default class BluetoothSetup extends Component<Props> {
    render() {
        return (
            <View style={styles.mainView}>
                <View style={{flex: 10}}>
                    <Text>BluetoothSetup</Text>
                </View>
                <NavBar navigation={this.props.navigation} next='WiFiSetup' previous='MountingSensor'/>
            </View>
        );
    }
}