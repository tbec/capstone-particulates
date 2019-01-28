// shows sensor data
import React, {Component} from 'react';
import {Text, View, TouchableHighlight, AsyncStorage, Platform, Picker} from 'react-native';
import styles from '../../StyleSheets/Styles'
import { SENSOR_ARRAY } from '../../Components/Constants'
import { BarChart, Grid} from 'react-native-svg-charts'
import {Text as TextChart} from 'react-native-svg'


// component should never be called if AsyncStorage.getItem('Sensor') is not already set
export default class SensorDisplay extends Component<Props> {
    constructor(Props) {
        super(Props);
        this.getSensors.bind(this);
        this.sensorPicker.bind(this);
        this.dataTypeHandler = this.dataTypeHandler.bind(this)
        this.state = {sensorList: [], data: [], selected: '', selectedType: 'Pollution', 
                        pickingType: false, period: 'hour', connected: true, error: ''}
    }

    // gets list of saved sensors
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

    dataTypeHandler(dataType) {
        this.setState({selectedType: dataType})
    }

    render() {
        let Pickers = this.sensorPicker();
        
        return (
            <View style={{flex: 3}}>
                <Text style={{textAlign: 'center', paddingBottom: 10}}>
                    Connected
                </Text>
                <Period/>
                <TouchableHighlight testID='dataTypePicker'
                        onPress={() => this.setState({pickingType: true})}
                        style={{height: 20, width: 120, alignSelf: 'center',
                            alignContent: 'center', borderColor: 'black', borderWidth: 2}}
                        >
                    <Text style={{alignContent: 'flex-start', textAlign: 'center', paddingBottom: 10}}>
                    Pollution
                    </Text>
                </TouchableHighlight>
                {/* <DataType handler={this.dataTypeHandler} selected={this.state.selected}/> */}
                <Graph data={this.state.data}/>
                <Information data={this.state.data}/>
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
                       mode={"dropdown"}
                       onValueChange={value => this.setState({ selectedValue: value })}>
                       {pickerItems}                  
                  </Picker>
              )
        }
    }
}

// code taken from 
// https://github.com/JesperLekland/react-native-svg-charts-examples/blob/master/storybook/stories/bar-chart/vertical-with-labels.js
class Graph extends Component<Props> {
    constructor(props) {
        super(props)
    }

    render() {
        const data = [ 15, 16, 17, 18, 19, 20]

        const CUT_OFF = 20
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <TextChart
                    key={ index }
                    x={ x(index) + (bandwidth / 2) }
                    y={ value < CUT_OFF ? y(value) - 10 : y(value) + 15 }
                    fontSize={ 14 }
                    fill={ value >= CUT_OFF ? 'white' : 'black' }
                    alignmentBaseline={ 'middle' }
                    textAnchor={ 'middle' }
                >
                    {value}
                </TextChart>
            ))
        )

        return (
            <View style={{ flexDirection: 'row', height: 300, paddingVertical: 5 }}>
                <BarChart
                    style={{ flex: 1 }}
                    data={data}
                    svg={{ fill: 'rgba(134, 65, 244, 1)' }}
                    contentInset={{ top: 10, bottom: 10 }}
                    spacing={0.2}
                    gridMin={0}
                    yMin={0} 
                    yMax={200}
                    animate={true}
                >
                    <Grid direction={Grid.Direction.HORIZONTAL}/>
                    <Labels/>
                </BarChart>
            </View>
        )
    }
}

class Period extends Component<Props> {
    render() {
        return (
            <View style={{height: 30, flexDirection: 'row', alignContent: 'center', 
                            justifyContent: 'center', paddingBottom: 5}}>
                <TouchableHighlight testID={'Hour'} style={[styles.button, 
                                        {paddingLeft: 20, paddingRight: 20, width: '25%', height: 25}]}
                                    onPress={() => this.setState({period: 'hour'})}>
                    <Text style={styles.buttonText}>Hour</Text>
                </TouchableHighlight>
                <Text/>
                <TouchableHighlight testID={'Day'} style={[styles.button, 
                                            {paddingLeft: 10, paddingRight: 10, width: '25%', height: 25}]}
                                    onPress={() => this.setState({period: 'day'})}>
                    <Text style={styles.buttonText}>Day</Text>
                </TouchableHighlight>
                <TouchableHighlight testID={'Week'} style={[styles.button, 
                                {paddingLeft: 10, paddingRight: 10, width: '25%', height: 25}]}
                                onPress={() => this.setState({period: 'week'})}>
                    <Text style={styles.buttonText}>Week</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

class DataType extends Component<Props> {
    constructor(props) {
        super(props)
    }

    render() {
        return (
        <View style={{flex: 1}}>
                <Picker
                    mode={"dialog"}
                    selectedValue={this.props.selected} 
                    onValueChange={(itemValue, itemIndex) => this.props.handler(itemValue)}>
                    <Picker.Item label="Pollution" value="Pollution"/>
                    <Picker.Item label="Temperature" value="Temperature"/>
                    <Picker.Item label="Humidity" value="Humidity"/>
                </Picker>
            </View>
        )
    }
}


class Information extends Component<Props> {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <View style={{flex: 1, borderColor: 'black', borderWidth: 1}}>
                <Text>Information goes here</Text>
            </View>
        )
    }
}