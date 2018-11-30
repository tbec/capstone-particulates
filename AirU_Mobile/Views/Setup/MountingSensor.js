/**
 * Instructions for mounting sensor setup page
 */

import React, {Component} from 'react';
import {Text, View, TouchableHighlight, Image} from 'react-native';
import NavBar from '../../Components/NavBar'
import styles from '../../StyleSheets/Styles'

export default class ReviewFirst extends Component<Props> {
    render() {
        return (
            <View style={styles.mainView}>
                <View style={{flex: 10}}>
                    <View style={{flex: 1}}>
                        <Text>Find a suitible spot to mount the sensor outside. The location you choose should be: </Text>
                        <Text/>
                        <Text> 1. Near a power outlet</Text>
                        <Text> 2. Near a WiFi connection</Text>
                        <Text> 3. At least 4 ft. above ground</Text>
                        <Text> 4. Protected from rain and snow</Text>
                        <Text> 5. Away from exhast vents</Text>
                        <Text/>
                        <Text>Once a spot is found, use the zip ties to fix to the location and plug in the sensor</Text>
                    </View>
                    <Image source={require('../../Resources/SensorMounting.png')} 
                            style={{width: '40%', height: '10%', flex: 1, alignContent: 'center', justifyContent: 'center'}}/>
                    <View style={{flex: 1}}>
                        <Text/>
                        <Text>After this is complete and the sensor has powered on, proceed to the next step</Text>
                        <Text/>
                    </View>
                </View>
                <NavBar navigation={this.props.navigation} next='ConnectionSetup' previous='ReviewFirst'/>
            </View>
        );
    }
}