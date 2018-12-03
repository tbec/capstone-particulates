// shows sensor data

import React, {Component} from 'react';
import {Text, View, WebView, TouchableHighlight} from 'react-native';
import styles from '../../StyleSheets/Styles'

export default class Sensor extends Component<Props> {

    // checks if user has logged in previously
    constructor(Props) {
        super(Props);
        this.state = {sensors: false}
    }

    componentWillMount() {
        const _retrieveData = async () => {
            return await AsyncStorage.getItem('Sensor');
          }

          if (_retrieveData === null) {
            this.setState={ sensors: false}
          }
          else {
              this.setState={sensors: true}
          }
    }
    render() {
        if (this.state.sensors) {
            sensorPage = <WebView></WebView>
        }
        else {
            sensorPage = <View style={styles.home}>
                            <Text>You have not registered any sensors to view data.</Text>
                            <Text>Select below to register one now</Text>
                                <TouchableHighlight 
                                        style={styles.button}
                                        activeOpacity={30}
                                        underlayColor="yellow"
                                        onPress={() => this.props.navigation.navigate('SetupNew')}>
                                    <Text>Setup New Sensor</Text>
                            </TouchableHighlight>
                        </View>;

        }
        return (
            <View style={{flex: 1}}>
                {sensorPage}
            </View>
        );
    }
}