import React, {Component} from 'react';
import {Text, View, Image, TextInput, Button, KeyboardAvoidingView, ScrollView, Alert} from 'react-native';
import NavBar from '../../Components/NavBar';
import { BleManager } from 'react-native-ble-plx';

export default class ConnectionSetup extends Component<Props> {
    static navigationOptions = {
        title: 'Connection',
    };

    constructor(props) {
        super(props)
        // timer for faking
        this.connectToBluetooth = this.connectToBluetooth.bind(this);
        this.connectDeviceToWiFi = this.connectDeviceToWiFi.bind(this);
        let _timer = setInterval(this.connectToBluetooth, 5000);

        this.state={bleConnected: false, MAC: null, wifiConnected: false, 
                    WiFiName: "", WiFiPassword: "", WiFiError: false, timer: _timer};
    }

    // displays alert to user if BT or WiFi is disabled on device
    alertSetupSettings(value) {
        if (value == 0) {
            Alert.alert(
                'Could not connect to Bluetooth',
                'Could not connect to Bluetooth to use sensor. Please make sure it is enabled',
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'OK'}
                ],
              )
        }
        else if (value == 1) {
            // WiFi
        }
        else {
            // other
        }
    }

    // used to get MAC Address in connection step
    connectToBluetooth() {
        // code use taken from https://polidea.github.io/react-native-ble-plx/ documentation
        const manager = new BleManager();
        if (manager.state != 'PoweredOn') {
            this.alertSetupSettings(0);
            return
        }

        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                return
            }
            // adjust name to match sensor
            if (device.name === 'TI BLE Sensor Tag') {
                manager.stopDeviceScan();
                device.connect()
                .then((device) => {
                    return device.discoverAllServicesAndCharacteristics()
                })
                // device id = MAC Address; set and return
                .then((device) => {
                    this.setState({MAC: device.id, bleConnected: true})
                })
            }
        });
        manager.destroy();
    }

    connectDeviceToWiFi() {
        // if valid, navigate to Privacy. Otherwise mark as error
        if (this.state.WiFiName == "UGuest" && this.state.WiFiPassword == "password") {
           this.props.navigation.navigate("Privacy");
        }
        else {
            this.setState({WiFiError: true})
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
        this.manager.destroy();
    }

    render() {
        var error, macAddress

        // after trying to connect will set state, renders error text if true
        if (this.state.WiFiError == true) {
            error = <Text style={{color: 'red', fontSize: 12}}>Could not connect to WiFi Network</Text>
        }
        else {
            error = <Text style={{color: 'red', fontSize: 12}}></Text>
        }

        // faking loading
        if (this.state.MAC != null) {
            macAddress=<Text>{this.state.MAC}</Text>
        }
        else {
            macAddress=<Image source={require('../../Resources/Loading.gif')} 
                                style={{width: 100, height: 100, alignContent: 'center', justifyContent: 'center'}}/>
        }
        
        return (
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
                <View style={{flex: 2}}>
                    <Text>Enable your Bluetooth and connect to the sensor. Once it is connected the device name will show below. 
                        Select your WiFi network to connect to, enter the password, then select 'Connect'.
                    </Text>
                </View>
                {/* BLE name goes here */}
                <View style={{flex: 2, jusifyContent: 'flex-start', alignContent: 'flex-start'}}>
                    {macAddress}
                </View>
                <View style={{flex: 2}}>
                    <Text>Confirm the MAC ID listed above matches the one on your sensor. If it is correct, 
                        enter WiFi information below to connect the sensor to your network.
                    </Text>
                </View>
                <KeyboardAvoidingView style={{flex: 3, alignContent: 'flex-start', justifyContent: 'flex-start',
                        paddingLeft: 30}}>
                    {/* network */}
                    <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='SSID' secureTextEntry={false}
                                style={{borderWidth: 2, borderColor: 'black', 
                                width: '50%', height: 40, alignContent: 'center', justifyContent: 'center', paddingBottom: 10}}
                                onChangeText={(value) => {this.setState({WiFiName: value})}}
                                />
                    <Text/>
                    {/* password */}
                    <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='Password' secureTextEntry={true} 
                                style={{borderWidth: 2, borderColor: 'black', 
                                width: '50%', height: 40, alignContent: 'center', justifyContent: 'center', paddingBottom: 10}}
                                onChangeText={(value) => {this.setState({WiFiPassword: value})}}
                                />
                </KeyboardAvoidingView>
                <View>
                    {/* connect button */}
                    <Button title="Connect"
                        onPress={() => this.connectToWiFi()}
                        color='red' 
                        disabled={(this.state.WiFiPassword == "" || this.state.WiFiName == "")}
                    />
                </View>
                <View style={{flex: 1}}>
                    {error}
                </View>
                <NavBar navigation={this.props.navigation} previous='MountingSensor'/>
            </ScrollView>
        );
    }
}