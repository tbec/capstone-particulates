// shows sensor data
import React, {Component} from 'react';
import {Text, View, WebView, TouchableHighlight, AsyncStorage, Platform, Picker} from 'react-native';
import styles from '../../StyleSheets/Styles'
import { SENSOR_ARRAY } from '../../Components/Constants'

// component should never be called if AsyncStorage.getItem('Sensor') is not already set
export default class SensorDisplay extends Component<Props> {
    constructor(Props) {
        super(Props);
        this.getSensors.bind(this);
        this.sensorPicker.bind(this);
        this.state = {sensorList: [], data: [], selected: '', period: 'hour', connected: true, error: ''}
    }

    async getSensors() {
        let sensorsList = await this.getSensorList();
        this.setState({sensorList: sensorsList, selected: sensorsList[0]})
    }

    async getSensorList() {
        return await AsyncStorage.getItem(SENSOR_ARRAY).then(res => JSON.parse(res))
    }

    selectSensor(item, index) {
        this.setState({selected: sensorList[index].id})
    }

    componentWillMount() {
        this.getSensors()
    }

    render() {
        let Pickers = this.sensorPicker();
        let periods = this.periodButtons();
        
        
        return (
            <View style={styles.container}>
                <Text style={{alignContent: 'center', justifyContent: 'center',
                             alignItems: 'center', paddingBottom: 10}}>
                Connected
                </Text>
                {periods}
            </View>
        )
    }

    sensorPicker() {
        let sensors = this.state.sensorList;
        if(sensors == undefined || sensors == null) {
             return <Text>undefined</Text>
        }
        else {
            pickerItems = this.state.sensorList.map(sensor => {
                return (
                  <Picker.Item key={sensor.id} label={sensor.sensorName} value={sensor.sensorName} />
                )
              })
          
              return (
                  <Picker
                       selectedValue={this.state.selected}
                       mode={"dialog"}
                       onValueChange={value => this.setState({ selectedValue: value })}>
                       {pickerItems}                  
                  </Picker>
              )
        }
    }

    periodButtons() {
        return (
            <View style={{flex: 1, flexDirection: 'row', alignContent: 'center', justifyContent: 'center'}}>
                <TouchableHighlight testID={'Hour'} style={[styles.button, 
                                        {paddingLeft: 20, paddingRight: 20, width: '25%', height: 40}]}
                                    onPress={() => this.setState({period: 'hour'})}>
                    <Text style={styles.buttonText}>Hour</Text>
                </TouchableHighlight>
                <Text/>
                <TouchableHighlight testID={'Day'} style={[styles.button, 
                                            {paddingLeft: 10, paddingRight: 10, width: '25%', height: 40}]}
                                    onPress={() => this.setState({period: 'day'})}>
                    <Text style={styles.buttonText}>Day</Text>
                </TouchableHighlight>
                <TouchableHighlight testID={'Week'} style={[styles.button, 
                                {paddingLeft: 10, paddingRight: 10, width: '25%', height: 40}]}
                                onPress={() => this.setState({period: 'week'})}>
                    <Text style={styles.buttonText}>Week</Text>
                </TouchableHighlight>
            </View>
        )
    }
}