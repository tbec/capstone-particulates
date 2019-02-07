import React, {Component} from 'react';
import {Text, View, Image, TextInput, Button, KeyboardAvoidingView, ScrollView, Alert} from 'react-native';
import NavBar from '../../Components/NavBar';
import { BleManager } from 'react-native-ble-plx';
import { TEST_MODE, SENSOR_NAME, SENSOR_ID } from '../../Components/Constants'
import styles from '../../StyleSheets/Styles'

export default class ConnectionSetup extends Component<Props> {
    static navigationOptions = {
        title: 'Connection',
    };

    constructor(props) {
        super(props)

        // functions and timer in case cannot connect or find BT
        this.connectToBluetooth = this.connectToBluetooth.bind(this);
        this.connectDeviceToWiFi = this.connectDeviceToWiFi.bind(this);
        let _timer = setInterval(this.connectToBluetooth, 2000);

        // CHANGE TESTMODE
        this.state={bleConnected: false, sensorID: null, wifiConnected: false, error: '',
                    WiFiName: '', WiFiPassword: '', WiFiError: false, timer: _timer, testMode: true};
    }

    // displays alert to user if BT or WiFi is disabled on device
    // 0 = BT error, 1 = WiFi error
    alertSetupSettings(value) {
        // TEST MODE
        if (this.state.testMode) {
            let num = Math.floor(Math.random() * Math.floor(999))
            if (num < 100) { 
                num = num + 100 
            }
            let id = '123456789' + num
            this.setState({sensorID: id, bleConnected: true})
            clearInterval(this.state.timer);
            return
        }

        if (value == 0) {
            Alert.alert(
                'Could not connect to Bluetooth',
                'Could not connect to Bluetooth to use sensor. Please make sure it is enabled, and select OK to try again',
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'OK', onPress: () => {
                        this.connectToBluetooth()
                    }}
                ],
              )
        }
        else if (value == 1) {
            Alert.alert(
                'Could not connect to WiFi',
                'Could not connect to WiFi. Please make sure it is enabled, and select OK to try again',
                [
                    {text: 'Cancel', style: 'cancel'},
                    {text: 'OK', onPress: () => {
                        this.connectDeviceToWiFi()
                    }}
                ],
              )
        }
    }

    // used to get Sensor ID in connection step
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
            if (device.name === 'ESP_GATTS_DEMO') {
                manager.stopDeviceScan();
                device.connect()
                    .then((device) => {
                        return device.discoverAllServicesAndCharacteristics()
                    })
                    .then((device) => {
                        // serviceUUID, charUUID, transactionID
                        return device.readCharacteristicForService(1, 2, 3)
                    })
                    .then((characteristic) => {
                        this.setState({sensorID: characteristic.value, bleConnected: true})
                    })
                    .catch(error => { 
                        console.log(error)
                        this.setState({error: 'Could not connect to sensor'})
                    })
            }
        });

        manager.cancelDeviceConnection()
        manager.destroy()
    }

    // Tries to connect to WiFi to make sure valid. If works, sends information to sensor
    connectDeviceToWiFi() {
        // if valid, navigate to Privacy. Otherwise mark as error
        // adjust in future to actually send to WiFi
        if (this.state.WiFiName == "MyWiFi" && this.state.WiFiPassword == "password") {
            const name = this.props.navigation.getParam(SENSOR_NAME, 'NewSensor')
            const id = this.state.sensorID
            this.props.navigation.navigate('Privacy', { sensorName: name, sensorID: id});
        }
        else {
            this.setState({WiFiError: true})
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    render() {
        var error, sensID

        // after trying to connect will set state, renders error text if true
        if (this.state.WiFiError == true) {
            error = <Text style={{color: 'red', fontSize: 12}}>Could not connect to WiFi Network</Text>
        }
        else {
            error = <Text style={{color: 'red', fontSize: 12}}></Text>
        }

        // faking loading
        if (this.state.sensorID != null) {
            sensID=<Text style={{textAlign: 'center', fontWeight: 'bold'}}>{this.state.sensorID}</Text>
        }
        else {
            sensID=<Image source={require('../../Resources/Loading.gif')} 
                                style={{width: 100, height: 100, alignContent: 'center', justifyContent: 'center'}}/>
        }
        
        return (
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
                <View style={{flex: 2, paddingTop: 30}}>
                    <Text>Enable your Bluetooth and connect to the sensor. Once it is connected the device name will show below. 
                        Select your WiFi network to connect to, enter the password, then select 'Connect'.
                    </Text>
                </View>
                {/* BLE name goes here */}
                <View style={{flex: 2, jusifyContent: 'flex-start', alignContent: 'flex-start'}}>
                    {sensID}
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
                                style={styles.textInput}
                                onChangeText={(value) => {this.setState({WiFiName: value})}}
                                />
                    <Text/>
                    {/* password */}
                    <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='Password' secureTextEntry={true} 
                                style={styles.textInput}
                                onChangeText={(value) => {this.setState({WiFiPassword: value})}}
                                />
                </KeyboardAvoidingView>
                <View>
                    {/* connect button */}
                    <Button title="Connect"
                        onPress={() => this.connectDeviceToWiFi()}
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