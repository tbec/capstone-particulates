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
                            <WebView style={{flex: 10}} source={{uri: 'http://www.google.com'}}/>
                        </View>
        }
        else {
            sensorPage = <View style={styles.home}>
                            <Text>You have not registered any sensors to view data.</Text>
                            <Text>Select below to register one now</Text>
                                <TouchableHighlight 
                                        style={styles.button}
                                        activeOpacity={30}
                                        underlayColor="yellow"
                                        onPress={() => this.props.navigation.navigate('SetupNew')}>
                                    <Text>Setup New Sensor</Text>
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