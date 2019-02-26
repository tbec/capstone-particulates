import React, {Component} from 'react';
import {View, TouchableHighlight, Text, ImageBackground, Image, AsyncStorage} from 'react-native';
import {NavigationActions} from 'react-navigation'
import  styles  from '../StyleSheets/Styles';
import {LOGIN_NAME, PASSWORD, WEB_URL} from '../Components/Constants'

export default class Home extends Component<Props> {
    constructor(props) {
        super(props)

        this.updateArrays = this.updateArrays.bind(this)
        this.webCall = this.webCall.bind(this)
        this.login = this.login.bind(this)
    }

    componentWillMount() {
        this.updateArrays()
    }

    async updateArrays() {
        let _login

        await AsyncStorage.getItem(LOGIN_NAME).then((_retrieveData) => {
            if (_retrieveData == null) {
                return
            } else {
                _login = _retrieveData
            }})

        let res = await this.login(_login)
        results = JSON.parse(res)
        if (results.success) {
            let sensors = await this.webCall()
            sensors = sensors.replace()
            let sensorJSON = JSON.parse(sensors)
            console.log("Got JSON")

            // for each loop to go through and add sensors

            // get data for each
            
        }
    }

    async webCall() {
        let urlBase = WEB_URL + '/user/devices'
        let url = urlBase

        console.log('URL: ' + url)

        return fetch(url, {method: 'GET', credentials: 'include' })
            .then((response) => response.json())
            .then((responseJson) => {
            return responseJson })
          .catch((error) => { console.error(error)})
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
          .catch((error) => { console.error(error)})
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
                                    action: NavigationActions.navigate({routeName: 'Tracker'})})}>
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