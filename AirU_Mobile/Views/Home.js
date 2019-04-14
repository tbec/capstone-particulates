import React, {Component} from 'react';
import {View, TouchableHighlight, Text, ImageBackground, Image, AsyncStorage} from 'react-native';
import {NavigationActions} from 'react-navigation'
import  styles  from '../StyleSheets/Styles';
import {LOGIN_NAME, PASSWORD, WEB_URL, SENSOR_ARRAY} from '../Components/Constants'
import {sensorFuncs} from '../Components/SensorObj'
import { accountFuncs } from '../Components/CommonFuncs';

export default class Home extends Component<Props> {
    constructor(props) {
        super(props)

        this.updateArrays = this.updateArrays.bind(this)
        this.getSensorsWebCall = this.getSensorsWebCall.bind(this)
    }

    componentWillMount() {
        //this.updateArrays()
        accountFuncs.updateArrays()
    }

    /**
     * Get sensors from server and add locally
     */
    async updateArrays() {
        let _login

        // try to login, return if could not or credentials not saved
        let res = await accountFuncs.loginKeychain()
        if (res == null) {
            return
        }
        
        // if successfully logged in, get account sensors
        if (res != null && JSON.parse(res).success) {
            let sensors = await this.getSensorsWebCall()
            let sensorJSON = JSON.parse(sensors)
            console.log("Got sensor JSON")

            // if no data, remove all sensors?
            if (sensorJSON == null) {
                AsyncStorage.setItem(SENSOR_ARRAY, null)
                return
            }

            sensorList = await AsyncStorage.getItem(SENSOR_ARRAY).then(res => JSON.parse(res))
            var newSensorList = []
            var inSensor = false

            // for each loop to go through and add sensors
            for (let currSensor of sensorJSON) {
                inSensor = false

                // check if exists, if so add to list
                if (sensorList != null) {
                    for (let listSensor of sensorList) {
                        if (currSensor.DeviceName == sensorFuncs.getName(listSensor)) {
                            inSensor = true
                            newSensorList.push(currSensor)
                            break;
                        }
                    }
                }

                if (inSensor) {
                    continue;
                }

                // if did not find, add to list
                _id = currSensor.DeviceId
                _name = currSensor.DeviceName
                _privacy = false
                _sensorData = sensorFuncs.emptyWeek()

                let newSensor = {id: _id, sensorName: _name, privacy: _privacy, sensorData: _sensorData};
                newSensorList.push(newSensor)
            }

            if (newSensorList == null) {
                newSensorList = []
            }

            // add sensor and finish
            AsyncStorage.setItem(SENSOR_ARRAY, JSON.stringify(newSensorList))
            console.log("Wrote sensors")
        }
    }

    /**
     * Gets sensors associated with account
     */
    async getSensorsWebCall() {
        let urlBase = WEB_URL + '/user/devices'
        let url = urlBase

        console.log('URL: ' + url)

        // format returned [DeviceID: .... DeviceName: ....]
        return fetch(url, {method: 'GET', credentials: 'include' })
            .then((response) => response.json())
            .then((responseJson) => {
            return responseJson })
          .catch((error) => { 
              console.error(log)
              return null
        })
    }

    render() {
        return (
                <View style={styles.container}>
                    <ImageBackground source={require('../Resources/home_background.jpg')} style={{width: '100%', height: '100%'}}>
                        <View style={styles.header}>
                            <Image source={require('../Resources/AQ_Logo.png')} style={{width: '100%', height: '100%'}}/>
                        </View>
                        <View style={[styles.home, {flex: 100}]}>
                            {/* Setup/Sensor */}
                            <TouchableHighlight 
                                testID={'SensorButton'}
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate({
                                    routeName: 'Tabs',
                                    params: {},
                                    action: NavigationActions.navigate({routeName: 'Sensor'})})}>
                                    <Text style={styles.buttonText}>Sensor</Text>
                            </TouchableHighlight>
                            {/* Personal Exposure Tracker */}
                            <TouchableHighlight 
                                testID={'TrackerButton'}
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate({
                                    routeName: 'Tabs',
                                    params: {},
                                    action: NavigationActions.navigate({routeName: 'Track'})})}>
                                    <Text style={styles.buttonText}>Personal Tracker</Text>
                            </TouchableHighlight>
                            {/* AQandU Map page */}
                            <TouchableHighlight 
                                testID={'MapButton'}
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate({
                                    routeName: 'Tabs',
                                    params: {},
                                    action: NavigationActions.navigate({routeName: 'Map'})})}>
                                    <Text style={styles.buttonText}>Sensor Map</Text>
                            </TouchableHighlight>
                            {/* Settings */}
                            <TouchableHighlight 
                                testID={'SettingsButton'}
                                style={styles.button}
                                onPress={() => this.props.navigation.navigate({
                                    routeName: 'Tabs',
                                    params: {},
                                    action: NavigationActions.navigate({routeName: 'Settings'})})}>
                                    <Text style={styles.buttonText}>Settings</Text>
                            </TouchableHighlight>
                            </View>
                        </ImageBackground>
                </View>
        );
    }
}