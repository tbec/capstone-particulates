// Personal Tracker 
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import NavBar from '../Components/NavBar';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';


export default class Tracker extends Component {
    render() {
        var style = require('../StyleSheets/Styles');
        return (
            <View style={style.mapContainer}>
                <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={style.map}
                    region={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                >
                </MapView>
            </View>
        );
    }
}