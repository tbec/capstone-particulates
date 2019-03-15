import React, {Component} from 'react';
import {View, TouchableHighlight, Text, ImageBackground, Image, AsyncStorage} from 'react-native';
import {NavigationActions} from 'react-navigation'
import  styles  from '../StyleSheets/Styles';
import {LOGIN_NAME, PASSWORD, WEB_URL, SENSOR_ARRAY} from '../Components/Constants'
import {sensorFuncs} from '../Components/SensorObj'

export default class Home extends Component<Props> {
    constructor(props) {
        super(props)

        this.updateArrays = this.updateArrays.bind(this)
        this.getSensorsWebCall = this.getSensorsWebCall.bind(this)
        this.login = this.login.bind(this)
    }

    componentWillMount() {
        this.updateArrays()
    }

    /**
     * Get sensors from server and add locally
     */
    async updateArrays() {
        let _login

        // check if logged in previously
        await AsyncStorage.getItem(LOGIN_NAME).then((_retrieveData) => {
            if (_retrieveData == null) {
                return
            } else {
                _login = _retrieveData
            }})

        // try to login
        let res = await this.login(_login)
        
        // if successfully logged in, get account sensors
        if (res != null && JSON.parse(res).success) {
            let sensors = await this.getSensorsWebCall()
            let sensorJSON = JSON.parse(sensors)
            console.log("Got sensor JSON")

            sensorList = await AsyncStorage.getItem(SENSOR_ARRAY).then(res => JSON.parse(res))
            var newSensorList = []

            // for each loop to go through and add sensors
            for (let currSensor of sensorJSON) {
                for (let listSensor of sensorList) {
                    if (currSensor.DeviceName == sensorFuncs.getName(listSensor)) {
                        break;
                    }

                    // if did not find, add to list
                    _id = currSensor.DeviceId
                    _name = currSensor.DeviceName
                    _privacy = false
                    _sensorData = sensorFuncs.emptyWeek()

                    let newSensor = {id: _id, sensorName: _name, privacy: _privacy, sensorData: _sensorData};
                    newSensorList.push(newSensor)
                }
            }

            sensorList.push(newSensorList);

            // get data for each?

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
        let user = 'username=' + login
        let passwordParam = '&password=' + password

        let url = urlBase + user + passwordParam

        console.log('URL: ' + url)

        return fetch(url, {method: 'POST', credentials: 'include' })
            .then((response) => response.json())
            .then((responseJson) => {
            return responseJson })
            .catch((error) => { 
              console.log(error)
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
                                    action: NavigationActions.navigate({routeName: 'TrackerMenu'})})}>
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