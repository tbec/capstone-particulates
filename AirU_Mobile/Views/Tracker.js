import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import NavBar from '../Components/NavBar';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from '../StyleSheets/Styles';

export default class Tracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathArray: [],
        };
    }
    render() {
        return (
            <View style={styles.mapContainer}>
                <MapView
                    ref={(ref) => this.mapView = ref}
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    initialRegion={{
                        latitude: 37.8025259,
                        longitude: -122.4351431,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    {this.state.pathArray.map((path, index) =>
                        <MapView.Polyline
                            index={index}
                            coordinates={path.path}
                            strokeWidth={5}
                            strokeColor={path.color} />
                    )}
                </MapView>
                <Button title="Start Tracking" onPress={this.startTracking.bind(this)}></Button>
            </View>
        );
    }
    startTracking() {
        path = this.generateCoordinates();
        var count = 0;
        for (var i = 0; i < path.length - 1; i ++) {
            setTimeout(() => {
                this.setState((prevState) => {
                    color = this.averageTwoColors(path[count].color, path[count+1].color);
                    newPathCoords = {color:color, path: [path[count], path[count+1]]};
                    oldPathArray = [...prevState.pathArray];
                    oldPathArray.push(newPathCoords);
                    return { pathArray: oldPathArray };
                });
                let r = {
                    latitude: path[count + 1].latitude,
                    longitude: path[count + 1].longitude,
                    latitudeDelta: .05,
                    longitudeDelta: .05,
                };
                count ++;
                this.mapView.animateToRegion(r, 50);
            }, 50 * i);
        }
    }
    generateCoordinates() {
        fakePath = [
            { latitude: 37.8025259, longitude: -122.4351431, pollution: .16, color: this.pollutionColor(.1) },
            { latitude: 37.7896386, longitude: -122.421646, pollution: .20, color: this.pollutionColor(.2) },
            { latitude: 37.7665248, longitude: -122.4161628, pollution: .3, color: this.pollutionColor(.3) },
            { latitude: 37.7734153, longitude: -122.4577787, pollution: .4, color: this.pollutionColor(.6) },
            { latitude: 37.7948605, longitude: -122.4596065, pollution: .7, color: this.pollutionColor(.9) },
            { latitude: 37.8025259, longitude: -122.4351431, pollution: .1, color: this.pollutionColor(.1) }
        ];
        newPath = [];
        split = 20;
        for (var i = 0; i < 5; i++) {
            start = fakePath[i];
            end = fakePath[i + 1];
            latIncrement = Math.abs(start.latitude - end.latitude) / split;
            lngIncrement = Math.abs(start.longitude - end.longitude) / split;
            for (var j = 0; j < split; j++) {
                newLat = start.latitude < end.latitude ? start.latitude + (latIncrement * j) : start.latitude - (latIncrement * j);
                newLng = start.longitude < end.longitude ? start.longitude + (lngIncrement * j) : start.longitude - (lngIncrement * j);
                newCoordinate = {
                    latitude: newLat,
                    longitude: newLng,
                    color: this.calculateGradientColor(start.color, end.color, split, j)
                }
                newPath.push(newCoordinate);
            }
        }
        newPath.push(fakePath[fakePath.length - 1]);
        return newPath;
    }

    calculateGradientColor(startColor, endColor, split, splitIndex){
        //get the red green and blue number values from their hex strings
        //values will be between 0 and 255
        startRed = parseInt("0x" + startColor.substring(1, 3));
        startGreen = parseInt("0x" + startColor.substring(3, 5));
        startBlue = parseInt("0x" + startColor.substring(5));
        endRed = parseInt("0x" + endColor.substring(1, 3));
        endGreen = parseInt("0x" + endColor.substring(3, 5));
        endBlue = parseInt("0x" + endColor.substring(5));
        //calculate the difference between the start and end colors
        redInterval = Math.abs(startRed - endRed);
        greenInterval = Math.abs(startGreen - endGreen);
        blueInterval = Math.abs(startBlue - endBlue);
        //we will either be adding to or taking away from the color values depending on whether the end color is greater than the start color
        //the amount we increment by will be the overall interval divided by the sections that the line is 'split' into
        redInc = (endRed > startRed) ? redInterval/split : -redInterval/split;
        blueInc = (endBlue > startBlue) ? blueInterval/split: -blueInterval/split;
        greenInc = (endGreen > startGreen) ? greenInterval/split: -greenInterval/split;
        //the resulting color values will be the starting color + the increment multiplied by the place we are along the gradient line(split index)
        resultRed = Math.round(startRed + (redInc * splitIndex));
        resultBlue = Math.round(startBlue + (blueInc * splitIndex));
        resultGreen = Math.round(startGreen + (greenInc * splitIndex));
        //convert these numbers back into hex and form our hex color string
        redHex = (resultRed).toString(16);
        blueHex = (resultBlue).toString(16);
        greenHex = (resultGreen).toString(16);
        if(redHex.length == 1){
            redHex += "0"
        }
        if(blueHex.length == 1){
            blueHex += "0"
        }
        if(greenHex.length == 1){
            greenHex += "0"
        }
        return "#"+redHex+greenHex+blueHex;
    }

    averageTwoColors(color1, color2){
        red1 = parseInt("0x" + color1.substring(1, 3));
        green1 = parseInt("0x" + color1.substring(3, 5));
        blue1 = parseInt("0x" + color1.substring(5));
        red2 = parseInt("0x" + color2.substring(1, 3));
        green2 = parseInt("0x" + color2.substring(3, 5));
        blue2 = parseInt("0x" + color2.substring(5));
        resultRed = (Math.round((red1 + red2)/2)).toString(16);
        resultGreen = (Math.round((green1 + green2)/2)).toString(16);
        resultBlue = (Math.round((blue1 + blue2)/2)).toString(16);
        if(resultRed.length == 1){
            resultRed += "0"
        }
        if(resultBlue.length == 1){
            resultBlue += "0"
        }
        if(resultGreen.length == 1){
            resultGreen += "0"
        }
        return "#"+resultRed+resultGreen+resultBlue;
    }

    pollutionColor(pollution){
        if (pollution >= 0 && pollution < .25){
            return "#00ff00";
        } else if(pollution >= .25 && pollution < .5){
            return "#ffff00";
        } else if(pollution >= .5 && pollution < .75){
            return "#ffa500";
        } else if(pollution >= .75 && pollution <= 1){
            return "#ff0000";
        }
    }
}