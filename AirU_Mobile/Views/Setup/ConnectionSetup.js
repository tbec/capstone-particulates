import React, {Component} from 'react';
import {Text, View, Image, TextInput} from 'react-native';
import NavBar from '../../Components/NavBar'
import styles from '../../StyleSheets/Styles'

export default class ConnectionSetup extends Component<Props> {
    constructor(props) {
        super(props)
        this.state={bleConnected: false, MAC: null, wifiConnected: false, 
                    WiFiName: "", WiFiPassword: "", WiFiError: false};
        this.updateTimer = this.updateTimer.bind(this)
    }

    updateTimer() {
        this.setState({
          MAC: 'MAC ADDRESS'
        });
      }

    // used to connect to sensor via Bluetooth
    connectToBluetooth() {
        // dummy code, make me actually work
        return "TEST"
    }

    // used to connect to WiFi network 
    connectToWiFi() {

    }

    componentWillMount() {
        setInterval(this.updateTimer, 1000);
    }

    render() {
        // after trying to connect will set state, renders error text if true
        var error, macAddress
        if (this.state.WiFiError == true) {
            error = <Text>Could not connect to WiFi Network</Text>
        }
        else {
            error = null
        }

        if (this.state.MAC) {
            macAddress=<Text>{this.state.MAC}</Text>
        }

        return (
            <View style={styles.mainView}>
                <View style={{flex: 3}}>
                    <Text>Enable your Bluetooth and connect to the sensor. Once it is connected the device name will show below. 
                        Select your WiFi network to connect to, enter the password, then select 'Connect'.
                    </Text>
                    <Text>{this.state.MAC}</Text>
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
                <NavBar navigation={this.props.navigation} next='Privacy' previous='MountingSensor'/>
            </View>
        );
    }
}