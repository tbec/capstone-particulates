// shows sensor data
import React, {Component} from 'react';
import {Text, Image, View, ImageBackground, TouchableHighlight, AsyncStorage, Platform} from 'react-native';
import styles from '../../StyleSheets/Styles'
import Icon from 'react-native-vector-icons/Ionicons'
import SensorDisplay from './SensorDisplay';
import { SENSOR_ARRAY } from '../../Components/Constants'

export default class Sensor extends Component<Props> {

    // checks if user has logged in previously
    constructor(Props) {
        super(Props);
        this.state = {sensors: false};
        this.checkSensors();
    }

    // checks if sensor has been registered already. If no goes to sensor page, if yes 
    // displays information
    checkSensors() {
        AsyncStorage.getItem(SENSOR_ARRAY).then((_retrieveData) => {
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
                            <View style={[styles.navBar, {height: 50}]}>
                                <TouchableHighlight 
                                        style={styles.nextButton}
                                        activeOpacity={30}
                                        underlayColor="yellow"
                                        onPress={() => this.props.navigation.navigate('Setup')}>
                                    <Icon name={Platform.OS === "ios" ? "ios-add" : "md-add"} size={40}/>
                                </TouchableHighlight>
                            </View>
                            <SensorDisplay/>
                        </View>
        }
        // prompt to setup sensor
        else {
            sensorPage = <View style={styles.container}>
                            <ImageBackground source={require('../../Resources/home_background.jpg')} style={{width: '100%', height: '100%'}}>
                            <View style={styles.home}>
                                <Text style={[styles.buttonText, {color: 'white', fontSize: 20}]}>You have not setup any sensors</Text>
                                <Text style={[styles.buttonText, {color: 'white', fontSize: 20}]}>Tap below to get started</Text>
                                <TouchableHighlight 
                                        style={{alignItems: 'center', justifyContent: 'center', 
                                            height: '50%', width: '90%', borderColor: 'white', borderWidth: 2}}
                                        activeOpacity={30}
                                        underlayColor="yellow"
                                        onPress={() => this.props.navigation.navigate('Setup')}>
                                    {/* <Text style={styles.buttonText}>Setup New Sensor</Text> */}
                                    <Image source={require('../../Resources/sensor_image.png')} style={{width: '100%', height: '100%'}}/>
                                </TouchableHighlight>
                                </View>
                            </ImageBackground>
                        </View>;
        }
        return (
            <View style={{flex: 1}}>
                {sensorPage}
            </View>
        );
    }
}