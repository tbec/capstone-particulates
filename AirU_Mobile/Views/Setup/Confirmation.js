/**
 * Final confirmation screen for setup process
 **/

import React, {Component} from 'react';
import {Text, View, TouchableHighlight, Image, AsyncStorage} from 'react-native';
import styles from '../../StyleSheets/Styles'
import {NavigationActions} from 'react-navigation'

export default class Confirmation extends Component<Props> {
    saveSensor() {
        _storeData = async () => {
            try {
              await AsyncStorage.setItem('@SensorName:key', 'Sensor');
            } catch (error) {
              // Error saving data
            }
          }
    }

    render() {
        this.saveSensor();
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
                                        onPress={() => this.props.navigation.navigate({
                                            routeName: 'Tabs',
                                            params: {},
                                            action: NavigationActions.navigate({routeName: 'Sensor'})})}>
                        <Text>Complete Setup</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}