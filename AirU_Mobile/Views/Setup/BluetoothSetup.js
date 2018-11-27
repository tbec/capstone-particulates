import React, {Component} from 'react';
import {Text, View,Image, TextInput} from 'react-native';
import NavBar from '../../Components/NavBar'
import styles from '../../StyleSheets/Styles'

export default class BluetoothSetup extends Component<Props> {
    constructor(props) {
        super(props)
        this.state={bleConnected: false, MAC: '', wifiConnected: false, WiFiName: '', WiFiPassword: '', WiFiError: false}
    }

    connectToBluetooth() {

    }

    connectToWiFi() {

    }

    render() {
        var error
        if (this.state.WiFiError == true) {
            error = <Text>Could not connect to WiFi Network</Text>
        }
        else {
            error = null
        }
        return (
            <View style={styles.mainView}>
                <View style={{flex: 3}}>
                    <Text>Enable your Bluetooth and connect to the sensor. Once it is connected the device name will show below. 
                        Select your WiFi network to connect to, enter the password, then select 'Connect'.
                    </Text>
                </View>
                {/* BLE name goes here */}
                <View style={{flex: 3}}>
                    <Text>Confirm the MAC ID listed above matches the one on your sensor. If it is correct, 
                        enter WiFi information below to connect the sensor to your network.
                    </Text>
                </View>
                <View style={{flex: 5}}>
                    {/* network */}
                    {/* password */}
                    <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='Password' secureTextEntry={true} 
                                style={{borderWidth: 2, borderColor: 'black', 
                                width: '50%', alignContent: 'center', justifyContent: 'center'}}/>
                    {/* show password toggle */}
                    {/* connect button */}
                    {error}
                </View>
                <Text>{this.state.WiFiPassword}</Text>
                <NavBar navigation={this.props.navigation} next='WiFiSetup' previous='MountingSensor'/>
            </View>
        );
    }
}