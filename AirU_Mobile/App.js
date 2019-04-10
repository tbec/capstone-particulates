import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, DeviceEventEmitter } from 'react-native';
import Router from './Components/Navigation';
import PushNotificationAndroid from 'react-native-push-notification'
import PushNotification from 'react-native-push-notification';

// Main screen. Uses Router from Navigation to load home screen, 
// do not load <Home> in here directly.
export default class App extends Component {
  componentWillMount() {
    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        PushNotification.cancelAllLocalNotifications(); //clear the notification

        // process the notification
      },

    });
  }
  render() {
    return (
      <Router />
    );
  }
}