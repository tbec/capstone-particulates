// Personal Tracker 
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import NavBar from '../Components/NavBar';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from '../StyleSheets/Styles';

export default class Tracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            path: [],
            pathCount: 0
        };
    }
    render() {
        return (
            <View style={styles.mapContainer}>
                <MapView
                    ref = {(ref)=>this.mapView=ref}
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    initialRegion={{
                        latitude: 37.8025259,
                        longitude: -122.4351431,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    <Polyline
                        coordinates={this.state.path}
                        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                        strokeColors={[
                            '#7F0000',
                            '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                            '#B24112',
                            '#E5845C',
                            '#238C23',
                            '#7F0000'
                        ]}
                        strokeWidth={6}
                    />
                </MapView>
                <Button title="Start Tracking" onPress={this.startTracking.bind(this)}></Button>
            </View>
        );
    }
    startTracking() {
        path = this.generateCoordinates();
        for (var start = 0; start < path.length; start++) {
            setTimeout(() => {
                this.setState((prevState) => {
                    newPath = [...prevState.path];
                    newPath.push(path[prevState.pathCount]);
                    return { path: newPath, pathCount: prevState.pathCount + 1 };
                });
                let r = {
                    latitude: this.state.path[this.state.pathCount-1].latitude,
                    longitude: this.state.path[this.state.pathCount-1].longitude,
                    latitudeDelta: .05,
                    longitudeDelta: .05,
                };
                this.mapView.animateToRegion(r, 500);
            }, 500 * start);
        }
    }
    generateCoordinates() {
        fakePath = [
            { latitude: 37.8025259, longitude: -122.4351431 },
            { latitude: 37.7896386, longitude: -122.421646 },
            { latitude: 37.7665248, longitude: -122.4161628 },
            { latitude: 37.7734153, longitude: -122.4577787 },
            { latitude: 37.7948605, longitude: -122.4596065 },
            { latitude: 37.8025259, longitude: -122.4351431 }
        ];
        newPath = [];
        split = 5;
        for (var start = 0; start < 5; start++) {
            startCoord = fakePath[start];
            endCoord = fakePath[start + 1];
            latIncrement = Math.abs(startCoord.latitude - endCoord.latitude) / split;
            lngIncrement = Math.abs(startCoord.longitude - endCoord.longitude) / split;
            for (var i = 0; i < split; i++) {
                newLat = startCoord.latitude < endCoord.latitude ? startCoord.latitude + (latIncrement*i) : startCoord.latitude - (latIncrement*i);
                newLng = startCoord.longitude < endCoord.longitude ? startCoord.longitude + (lngIncrement*i) : startCoord.longitude - (lngIncrement*i);
                newCoordinate = {
                    latitude: newLat,
                    longitude: newLng
                }
                newPath.push(newCoordinate);
            }
        }
        newPath.push(fakePath[fakePath.length-1]);
        return newPath;
    }
}