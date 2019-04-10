import React, { Component } from 'react';
import { Platform, Alert, StyleSheet, Text, View, Button, Slider, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import NavBar from '../../Components/NavBar';
import TrackerGraph from './TrackerGraph';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from '../../StyleSheets/Styles';
import { NavigationActions } from 'react-navigation';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import { AsyncStorage, DeviceEventEmitter } from 'react-native';
import { EXPOSUREDATA, NOTIFICATIONS } from '../../Components/Constants';
import PushNotification from 'react-native-push-notification';


export default class Tracker extends Component {
    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params.path;
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
            saveData: true,
            graph: false,
            previousTime: 0,
            exposureTime: 0,
            markerImage: require('../../Resources/pin.png')
        };
        if (params != undefined) {
            this.state.allPoints = params.allPoints,
                this.state.pathArray = params.pathArray,
                this.state.pollutionData = params.pollutionData,
                this.state.startTracking = false,
                this.state.stopTracking = false,
                this.state.viewData = false,
                this.state.saveData = false,
                this.state.graph = true
        }
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
        if (!this.state.graph) {
            BackgroundGeolocation.getCurrentLocation((position) => {
                this.animateToRegion(position.latitude, position.longitude);
                let currentPosition = { latitude: position.latitude, longitude: position.longitude };
                this.setState({ gettingLocation: false, currentPosition: currentPosition });
            }, (error) => {
                alert(error.message);
                this.setState({ gettingLocation: false });
            }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 });
        } else {
            let startCoord = this.state.allPoints[0];
            let currentPosition = { latitude: startCoord.latitude, longitude: startCoord.longitude };
            setTimeout(() => { this.animateToRegion(startCoord.latitude, startCoord.longitude) }, 10);
            this.setState({ gettingLocation: false, markerPos: currentPosition });
        }
    }

    componentWillUnmount() {
        BackgroundGeolocation.stop();
        BackgroundGeolocation.removeAllListeners();
    }

    render() {
        let button, trackerGraph, slider, icon, currentPosition, gettingLocation, notificationButton;
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
        if (!this.state.graph) {
            notificationButton = <View style={{width: 50}}>
                <Button title="!" onPress={this.sendNotification.bind(this)}></Button>
            </View>
        }
        currentPosition = <Marker
            coordinate={this.state.currentPosition}
            image={this.state.markerImage}
        ><Text style={{ opacity: 0 }}>hack</Text></Marker>
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
            trackerGraph =
                <View>
                    <Text style={{ backgroundColor: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 24 }}>PM2.5 Levels</Text>
                    <TrackerGraph data={this.state.pollutionData} selectedIndex={this.state.sliderValue} navigation={this.props.navigation}></TrackerGraph>
                    <View>
                        <Button title="More Info" onPress={this.moreInfo.bind(this)}></Button>
                    </View>
                </View>
            slider = <View style={sliderStyles.container}>
                <Slider
                    style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                    step={1}
                    maximumValue={this.state.pollutionData.length - 1}
                    onValueChange={this.change.bind(this)}
                    value={sliderValue}
                />
            </View>
            icon = <Marker
                coordinate={this.state.markerPos}
                image={this.state.markerImage}
            />
            let saveButton;
            if (this.state.saveData) {
                saveButton = <Button title="Save Data" onPress={this.saveData.bind(this)}></Button>
            }
            button = <View style={{ flexDirection: 'row' }}>
                {saveButton}
                <View style={{ width: 20 }}></View>
                <Button title="Dismiss" onPress={this.dismissGraph.bind(this)}></Button>
            </View>
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
                    <View style={{ margin: 15, flexDirection: 'row' }}>
                        {button}
                    </View>
                </View>
                {notificationButton}
                {trackerGraph}
            </View>
        );
    }
    async startTracking() {
        var d = new Date();
        var n = d.getTime();
        this.setState({ startTracking: false, stopTracking: true, saveData: true, previousTime: n });
        BackgroundGeolocation.on('location', (position) => {
            this.animateToRegion(position.latitude, position.longitude);
            let dateTime = this.getCurrentDate().time;
            this.getPollution(position.latitude.toString(), position.longitude.toString(), dateTime).then((pollutionJson) => {
                let pollutionData = JSON.parse(pollutionJson);
                let newPoint = {
                    latitude: position.latitude,
                    longitude: position.longitude,
                    pollution: Math.round(pollutionData["PM2.5"] * 100) / 100,
                    color: this.pollutionColor(pollutionData["PM2.5"])
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
                this.notifyUser(pollutionData["PM2.5"]);
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
                'https://download-dot-neat-environs-205720.appspot.com/data/pollution?' + params, { method: 'GET' },
            );
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            alert(error);
        }
    }

    //check if the user has been exposed to bad air for a prolonged period of time and send a notification
    notifyUser(pollution) {
        let d = new Date();
        let time = d.getTime();
        let elapsedTime = time - this.state.previousTime;
        this.setState({ previousTime: time });
        //weight the time according to the level of pollution
        if (pollution >= 0 && pollution < 12) {
            elapsedTime = 0;
        } else if (pollution >= 12 && pollution < 35.4) {
            elapsedTime = elapsedTime / 4;
        } else if (pollution >= 35.4 && pollution < 55.4) {
            elapsedTime = elapsedTime / 2;
        }
        //convert time to minutes
        elapsedTime = (elapsedTime / 1000) / 60;
        total = this.state.exposureTime + elapsedTime;
        //If the user has spent an hour (weighted) in bad air send a notification
        if (total >= 60) {
            this.sendNotification();
            this.setState({ exposureTime: 0 });
        } else {
            this.setState({ exposureTime: total });
        }
    }

    sendNotification() {
        AsyncStorage.getItem(NOTIFICATIONS, (error, result) => {
            if (result != 'false') {
                PushNotification.localNotification({
                    id: '0',
                    autoCancel: true,
                    largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
                    smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
                    bigText: "You have spent an unhealthy amount of time in polluted air, you may want to consider getting indoors or taking a break.",
                    vibrate: true,
                    vibration: 300,
                    title: "AirU Warning",
                    message: "You have spent an unhealthy amount of time in polluted air, you may want to consider getting indoors or taking a break.",
                    playSound: true,
                    soundName: 'default',
                    actions: '["Ok"]',
                });
            }
        });
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


    getCurrentDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let seconds = date.getSeconds();
        //2019-02-06 12:45:19
        return {
            time: year.toString() + '-' + this.leadingZeroes(month) + '-' + this.leadingZeroes(day) + ' ' + this.leadingZeroes(hour) + ":" + this.leadingZeroes(minute) + ":" + this.leadingZeroes(seconds),
            title: date.toDateString()
        };
    }

    leadingZeroes(num) {
        stringNum = num.toString();
        if (stringNum.length == 1) {
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

    async saveData() {
        try {
            let exposureData = "";
            let savedData = await AsyncStorage.getItem(EXPOSUREDATA);
            let time = this.getCurrentDate();
            if (savedData == null) {
                exposureData = JSON.stringify([{
                    key: time.time,
                    title: time.title,
                    pathArray: this.state.pathArray,
                    pollutionData: this.state.pollutionData,
                    allPoints: this.state.allPoints
                }]);
            } else {
                savedData = JSON.parse(savedData);
                savedData.push({
                    key: time.time,
                    title: time.title,
                    pathArray: this.state.pathArray,
                    pollutionData: this.state.pollutionData,
                    allPoints: this.state.allPoints
                });
                exposureData = JSON.stringify(savedData);
            }
            await AsyncStorage.setItem(EXPOSUREDATA, exposureData);
            this.setState({ saveData: false });
        } catch (error) {
            alert(error);
        }
    }

    moreInfo() {
        this.props.navigation.navigate('PollutionInfo', {
            pollution: this.state.pollutionData[this.state.sliderValue]
        });
    }

    calculateGradientColor(startColor, endColor, percentage) {
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
        redInc = redInterval * percentage;
        blueInc = blueInterval * percentage;
        greenInc = greenInterval * percentage;
        //the resulting color values will be the starting color + the increment multiplied by the place we are along the gradient line(split index)
        resultRed = Math.round(startRed + redInc);
        resultBlue = Math.round(startBlue + blueInc);
        resultGreen = Math.round(startGreen + greenInc);
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
        if (pollution >= 0 && pollution < 12) {
            return this.calculateGradientColor("#00ff00", "#ffff00", pollution / 12);
        } else if (pollution >= 12 && pollution < 35.4) {
            return this.calculateGradientColor("#ffff00", "#ffa500", (pollution - 12) / (35.4 - 12));
        } else if (pollution >= 35.4 && pollution < 55.4) {
            return this.calculateGradientColor("#ffa500", "#ff0000", (pollution - 35.4) / (55.4 - 35.4));
        } else if (pollution >= 55.4) {
            return "#ff0000";
        }
    }
}

sliderStyles = StyleSheet.create({
    container: {
        width: 250,
        height: 25,
    },
    text: {
        fontSize: 10,
        textAlign: 'center',
    },
});