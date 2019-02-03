// settings screen

import React, {Component} from 'react';
import {Text, View, TouchableHighlight, ImageBackground, Linking, Alert, AsyncStorage} from 'react-native';
import styles from '../../StyleSheets/Styles'
import { SENSOR_ARRAY } from '../../Components/Constants'

/**
 * Main settings window, contains various buttons to perform actions
 */
export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.getSensorList = this.getSensorList.bind(this)
        this.getSensors = this.getSensors.bind(this)
        this.state = ({devices: false})
    }

    componentWillMount() {
        this.getSensors()
    }

    async getSensors() {
        let sensorsList = await this.getSensorList();
        if (sensorsList != null) {
            this.setState({devices: true})
        } else {
            this.setState({devices: false})
        }
    }

    async getSensorList() {
        return await AsyncStorage.getItem(SENSOR_ARRAY).then(res => JSON.parse(res))
    }

    reset() {
        Alert.alert(
            'Reset Settings',
            'Are you sure you want to reset settings?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: () => {
                    AsyncStorage.clear();
                    this.props.navigation.navigate('Sensor', {sensor: false});
                }},
            ],
          )
    }

    render() {
        let settings;
        if (this.state.devices == true) {
            settings = <Setting text="Edit Device Settings" action={() => this.props.navigation.navigate('EditDevice')}/>
        }

        return (
            <View style={styles.container}>
            <ImageBackground source={require('../../Resources/home_background.jpg')} style={{width: '100%', height: '100%'}}>
                    <View style={{flex: 1, alignContent: 'flex-start', 
                                    justifyContent: 'center', flexDirection: 'row', paddingTop: 20}}>
                        <Text>Settings</Text>
                    </View>
                    <View style={[styles.home, {flex: 10}]}>
                        {settings}
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
 * Values: 
 *  text: String - text to display on button
 *  action: action - action to perform onPress
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