import React, { Component } from 'react';
import { Platform, Alert, StyleSheet, Text, View, Button, Slider, ActivityIndicator } from 'react-native';
import NavBar from '../../Components/NavBar';
import TrackerGraph from './TrackerGraph';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from '../../StyleSheets/Styles';
import { NavigationActions } from 'react-navigation';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';

export default class Tracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathArray: [],
            allPoints: [],
            pollutionData: [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80],
            sliderValue: 0,
            markerPos: { latitude: 37.8025259, longitude: -122.4351431 },
            currentPosition: { latitude: 37.8025259, longitude: -122.4351431 },
            gettingLocation: true,
            startTracking: true,
            stopTracking: false,
            viewData: false,
            graph: false
        };
    }

    async componentDidMount() {
        BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 5,
            distanceFilter: 5,
            notificationTitle: 'Background tracking',
            notificationText: 'enabled',
            startOnBoot: false,
            debug: false,
            stopOnTerminate: true,
            locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
            interval: 5000,
            fastestInterval: 5000,
            activitiesInterval: 10000,
            stopOnStillActivity: false,
        });
        BackgroundGeolocation.getCurrentLocation((position) => {
            this.animateToRegion(position.latitude, position.longitude);
            this.setState({
                currentPosition: { latitude: position.latitude, longitude: position.longitude },
                gettingLocation: false
            });
        }, (error) => {
            alert(error.message);
            this.setState({ gettingLocation: false });
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 });
    }

    componentWillUnmount() {
        BackgroundGeolocation.stop();
        BackgroundGeolocation.removeAllListeners();
    }

    render() {
        let button, trackerGraph, slider, icon, currentPosition, gettingLocation;
        const sliderValue = this.state.sliderValue;
        if (this.state.gettingLocation) {
            gettingLocation = <ActivityIndicator size="large" color="#0000ff" style={{
                position: 'absolute', left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center'
            }} />
        }
        currentPosition = <Marker
            coordinate={this.state.currentPosition}
            image={require('../../Resources/pin.png')}
        />
        if (this.state.startTracking) {
            button = <Button title="Start Tracking" onPress={this.startTracking.bind(this)}></Button>
        }
        else if (this.state.stopTracking) {
            button = <Button title="Stop" onPress={this.stopTracking.bind(this)}></Button>
        } else if (this.state.viewData) {
            button = <Button title="View Data" onPress={this.viewData.bind(this)}></Button>
            currentPosition = null;
        }
        if (this.state.graph) {
            currentPosition = null;
            trackerGraph = <TrackerGraph data={this.state.pollutionData} selectedIndex={this.state.sliderValue} navigation={this.props.navigation}></TrackerGraph>
            slider = <View style={sliderStyles.container}>
                <Slider
                    step={1}
                    maximumValue={this.state.pollutionData.length - 1}
                    onValueChange={this.change.bind(this)}
                    value={sliderValue}
                />
            </View>
            icon = <Marker
                coordinate={this.state.markerPos}
                image={require('../../Resources/pin.png')}
            />
            button = <Button title="Dismiss" onPress={this.dismissGraph.bind(this)}></Button>
        }
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={styles.mapContainer}>
                    <MapView
                        ref={(ref) => this.mapView = ref}
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                    >
                        {this.state.pathArray.map((path, index) =>
                            <MapView.Polyline
                                index={index}
                                coordinates={path.path}
                                strokeWidth={5}
                                strokeColor={path.color}
                                onPress={() => this.linePressed(path.path[0].pollution)} />
                        )}
                        {icon}
                        {currentPosition}
                    </MapView>
                    {gettingLocation}
                    {slider}
                    {button}
                </View>
                {trackerGraph}
            </View>
        );
    }
    async startTracking() {
        this.setState({ startTracking: false, stopTracking: true });
        BackgroundGeolocation.on('location', (position) => {
            this.animateToRegion(position.latitude, position.longitude);
            let dateTime = this.getCurrentDate();
            console.log("Time and date: " + dateTime);
            this.getPollution(position.latitude.toString(), position.longitude.toString(), dateTime).then((pollutionJson) => {
                let pollutionData = JSON.parse(pollutionJson);
                let newPoint = {
                    latitude: position.latitude,
                    longitude: position.longitude,
                    pollution: Math.round(pollutionData.PM1 * 100)/100,
                    color: this.pollutionColor(pollutionData.PM1)
                }
                let path = this.state.allPoints;
                path.push(newPoint);
                if (path.length > 1) {
                    this.setState((prevState) => {
                        color = this.averageTwoColors(path[path.length - 1].color, path[path.length - 2].color);
                        newPathCoords = { color: color, path: [path[path.length - 1], path[path.length - 2]] };
                        oldPathArray = [...prevState.pathArray];
                        oldPathArray.push(newPathCoords);
                        return { pathArray: oldPathArray, allPoints: path, currentPosition: { latitude: position.latitude, longitude: position.longitude } };
                    });
                }

            });
            // handle your locations here
            // to perform long running operation on iOS
            // you need to create background task
            BackgroundGeolocation.startTask(taskKey => {
                // execute long running task
                // eg. ajax post location
                // IMPORTANT: task has to be ended by endTask
                BackgroundGeolocation.endTask(taskKey);
            });
        });
        BackgroundGeolocation.start();
    }

    async getPollution(lat, lng, time) {
        try {
            let params = 'lat=' + lat + '&long=' + lng + '&timestamp=' + time + '&times=1000'
            let response = await fetch(
                'https://neat-environs-205720.appspot.com/data/pollution?' + params, { method: 'GET' },
            );
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            alert(error);
        }
    }

    animateToRegion(lat, lng) {
        let r = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: .003,
            longitudeDelta: .003,
        };
        this.mapView.animateToRegion(r, 50);
    }

    generateCoordinates() {
        fakePath = [
            { latitude: 37.8025259, longitude: -122.4351431, pollution: .1, color: this.pollutionColor(.1) },
            { latitude: 37.7896386, longitude: -122.421646, pollution: .2, color: this.pollutionColor(.2) },
            { latitude: 37.7665248, longitude: -122.4161628, pollution: .3, color: this.pollutionColor(.3) },
            { latitude: 37.7734153, longitude: -122.4577787, pollution: .6, color: this.pollutionColor(.6) },
            { latitude: 37.7948605, longitude: -122.4596065, pollution: .9, color: this.pollutionColor(.9) },
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
                    pollution: this.estimatePollution(start.pollution, end.pollution, split, j),
                    color: this.calculateGradientColor(start.color, end.color, split, j)
                }
                newPath.push(newCoordinate);
            }
        }
        newPath.push(fakePath[fakePath.length - 1]);
        return newPath;
    }

    getCurrentDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let seconds = date.getSeconds();
        //2019-02-06 12:45:19
        return year.toString() + '-' + this.leadingZeroes(month) + '-' + this.leadingZeroes(day) + ' ' +
        this.leadingZeroes(hour) + ":" + this.leadingZeroes(minute) + ":" + this.leadingZeroes(seconds);
    }

    leadingZeroes(num){
        stringNum = num.toString();
        if(stringNum.length == 1){
            stringNum = "0" + stringNum;
        }
        return stringNum;
    }

    linePressed(pollution) {
        this.props.navigation.navigate('PollutionInfo', {
            pollution: pollution
        });
    }

    pollutionFromPath(path) {
        result = [];
        path.forEach(point => {
            result.push(point.pollution);
        });
        return result;
    }

    change(value) {
        num = parseFloat(value);
        pathData = this.state.allPoints[num];
        markerCoord = {
            latitude: pathData.latitude,
            longitude: pathData.longitude
        }
        this.setState({ sliderValue: num, markerPos: markerCoord });
        this.animateToRegion(markerCoord.latitude, markerCoord.longitude);
    }

    stopTracking() {
        BackgroundGeolocation.stop();
        this.setState({ stopTracking: false, viewData: true });
    }

    viewData() {
        pollutionArray = this.pollutionFromPath(this.state.allPoints);
        this.setState({ pollutionData: pollutionArray });
        this.setState({ viewData: false, graph: true });
    }

    dismissGraph() {
        this.setState({ graph: false, startTracking: true, pathArray: [], allPoints: [], pollutionData: [] });
    }

    //estimates the pollution level between two data points
    estimatePollution(p1, p2, split, splitIndex) {
        difference = Math.abs(p1 - p2);
        increment = difference / split * splitIndex;
        result = (p2 > p1) ? p1 + increment : p1 - increment;
        return parseFloat(result.toFixed(3));
    }

    calculateGradientColor(startColor, endColor, split, splitIndex) {
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
        redInc = (endRed > startRed) ? redInterval / split : -redInterval / split;
        blueInc = (endBlue > startBlue) ? blueInterval / split : -blueInterval / split;
        greenInc = (endGreen > startGreen) ? greenInterval / split : -greenInterval / split;
        //the resulting color values will be the starting color + the increment multiplied by the place we are along the gradient line(split index)
        resultRed = Math.round(startRed + (redInc * splitIndex));
        resultBlue = Math.round(startBlue + (blueInc * splitIndex));
        resultGreen = Math.round(startGreen + (greenInc * splitIndex));
        //convert these numbers back into hex and form our hex color string
        redHex = (resultRed).toString(16);
        blueHex = (resultBlue).toString(16);
        greenHex = (resultGreen).toString(16);
        if (redHex.length == 1) {
            redHex += "0"
        }
        if (blueHex.length == 1) {
            blueHex += "0"
        }
        if (greenHex.length == 1) {
            greenHex += "0"
        }
        return "#" + redHex + greenHex + blueHex;
    }

    averageTwoColors(color1, color2) {
        red1 = parseInt("0x" + color1.substring(1, 3));
        green1 = parseInt("0x" + color1.substring(3, 5));
        blue1 = parseInt("0x" + color1.substring(5));
        red2 = parseInt("0x" + color2.substring(1, 3));
        green2 = parseInt("0x" + color2.substring(3, 5));
        blue2 = parseInt("0x" + color2.substring(5));
        resultRed = (Math.round((red1 + red2) / 2)).toString(16);
        resultGreen = (Math.round((green1 + green2) / 2)).toString(16);
        resultBlue = (Math.round((blue1 + blue2) / 2)).toString(16);
        if (resultRed.length == 1) {
            resultRed += "0"
        }
        if (resultBlue.length == 1) {
            resultBlue += "0"
        }
        if (resultGreen.length == 1) {
            resultGreen += "0"
        }
        return "#" + resultRed + resultGreen + resultBlue;
    }

    pollutionColor(pollution) {
        if (pollution >= 0 && pollution < .25) {
            return "#00ff00";
        } else if (pollution >= .25 && pollution < .5) {
            return "#ffff00";
        } else if (pollution >= .5 && pollution < .75) {
            return "#ffa500";
        } else if (pollution >= .75 && pollution <= 1) {
            return "#ff0000";
        }
    }
}

sliderStyles = StyleSheet.create({
    container: {
        width: 300,
        height: 25,
    },
    text: {
        fontSize: 10,
        textAlign: 'center',
    },
});