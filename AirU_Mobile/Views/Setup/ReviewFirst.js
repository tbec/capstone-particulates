/**
 * Main setup page
 */

import React, {Component} from 'react';
import {Text, View, TouchableHighlight, Image, ScrollView, StyleSheet} from 'react-native';
import styles from '../../StyleSheets/Styles'
import NavBar from '../../Components/NavBar'

export default class ReviewFirst extends Component<Props> {
    render() {
        return (
            <ScrollView contentContainerStyle={[styles.mainView, {paddingTop: 5}]} 
                        showsVerticalScrollIndicator={true}>
                <View style={[styles.header, {flex: 1}]}>
                    <Image source={require('../../Resources/Setup_Packaging.png')} style={{width: 400, height: 45}}/>
                </View>
                <Text>Before proceeding, please confirm the following items were in your AirU box: </Text>
                <Text/>
                <View style={{flex: 4, flexDirection: 'row', backgroundColor: 'powderBlue'}}>
                        <View style={{flex: 2, flexDirection: 'column', justifyContent: 'center'}}>
                            <Text style={{padding: 5}}>* AirU Sensor</Text>
                            <Text style={{padding: 5}}>* 2 zip ties</Text>
                            <Text style={{padding: 5}}>* Power cord</Text>
                        </View>
                        <Image source={require('../../Resources/SensorBox.png')} style={{width: '50%', height: '100%', flex: 3}}/>
                    </View>
                    <Text/>
                    <Text style={{flex: 1}}>On the back of the sensor, make sure there is a stickers</Text>
                    <Image source={require('../../Resources/SensorStickers.png')} style={{width: '60%', height: '50%', flex: 3}}/>
                    <Text/>
                    <Text style={{flex: 1}}>This contains the MAC address which will be used to connect to the sensor</Text>
                    <Text style={{flex: 1}}>After confirming everything, please proceed to connecting to the sensor</Text>
                    <NavBar navigation={this.props.navigation} next='MountingSensor'/>
            </ScrollView>
        );
    }
}