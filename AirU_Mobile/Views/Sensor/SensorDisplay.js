// shows sensor data
import React, {Component} from 'react';
import {Text, View, TouchableHighlight, AsyncStorage} from 'react-native';
import styles from '../../StyleSheets/Styles'
import { SENSOR_ARRAY, WEB_URL } from '../../Components/Constants'
import { BarChart, Grid} from 'react-native-svg-charts'
import {Text as TextChart, G} from 'react-native-svg'
import { Dropdown } from 'react-native-material-dropdown';
import {sensorFuncs} from '../../Components/SensorObj'
import { COLOR_GOOD, COLOR_HAZARDOUS, COLOR_MODERATE, COLOR_SENSITVE, COLOR_UNHEALTHY, COLOR_VERY_UNHEALTHY } from '../../Components/Constants'

// component should never be called if AsyncStorage.getItem('Sensor') is not already set
export default class SensorDisplay extends Component<Props> {
    constructor(Props) {
        super(Props);
        
        // bindings
        this.getSensors.bind(this);
        this.dataTypeHandler = this.dataTypeHandler.bind(this)
        this.periodHandler = this.periodHandler.bind(this)
        this.graphDataHandler = this.graphDataHandler.bind(this)
        this.sensorHandler = this.sensorHandler.bind(this)

        // web calls
        this.webCall = this.webCall.bind(this)
        this.getData = this.getData.bind(this)
        
        lastUpdate = new Date(Date.now())
        this.state = {sensorList: [], data: [], selectedSensor: {sensorData: []}, selectedType: 'PM1', lastUpdated: lastUpdate,
                        pickingType: false, period: 'hour', connected: true, error: '', dataPoint: 0, timer: null}
    }

    componentWillMount() {
        this.getSensors()
        let _timer = setInterval(this.getData, 10000) // every 5 minutes
        this.getData()
        this.setState({timer: _timer})
    }

    componentWillUnmount() {
        this.clearInterval(this.state.timer)
    }

    // gets list of saved sensors
    async getSensors() {
        let sensorsList = await this.getSensorList();
        this.setState({sensorList: sensorsList, selectedSensor: sensorsList[0]})
    }

    async getSensorList() {
        return await AsyncStorage.getItem(SENSOR_ARRAY).then(res => JSON.parse(res))
    }

    selectSensor(item, index) {
        this.setState({selectedSensor: sensorList[index].id})
    }

    /** HANDLERS **/
    periodHandler(periodRange) {
        this.setState({period: periodRange})
    }

    dataTypeHandler(dataType) {
        this.setState({selectedType: dataType})
    }

    graphDataHandler(data) {
        this.setState({dataPoint: data})
    }

    sensorHandler(index) {
        this.setState({selectedSensor: this.state.sensorList[index]})
    }

    /** WEB CALLS **/
    async getData() {
        data = await this.webCall()
        if (data == null) {
            this.setState({connected: false})
            return
        }

        // parse data
        let json = JSON.parse(data);
        _pm1 = json["PM1"]
        _pm10 = json["PM10"]
        _time = json["time"]
        _pm25 = json["PM2.5"]

        // add datapoint and update state
        dataPoint = {pm1: _pm1, pm10: _pm10, pm25: _pm25, time: _time}
        selectSensor = sensorFuncs.addData(this.state.selectedSensor, 
                dataPoint, sensorFuncs.getDataSet(this.state.selectedSensor))

        this.setState({data: selectSensor.sensorrData, lastUpdated: new Date(Date.now())})
    }

    async webCall() {
        let urlBase = WEB_URL + '/data/pollution/'
        let deviceID = 'A81B6A7A6116' //this.state.selectedSensor.id

        let url = urlBase + deviceID
        url = 'http://neat-environs-205720.appspot.com/data/pollution/F45EAB9C48E6'

        console.log('URL: ' + url)

        response = await fetch(url, {method: 'GET', credentials: 'include' })
        return response.json()
    }

    render() {
        return (
            <View style={{flex: 3}}>
                <Text style={{textAlign: 'center', paddingBottom: 10}}>
                    Not Connected
                </Text>
                <Period period={this.state.period} handler={this.periodHandler}/>
                <DataType value={this.state.selectedType} handler={this.dataTypeHandler}/>
                <SensorPicker selected={this.state.selectedSensor.sensorName} data={this.state.sensorList} 
                                handler={this.sensorHandler}/>
                <Graph sensor={this.state.selectedSensor} selectedType={this.state.selectedType} 
                        handler={this.graphDataHandler} period={this.state.period} date={this.state.lastUpdated}/>
                <Information dataPoint={this.state.dataPoint} selectedType={this.state.selectedType}/>
            </View>
        )
    }
}

// code taken from 
// https://github.com/JesperLekland/react-native-svg-charts-examples/blob/master/storybook/stories/bar-chart/vertical-with-labels.js

/**
 * Graph component
 * @param sensor Sensor with dataset as outlined in sensorFuncs
 * @param selectedType name of data type, should be one of possible ones in Datatype component below
 * @param handler callback when sensor point is picked
 * @param period selected period (hour, day, week)
 * @param date Current date, used to get data according to period
 */
class Graph extends Component<Props> {
    constructor(props) {
        super(props)
    }

    pollutionColor(pollution) {
        if (pollution >= 0 && pollution < 5) {
            return COLOR_GOOD;
        } else if (pollution >= 5 && pollution < 10) {
            return COLOR_MODERATE
        } else if (pollution >= 10 && pollution < 12) {
            return COLOR_SENSITVE
        } else if (pollution >= 12 && pollution < 15) {
            return COLOR_UNHEALTHY
        } else if (pollution >= 15 && pollution < 20 ) {
            return COLOR_VERY_UNHEALTHY
        } else {
            return COLOR_HAZARDOUS
        }
    }

