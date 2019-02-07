/**
 * Screen for privacy settings
 **/ 

import React, {Component} from 'react';
import {Text, View, TouchableHighlight,Image} from 'react-native';
import NavBar from '../../Components/NavBar'
import styles from '../../StyleSheets/Styles'
import { SENSOR_NAME, SENSOR_ID} from '../../Components/Constants'

export default class Privacy extends Component<Props> {
    constructor(props) {
        super(props);
    }

    // after selecting option, sets as appropriate 
    setPrivacy(value) {
        let name = this.props.navigation.getParam(SENSOR_NAME, 'NewSensor')
        let id = this.props.navigation.getParam(SENSOR_ID, 'NewSensor')
        this.props.navigation.navigate('Confirmation', {sensorName: name, sensorID: id,  privacy: value});
    }

    render() {
        return (
            <View style={styles.mainView}>
                <View style={{flex: 5, alignContent: 'center', justifyContent: 'center'}}>
                    <Text style={{flex: 2}}>Your sensor has been successfully connected!
                        Would you like to make your sensor visable publically? 
                        This will allow people to view your sensor's location on a map and for researchers to directly use and access 
                        the data your sensor gathers.
                    </Text>
                    <Text/>
                    <Image source={require('../../Resources/SensorPrivacy.png')} style={{width: '100%', height: '100%', flex: 4, alignContent: 'center'}}/>
                </View>
                {/* choice section */}
                <View style={[styles.home, {flex: 3}]}>
                    <TouchableHighlight style={styles.button} testID={'setPrivacyTrue'}
                            onPress={() => this.setPrivacy(true)}>
                        <Text style={styles.buttonText}>Allow</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.button} testID={'setPrivacyFalse'}
                        onPress={() => this.setPrivacy(false)}>
                        <Text style={styles.buttonText}>Deny</Text>
                    </TouchableHighlight>
                </View>
                <NavBar navigation={this.props.navigation} previous='ConnectionSetup'/>
            </View>
        );
    }
}