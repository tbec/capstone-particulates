// shows sensor data

import React, {Component} from 'react';
import {Text, View, WebView, TouchableHighlight, AsyncStorage, Platform} from 'react-native';
import styles from '../../StyleSheets/Styles'
import Icon from 'react-native-vector-icons/Ionicons'

export default class Sensor extends Component<Props> {

    // checks if user has logged in previously
    constructor(Props) {
        super(Props);
        this.state = {sensors: false}
        this.checkSensors();
    }

    // checks if sensor has been registered already. If no goes to sensor page, if yes 
    // displays information
    checkSensors() {
        AsyncStorage.getItem('SensorName').then((_retrieveData) => {
            if (_retrieveData == null) {
                this.setState({ sensors: false})
            }
            else {
                this.setState({sensors: true})
            }
        })
    }

    componentWillReceiveProps(newProps) {
        this.checkSensors();
    }

    render() {
        // sensor page
        if (this.state.sensors) {
            sensorPage = <View style={{flex: 1}}>
                            <View style={styles.navBar}>
                                <TouchableHighlight 
                                        style={styles.nextButton}
                                        activeOpacity={30}
                                        underlayColor="yellow"
                                        onPress={() => this.props.navigation.navigate('SetupNew')}>
                                    <Icon name={Platform.OS === "ios" ? "ios-add" : "md-add"} size={40}/>
                                </TouchableHighlight>
                            </View>
                            <WebView style={{flex: 10}} source={{uri: 'http://127.0.0.1:5002:/graph'}}/>
                        </View>
        }
        // prompt to setup sensor
        else {
            sensorPage = <View style={styles.home}>
                            <Text>You have not registered any sensors to view data.</Text>
                            <Text>Select below to register one now</Text>
                                <TouchableHighlight 
                                        style={styles.button}
                                        activeOpacity={30}
                                        underlayColor="yellow"
                                        onPress={() => this.props.navigation.navigate('Setup')}>
                                    <Text style={styles.buttonText}>Setup New Sensor</Text>
                            </TouchableHighlight>
                        </View>;

        }
        return (
            <View style={{flex: 1}}>
                {sensorPage}
            </View>
        );
    }
}