    render() {
        // period to show for data
        var data = this.props.sensor.sensorData

        if (data.length == 0) {
            data = [0]
        } else if (this.props.period == 'hour') {
            currDay = this.props.date.getDay()
            currHour = this.props.date.getHours()
            data = data[currDay].data[currHour]

            if (this.props.selectedType == "PM1") {
                data = data.pm1
            } else if (this.props.selectedType == "PM25") {
                data = data.pm25
            } else {
                data = data.pm10
            }
        }

        if (data.length == 0) {
            data = [0]
        }

        // create labels
        const CUT_OFF = 20
        const Labels = ({ x, y, bandwidth, colorData }) => (
            data.map((value, index) => (
                <G key = { index }>                    
                    <TextChart
                        x={ x(index) + (bandwidth / 2) }
                        y={ value < CUT_OFF ? y(value) - 10 : y(value) + 15 }
                        fontSize={ 14 }
                        // fill='black'
                        fill={ value >= CUT_OFF ? 'white' : 'black' }
                        alignmentBaseline={ 'middle' }
                        textAnchor={ 'middle' }
                    >
                    {value}
                    </TextChart>
                </G>
            ))
        )

        const colorData = data.map((value, index) => ({
            value,
            svg: {
                fill: this.pollutionColor(value),
                onPress: () => this.props.handler(value), 
            },
        }))

        return (
            <View style={{ flexDirection: 'row', height: 300, paddingVertical: 5}}>
                <BarChart
                    style={{ flex: 1 }}
                    data={colorData}
                    contentInset={{ top: 10, bottom: 10 }}
                    spacing={0.2}
                    gridMin={0}
                    yMin={0} 
                    yMax={200}
                    yAccessor={({ item }) => item.value}
                    animate={false}>
                    <Grid direction={Grid.Direction.HORIZONTAL}/>
                    <Labels/>
                </BarChart>
            </View>
        )
    }
}

class Period extends Component<Props> {
    constructor(Props) {
        super(Props);
    }

    render() {
        return (
            <View style={{height: 30, flexDirection: 'row', alignContent: 'center', 
                            justifyContent: 'center', paddingBottom: 5}}>
                <TouchableHighlight testID={'hour'} style={[styles.button, 
                                        {paddingLeft: 20, paddingRight: 20, width: '25%', height: 25,
                                    backgroundColor: this.props.period == 'hour' ? 'blue' : 'red'}]}
                                    onPress={() => this.props.handler('hour')}>
                    <Text style={styles.buttonText}>Hour</Text>
                </TouchableHighlight>
                <Text/>
                <TouchableHighlight testID={'day'} style={[styles.button, 
                                        {paddingLeft: 20, paddingRight: 20, width: '25%', height: 25,
                                    backgroundColor: this.props.period == 'day' ? 'blue' : 'red'}]}
                                    onPress={() => this.props.handler('day')}>
                    <Text style={styles.buttonText}>Day</Text>
                </TouchableHighlight>
                <TouchableHighlight testID={'week'} style={[styles.button, 
                                        {paddingLeft: 20, paddingRight: 20, width: '25%', height: 25,
                                    backgroundColor: this.props.period == 'week' ? 'blue' : 'red'}]}
                                onPress={() => this.props.handler('week')}>
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
        let data = [{value: 'PM1'}, {value: 'PM2.5'}, {value: 'PM10'}]

        return (
            <View style={{flex: 1}}>
                <Dropdown label='Data Type' data={data} value={this.props.value} 
                            onChangeText={(index) => this.props.handler(index)}
                            overlayStyle={{alignContent: 'center'}}/>
            </View>
        )
    }
}

class SensorPicker extends Component<Props> {
    constructor(props) {
        super(props)
    }

    render() {
        const list = this.props.data.map((value, index) => ({
            value: this.props.data[index].sensorName
        }))

        return (
            <View style={{flex: 1}}>
                <Dropdown label='Sensor' data={list}
                            onChangeText={(value, index) => this.props.handler(index)}
                            value={this.props.selected}
                            overlayStyle={{alignContent: 'center'}}/>
            </View>
        )
    }
}

class Information extends Component<Props> {
    constructor(props) {
        super(props)
    }

    dataGood() {
        return "Air quality is satisfactory with little to no risk"
    }

    dataModerate() {
        return "Air quality is acceptable; however, for some pollutants there may be a moderate health concern" +
        "for a very small number of people."
    }

    dataSensitive() {
        return "Persons with heart and lung disease, older adults and children are at greater risk from the presence of particles in the air."
    }

    dataUnhealthy() {
        return "Everyone may begin to experience some adverse health effects, and members of the sensitive groups may experience more serious effects."
    }

    dataVeryUnhealthy() {
        return "This would trigger a health alert signifying that everyone may experience more serious health effects."
    }

    dataHazardous() {
        return "This would trigger a health warnings of emergency conditions. The entire population is more likely to be affected."
    }

    render() {
        let dataText;
        let pollution = this.props.dataPoint;
        if (pollution >= 0 && pollution < 5) {
            dataText = this.dataGood();
        } else if (pollution >= 5 && pollution < 10) {
            dataText = this.dataModerate();
        } else if (pollution >= 10 && pollution < 12) {
            dataText = this.dataSensitive();
        } else if (pollution >= 12 && pollution < 15) {
            dataText = this.dataUnhealthy();
        } else if (pollution >= 15 && pollution < 20) {
            dataText = this.dataVeryUnhealthy();
        } else {
            dataText = this.dataHazardous();
        }

        return(
            <View style={{flex: 1, borderColor: 'black', borderWidth: 1}}>
                <Text>{pollution}: {dataText}</Text>
            </View>
        )
    }
}