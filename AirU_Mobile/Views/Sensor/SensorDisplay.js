// shows sensor data
import React, {Component} from 'react';
import {Text, View, WebView, TouchableHighlight, AsyncStorage, Platform, Picker} from 'react-native';
import styles from '../../StyleSheets/Styles'
import Icon from 'react-native-vector-icons/Ionicons'
import { SENSOR_ARRAY } from '../../Components/Constants'

// component should never be called if AsyncStorage.getItem('Sensor') is not already set
export default class SensorDisplay extends Component<Props> {
    constructor(Props) {
        super(Props);
        this.getSensors.bind(this);
        this.state = {sensorList: [], data: [], selected: "AB-CD-EF-GF"}
    }

    async getSensors() {
        let sensorsList = await this.getSensorList();
        this.setState({sensorList: sensorsList})
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
        let sensors = this.state.sensorList;
        let pickerItems
        let Pickers
        if(sensors == undefined || sensors == null) {
            Picker = <Text>undefined</Text>
        }
        else {
            pickerItems = this.state.sensorList.map(sensor => {
                return (
                  <Picker.Item key={sensor.id} label={sensor.sensorName} value={sensor.sensorName} />
                )
              })
          
              Pickers =
                  <Picker
                       selectedValue={this.state.selected}
                       mode={"dialog"}
                       onValueChange={value => this.setState({ selectedValue: value })}>
                       {pickerItems}                  
                  </Picker>
        }
        return (
            <View>
                {Pickers}
            </View>
        )
    }
}