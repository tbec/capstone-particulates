/**
 * Main setup page
 */

import React, {Component} from 'react';
import {Text, View, TouchableHighlight, Image} from 'react-native';
import styles from '../../StyleSheets/Styles'

export default class ReviewFirst extends Component<Props> {

    render() {
        return (
            <View style={styles.mainView}>
                <Text>Find a suitible spot to mount the sensor outside. The location you choose should be: </Text>
                <Text> 1. Near a power outlet</Text>
                <Text> 2. Near a WiFi connection</Text>
                <Text> 3. At least 4 ft. above ground</Text>
                <Text> 4. Protected from rain and snow</Text>
                <Text> 5. Away from exhast vents</Text>
                <Text/>
                <Text>Once a spot is found, use the zip ties to fix to the location and plug in the sensor</Text>
                <Image source={require('../../Resources/SensorMounting.png')} 
                        style={{width: '40%', height: '10%', flex: 1, alignContent: 'center', justifyContent: 'center'}}/>
                <Text/>
                <Text>After this is complete and the sensor has powered on, proceed to the next step</Text>
                <Text/>
                
                {/* handles nav bar at bottom of screen */}
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableHighlight 
                        style={styles.previousButton}
                        onPress={() => this.props.navigation.navigate('ReviewFirst')}>
                            <Image source={require('../../Resources/previous.png')} style={styles.nextButton}/>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={styles.nextButton}
                        onPress={() => this.props.navigation.navigate('BluetoothSetup')}>
                            <Image source={require('../../Resources/next.png')} style={styles.nextButton}/>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}