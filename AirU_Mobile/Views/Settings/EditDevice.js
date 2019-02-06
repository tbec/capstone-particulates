import React, {Component} from 'react';
import {Text, View, Image, KeyboardAvoidingView, TextInput, Button, AsyncStorage} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import styles from '../../StyleSheets/Styles'
import { SENSOR_ARRAY, SENSOR_NAME WEB_URL, LOGIN, PASSWORD } from '../../Components/Constants'
import { Dropdown } from 'react-native-material-dropdown'

/**
 * Edit existing devices, accessed from Settings screen
 */
export default class EditDevice extends Component<Props> {
    constructor(props) {
        super(props);

        // bindings
        this.editDevice = this.editDevice.bind(this)
        this.privacyHandler = this.privacyHandler.bind(this)
        this.sensorHandler = this.sensorHandler.bind(this)
        this.login = this.login.bind(this)
        this.editDeviceCall = this.editDeviceCall.bind(this)

        sensorsList = this.props.navigation.getParam('sensorList', 'NewSensor')
        this.state=({sensorList: sensorsList, sensorIndex: 0, error: '',
                        selectedSensor: sensorsList[0], name: sensorsList[0].sensorName, 
                        id: sensorsList[0].id, privacy: sensorsList[0].privacy})
    }

    /**
     * Handles privacy update when selected
     * @param {boolean} value 
     */
    privacyHandler(value) {
        this.setState({privacy: value})
    }

    /**
     * Updates selected sensor from Dropdown
     * @param {int} index 
     */
    sensorHandler(index) {
        sensor = this.state.sensorList[index]
        this.setState({sensorIndex: index, selectedSensor: sensor, name: sensor.sensorName, 
                        id: sensor.id, privacy: sensor.privacy})
    }
    
    /**
     * Makes call to server to edit device, and then saves locally
     */
    async editDevice() {
        // make web call

        // update settings locally
        sensor = this.state.selectedSensor
        sensorList = this.state.sensorList

        sensor.sensorName = this.state.name
        sensor.privacy = this.state.privacy
        sensorList[this.state.sensorIndex] = sensor;

        var json = JSON.stringify(sensorList);
        await AsyncStorage.setItem(SENSOR_ARRAY, json);

        // navigate back
        this.props.navigation.goBack();
    }

    /**
     * Makes call to server to edit device
     */
    async webCall() {
        let username
        await AsyncStorage.getItem(LOGIN).then((_retrieveData) => {
            if (_retrieveData == null) {
                // error
            }
            else {
                username = _retrieveData
            }
        })

        let result = this.login(username)
        let res = result.json()
        if (!res.success) {
            // display error message
        }

        result = this.editDeviceCall(username)
        res = result.json() 
        return res.success
    }

    /**
     * Logs into the site, must call before adding device
     */
    async login() {
        let password

        await AsyncStorage.getItem(PASSWORD).then((_retrieveData) => {
            if (_retrieveData == null) {
                // error
            }
            else {
                password = _retrieveData
            }
        })

        let urlBase = WEB_URL + '/login?'
        let user = 'username=' + username
        let password = '&password=' + password

        let url = urlBase + user + password

        console.log('URL: ' + url)

        return fetch(url, {method: 'POST'})
            .then((response) => response.json())
            .then((responseJson) => {
            return responseJson })
          .catch((error) => { console.error(error)})
    }

    /**
     * Makes call to server to edit device, must call login() first
     * @param {string} username - Should be called from Async
     */
    async editDeviceCall(username) {
        let urlBase = WEB_URL + '/device/edit?'
        let user = 'username=' + username
        let name = '&devicename=' + this.state.name
        let id = '&deviceid=' + this.state.id
        let privacy = '&visibility=' + this.state.privacy

        let url = urlBase + user + password

        console.log('URL: ' + url)

        return fetch(url, {method: 'POST'})
            .then((response) => response.json())
            .then((responseJson) => {
            return responseJson })
          .catch((error) => { console.error(error)})
    }
    
    render() {
        return(
            <View style={styles.container}>
                <View style={{flex: 20, backgroundColor: '#b3e6ff'}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20, flexDirection: 'column'}}>
                        <Image source={require('../../Resources/red_cloud.jpeg')} 
                                        style={{width: '50%', height: '60%'}}/>
                    </View>
                    <SensorPicker data={this.state.sensorList} handler={this.sensorHandler}/>
                    <View style={styles.textGroupBox}>
                        <Text style={[styles.textInputLabel, {textAlign: 'center'}]}>Device id</Text>
                        <Text style={{textAlign: 'center', paddingBottom: 10}}>{this.state.id}</Text>
                    </View>
                    <KeyboardAvoidingView style={styles.textGroupBox}>
                        <Text style={styles.textInputLabel}>Device Name</Text>
                        <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} secureTextEntry={false} 
                                style={styles.textInput}
                                onChangeText={(value) => {this.setState({name: value})}}
                                value={this.state.name}
                                />
                    </KeyboardAvoidingView>
                    <View style={styles.textGroupBox}>
                        <Text style={styles.textInputLabel}>Privacy Setting</Text>
                        <RadioButtons privacy={this.state.privacy == false ? 0 : 1} handler={this.privacyHandler}/>
                    </View>
                    <Button title="Update Settings"
                            onPress={() => this.editDevice()}
                            color='crimson' 
                        />
                    <Text>{this.state.error}</Text>
                </View>
            </View>
        )
    }
}

/**
 * Dropdown for selecting sensor
 * @param {int[]} data - array of sensors 
 * @param {method} handler - callback handler when data changed
 */
class SensorPicker extends Component<Props> {
    constructor(props) {
        super(props)
    }

    render() {
        const list = this.props.data.map((value, index) => ({
            value: this.props.data[index].sensorName
        }))

        return (
            <View style={{flex: 1}}>
                <Dropdown label='Sensor' data={list}
                            onChangeText={(value, index) => this.props.handler(index)}
                            value={this.props.selected}
                            overlayStyle={{alignContent: 'center'}}/>
            </View>
        )
    }
}

/**
 * Renders radio buttons on screen for selecting Public or Private
 * @param {boolean} privacy - Current true/false setting
 * @param {method} handler - callback handler when data changed
 */
class RadioButtons extends Component<Props> {
    constructor(Props) {
        super(Props)
    }

    render() {
        var radio_props = [
            {label: 'Private', value: false },
            {label: 'Public', value: true }
          ];

          return(
              <View style={{alignContent: 'center', flexDirection: 'row'}}>
                  <RadioForm
                    radio_props={radio_props}
                    initial={this.props.privacy}
                    formHorizontal={true}
                    labelHorizontal={false}
                    buttonColor={'red'}
                    animation={true}
                    onPress={(value) => this.props.handler(value)}
                    />
              </View>
          )
    }
}