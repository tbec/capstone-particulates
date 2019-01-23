/**
 * Final confirmation screen for setup process
 **/

import React, {Component} from 'react';
import {Text, View, TouchableHighlight, Image, AsyncStorage} from 'react-native';
import styles from '../../StyleSheets/Styles'
import { NavigationActions, StackActions } from 'react-navigation'
import { SENSOR_ARRAY } from '../../Components/Constants'

export default class Confirmation extends Component<Props> {
    constructor(props) {
        super(props)
    }

    // saves sensor after clicking final confirmation button, then navs to sensor screen
    async saveSensor() {
        // get sensor information if already saved any previously
        var sensors = []
        await AsyncStorage.getItem(SENSOR_ARRAY).then((_retrieveData) => {
            if (_retrieveData == null) {
                sensors = []
            }
            else {
                sensors = _retrieveData
            }
        })

        // get privacy, get array, JSON, save
        let privacy = this.props.navigation.getParam('privacy', 'false');
        let name = this.props.navigation.getParam('sensorName', 'NewSensor');
        let sensor = {id: 'AB-CD-EF-GF', sensorName: name};
        sensors.push(sensor);
        var json = JSON.stringify(sensors);

        // send JSON to server to add to profile

        // save sensors again to local storage
        await AsyncStorage.setItem('Sensors', json);

        // navigate back to Sensor page
        let reset = StackActions.reset({
            index: 0, 
            actions:  [NavigationActions.navigate({
                routeName: 'Tabs',
                params: {},
                action: NavigationActions.navigate('Sensor', {sensor: 'sensor'})})]
        });
        this.props.navigation.dispatch(reset);
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