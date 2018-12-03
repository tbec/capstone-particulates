import React, {Component} from 'react';
import {Text, View, Image, TextInput, Button} from 'react-native';
import NavBar from '../../Components/NavBar'
import styles from '../../StyleSheets/Styles'

export default class ConnectionSetup extends Component<Props> {
    constructor(props) {
        super(props)
        // timer for faking
        this.updateTimer = this.updateTimer.bind(this);
        this.connectToWiFi = this.connectToWiFi.bind(this);
        let _timer = setInterval(this.updateTimer, 5000);

        this.state={bleConnected: false, MAC: null, wifiConnected: false, 
                    WiFiName: "", WiFiPassword: "", WiFiError: false, timer: _timer};
    }

    // used to fake connecting to BT
    updateTimer() {
        this.setState({MAC: 'MAC ADDRESS'});
      }

    connectToBluetooth() {
        // dummy code, make me actually work
    }

    connectToWiFi() {
        // if valid, navigate to Privacy. Otherwise mark as error
        if (this.state.WiFiName == "Utah" && this.state.WiFiPassword == "password") {
           this.props.navigation.navigate("Privacy");
        }
        else {
            this.setState({WiFiError: true})
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
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
            <View style={styles.mainView}>
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
                <View style={{flex: 3, alignContent: 'flex-start', justifyContent: 'flex-start',
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
                </View>
                <View>
                    {/* connect button */}
                    <Button title="Connect"
                        onPress={() => this.connectToWiFi()}
                        disabled={(this.state.WiFiPassword == "" || this.state.WiFiName == "")}
                    />
                </View>
                <View style={{flex: 2}}>
                    {/* <Text>{this.state.WiFiName}</Text>
                    <Text>{this.state.WiFiPassword}</Text> */}
                    {error}
                </View>
                <NavBar navigation={this.props.navigation} previous='MountingSensor'/>
            </View>
        );
    }
}