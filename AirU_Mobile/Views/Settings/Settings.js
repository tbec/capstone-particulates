// settings screen

import React, {Component} from 'react';
import {Text, View, TouchableHighlight, ImageBackground, Linking, Alert, AsyncStorage} from 'react-native';
import styles from '../../StyleSheets/Styles'
import { SENSOR_ARRAY, LOGIN_NAME, PASSWORD, WEB_URL } from '../../Components/Constants'
import { StackActions, NavigationActions } from 'react-navigation';

/**
 * Main settings window, contains various buttons to perform actions
 */
export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.getSensorList = this.getSensorList.bind(this)
        this.getSensors = this.getSensors.bind(this)
        this.checkLogin = this.checkLogin.bind(this)

        this.state = ({devices: false, deviceList: [], loggedIn: false})
    }

    componentWillMount() {
        this.getSensors()
        this.checkLogin()
    }

    /**
     * Returns list of saved sensors
     */
    async getSensors() {
        let sensorsList = await this.getSensorList();
        if (sensorsList != null) {
            this.setState({devices: true, deviceList: sensorsList})
        } else {
            this.setState({devices: false})
        }
    }

    async getSensorList() {
        return await AsyncStorage.getItem(SENSOR_ARRAY).then(res => JSON.parse(res))
    }

    async checkLogin() {
        await AsyncStorage.getItem(LOGIN_NAME).then((_retrieveData) => {
            if (_retrieveData == null) {
                this.setState({loggedIn: false})
            }
            else {
                this.setState({loggedIn: true})
            }
        })
    }

    /**
     * Used to reset all settings, removing logins and sensor by callign AsyncStorage.clear()
     */
    reset() {
        Alert.alert(
            'Reset Settings',
            'Are you sure you want to reset settings?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: () => {
                    AsyncStorage.clear();
                    let reset = StackActions.reset({
                        index: 0, 
                        actions:  [NavigationActions.navigate({
                            routeName: 'Tabs',
                            params: {},
                            action: NavigationActions.navigate('Sensor', {sensor: 'sensor'})})]
                    });
                    this.props.navigation.dispatch(reset);
                }},
            ],
          )
    }

    logout() {
        Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: () => {
                    AsyncStorage.setItem(LOGIN_NAME, null)
                    AsyncStorage.setItem(PASSWORD, null)
                    let url = WEB_URL + '/logout'
                    fetch(url, {method: 'POST', credentials: 'include' })
                        .catch((error) => { console.error(error)})
                    this.props.navigation.navigate('Sensor', {sensor: false});
                }},
            ],
          )
    }

    render() {
        let editDevice, log;
        if (this.state.devices) {
            editDevice = <Setting text="Edit Devices" 
                action={() => this.props.navigation.navigate('EditDevice', 
                                    { sensorList: this.state.deviceList})}/>
        }

        if (this.state.loggedIn) {
            log = <Setting text="Logout" action={() => this.logout()}/>
        } else {
            log = <Setting text="Login" action={() => 
                    this.props.navigation.navigate('Login', {return: true})}/>
        }

        return (
            <View style={styles.container}>
            <ImageBackground source={require('../../Resources/home_background.jpg')} style={{width: '100%', height: '100%'}}>
                    <View style={{flex: 1, alignContent: 'flex-start', 
                                    justifyContent: 'center', flexDirection: 'row', paddingTop: 20}}>
                        <Text>Settings</Text>
                    </View>
                    <View style={[styles.home, {flex: 10}]}>
                        {log}
                        {editDevice}
                        <Setting text="Reset Settings" action={() => this.reset()}/>
                        <Setting text="Contact AirU" action={() => Linking.openURL('mailto:aqandu@utah.edu')}/>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

/**
 * Corresponds to a setting button. 
 * @param {string} text - text to display on button
 * @param {function} action - function to call on press

 */
class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {action: props.action, text: props.text}
    }

    render() {
        return (
            <View>
                <TouchableHighlight 
                        style={styles.button}
                        activeOpacity={30}
                        underlayColor="yellow"
                        onPress={this.state.action}
                        >
                    <Text style={styles.buttonText}>{this.state.text}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}