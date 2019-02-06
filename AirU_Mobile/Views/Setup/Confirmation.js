/**
 * Final confirmation screen for setup process
 **/

import React, {Component} from 'react';
import {Text, View, TouchableHighlight, Image, AsyncStorage} from 'react-native';
import styles from '../../StyleSheets/Styles'
import { NavigationActions, StackActions } from 'react-navigation'
import { SENSOR_ARRAY, WEB_URL, LOGIN, PASSWORD, SENSOR_NAME, SENSOR_PRIVACY, SENSOR_ID } from '../../Components/Constants'

export default class Confirmation extends Component<Props> {
    constructor(props) {
        super(props)
    }

    /**
     * Saves sensor after final confirmation buttoin both locally and in server, then navigates
     *  back to main sensor overview screen
     */
    async saveSensor() {
        // get sensor information if already saved any previously
        var sensors = []
        await AsyncStorage.getItem(SENSOR_ARRAY).then((_retrieveData) => {
            if (_retrieveData == null) {
                sensors = []
            }
            else {
                sensors = JSON.parse(_retrieveData)
            }
        })

        // get privacy, get array, JSON, save
        let privacySetting = this.props.navigation.getParam(SENSOR_PRIVACY, 'false');
        let name = this.props.navigation.getParam(SENSOR_NAME, 'NewSensor');
        let sensor = {id: 'ABCDEFGH', sensorName: name, privacy: privacySetting};
        var json = JSON.stringify(sensors);

        // send JSON to server to add to profile
        let success = this.webCall();

        if (success) {
            // save sensor if added successfully
            sensors.push(sensor);

            // save sensors again to local storage
            await AsyncStorage.setItem(SENSOR_ARRAY, json);

            // navigate back to Sensor page
            let reset = StackActions.reset({
                index: 0, 
                actions:  [NavigationActions.navigate({
                    routeName: 'Tabs',
                    params: {},
                    action: NavigationActions.navigate('Sensor', {sensor: 'sensor'})})]
            });
            this.props.navigation.dispatch(reset);
        } else {

        }
    }

    /**
     * Makes calls to login and addDevice URL endpoints
     */
    async webCall() {
        // get username
        let username
        await AsyncStorage.getItem(LOGIN).then((_retrieveData) => {
            if (_retrieveData == null) {
                // error
            }
            else {
                username = _retrieveData
            }
        })

        // login
        result = this.login(username)
        let res = result.json()
        if (!res.success) {
            // display error
            return false
        }

        // add the device and return result
        result = this.addDevice(username)
        res = result.json()
        
        return res.success
    }

    /**
     * Logs into the site, must call before adding device
     */
    async login(login) {
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

    async addDevice(username) {
        let urlBase = WEB_URL + '/device/add?'
        let user = 'username=' + username
        let name = '&devicename=' + this.props.navigation.getParam(SENSOR_NAME, 'NewSensor')
        let privacy = '&visable=' + this.props.navigation.getParam(SENSOR_PRIVACY, 'NewSensor')
        let id = '&deviceid=' + this.props.navigation.getParam(SENSOR_ID, 'NewSensor')

        let url = urlBase + user + name + id + privacy

        console.log('URL: ' + url)

        return fetch(url, {method: 'POST'})
            .then((response) => response.json())
            .then((responseJson) => {
            return responseJson })
          .catch((error) => { console.error(error)})
    }

    render() {
        return (
            <View style={styles.mainView}>
                <View style={{flex: 3}}>
                    <Text>Sensor setup complete! If you have not finished mounting and securing your sensor already, please do so now.</Text>
                    <Text></Text>
                    <Text>If you need to adjust the settings for your sensor, you can do so in the settings</Text>
                    <Text/>
                    <Text>Thank you for purchasing an AirU Sensor!</Text>
                    <Text/>
                    <Image source={require('../../Resources/Confirmation.jpg')} style={{width: '100%', height: '100%', flex: 4, alignContent: 'center'}}/>
                </View>
                <View style={[styles.home, {flex: 1}]}>
                    <TouchableHighlight style={styles.button} 
                                        onPress={() => this.saveSensor()}>
                        <Text style={styles.buttonText}>Complete Setup</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}