// shows sensor data
import React, {Component} from 'react';
import {Text, View, TouchableHighlight, AsyncStorage} from 'react-native';
import styles from '../../StyleSheets/Styles'
import { SENSOR_ARRAY, WEB_URL } from '../../Components/Constants'
import { BarChart, Grid, XAxis} from 'react-native-svg-charts'
import {Text as TextChart, G} from 'react-native-svg'
import { Dropdown } from 'react-native-material-dropdown';
import {sensorFuncs} from '../../Components/SensorObj'
import { COLOR_GOOD, COLOR_HAZARDOUS, COLOR_MODERATE, COLOR_SENSITVE, COLOR_UNHEALTHY, COLOR_VERY_UNHEALTHY
            , REFRESH, WEB_URL_NO_MOBILE} from '../../Components/Constants'

// component should never be called if AsyncStorage.getItem('Sensor') is not already set
export default class SensorDisplay extends Component<Props> {
    constructor(Props) {
        super(Props);
        
        // bindings
        this.getSensors = this.getSensors.bind(this);
        this.getTimer = this.getTimer.bind(this);
        this.dataTypeHandler = this.dataTypeHandler.bind(this)
        this.periodHandler = this.periodHandler.bind(this)
        this.graphDataHandler = this.graphDataHandler.bind(this)
        this.sensorHandler = this.sensorHandler.bind(this)

        // web calls
        this.webCall = this.webCall.bind(this)
        this.getData = this.getData.bind(this)
        
        lastUpdate = new Date(Date.now())
        this.state = {sensorList: [], data: [], selectedSensor: {sensorData: []}, selectedType: 'PM1', lastUpdated: lastUpdate,
                        pickingType: false, period: 'hour', connected: true, error: '', sensorNumber: 0, timer: null, dataPoint: 0}
    }

    componentWillMount() {
        this.getSensors()
        this.getTimer()
    }

    componentWillUnmount() {
        this.clearInterval(this.state.timer)
    }

    // setup timer for 
    async getTimer() {
        await AsyncStorage.getItem(REFRESH).then((_retrieveData) => {
            if (_retrieveData == null) {
                _timer = setInterval(this.getData, 30000) // every 30 seconds by default
                return _timer
            } else {
                _timer = setInterval(this.getData, JSON.parse(_retrieveData))
                return _timer
            }}).then((_timer) => { this.setState({timer: _timer})})
    }

    // gets list of saved sensors
    async getSensors() {
        let sensorsList = await this.getSensorList();
        this.setState({sensorList: sensorsList, selectedSensor: sensorsList[0]})
        this.getData()
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
        //TODO: ADJUST TO DO ALL SENSORS INSTEAD OF ONLY CURRENTLY SELECTED ONE
        var num = 0

        for (currSensor of this.state.sensorList) {
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
            dataToAdd = {pm1: _pm1, pm10: _pm10, pm25: _pm25, time: _time}
            selectSensor = sensorFuncs.addData(this.state.sensorList, num, 
                dataToAdd, sensorFuncs.getDataSet(currSensor))

            num = num + 1
        }

        this.setState({connected: true, data: this.state.selectedSensor.sensorData, lastUpdated: new Date(Date.now())})
    }

    async webCall(sensor) {
        let urlBase = WEB_URL + '/data/pollution/'
        let deviceID = sensor.id //'F45EAB9F6CFA'

        let url = urlBase + deviceID
        url =  WEB_URL_NO_MOBILE + '/data/pollution/' + deviceID

        console.log('URL: ' + url)

        response = await fetch(url, {method: 'GET', credentials: 'include' })
        return response.json()
    }

    render() {
        let connStatus = this.state.connected ? 'Connected' : 'Not Connected'

        return (
            <View style={{flex: 3}}>
                <Text style={{textAlign: 'center', paddingBottom: 10}}>
                    {connStatus}
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
        this.computeDayAverage = this.computeDayAverage.bind(this)
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

    computeDayAverage(start, end, type, dataDays) {
        val = 0
        if (type == "PM1") {
            for (i = start; i < end; i ++) {
                val = val + dataDays[i].pm1Avg
            }
        } else if (type == "PM25") {
            for (i = start; i < end; i ++) {
                val = val + dataDays[i].pm25Avg
            }
        } else {
            for (i = start; i < end; i ++) {
                val = val + dataDays[i].pm10Avg
            }
        }
        length = end - start
        val = val / length
        val = val.toFixed(2)
        return val
    }

    render() {
        // period to show for data
        var data = this.props.sensor.sensorData
        var xData

        // choose which view to show
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

            xData = [-6, -5 -4, -3, -2, -1, 0]
            xData = xData.slice(data.length-7)

            // only show past 8 data points to avoid filling up graph
            if (data.length > 7) {
                data = data.slice(data.length-7)
            }

        } else if (this.props.period == 'day') {
            currDay = this.props.date.getDay()
            dataDays = data[currDay].data
            data = []
            if (this.props.selectedType == "PM1") {
                data.push(this.computeDayAverage(0, 4, "PM1", dataDays))
                data.push(this.computeDayAverage(4, 8, "PM1", dataDays))
                data.push(this.computeDayAverage(8, 12, "PM1", dataDays))
                data.push(this.computeDayAverage(12, 16, "PM1", dataDays))
                data.push(this.computeDayAverage(16, 20, "PM1", dataDays))
                data.push(this.computeDayAverage(20, 23, "PM1", dataDays))
            } else if (this.props.selectedType == "PM25") {
                data.push(this.computeDayAverage(0, 4, "PM25", dataDays))
                data.push(this.computeDayAverage(4, 8, "PM25", dataDays))
                data.push(this.computeDayAverage(8, 12, "PM25", dataDays))
                data.push(this.computeDayAverage(12, 16, "PM25", dataDays))
                data.push(this.computeDayAverage(16, 20, "PM25", dataDays))
                data.push(this.computeDayAverage(20, 23, "PM25", dataDays))
            } else {
                data.push(this.computeDayAverage(0, 4, "PM10", dataDays))
                data.push(this.computeDayAverage(4, 8, "PM10", dataDays))
                data.push(this.computeDayAverage(8, 12, "PM10", dataDays))
                data.push(this.computeDayAverage(12, 16, "PM10", dataDays))
                data.push(this.computeDayAverage(16, 20, "PM10", dataDays))
                data.push(this.computeDayAverage(20, 23, "PM10", dataDays))
            }

            xData = [0, 4, 8, 12, 4, 8]

        }  else if (this.props.period == 'week') {
            dataDays = data
            data = []
            if (this.props.selectedType == "PM1") {
                data.push(dataDays[0].avg.pm1Avg)
                data.push(dataDays[1].avg.pm1Avg)
                data.push(dataDays[2].avg.pm1Avg)
                data.push(dataDays[3].avg.pm1Avg)
                data.push(dataDays[4].avg.pm1Avg)
                data.push(dataDays[5].avg.pm1Avg)
                data.push(dataDays[6].avg.pm1Avg)
            } else if (this.props.selectedType == "PM25") {
                data.push(dataDays[0].avg.pm25Avg)
                data.push(dataDays[1].avg.pm25Avg)
                data.push(dataDays[2].avg.pm25Avg)
                data.push(dataDays[3].avg.pm25Avg)
                data.push(dataDays[4].avg.pm25Avg)
                data.push(dataDays[5].avg.pm25Avg)
                data.push(dataDays[6].avg.pm25Avg)
            } else {
                data.push(dataDays[0].avg.pm10Avg)
                data.push(dataDays[1].avg.pm10Avg)
                data.push(dataDays[2].avg.pm10Avg)
                data.push(dataDays[3].avg.pm10Avg)
                data.push(dataDays[4].avg.pm10Avg)
                data.push(dataDays[5].avg.pm10Avg)
                data.push(dataDays[6].avg.pm10Avg)
            }

            xData = ['S', 'M', 'T', 'W', 'H', 'F', 'S']

        } else {
            data = [0]
        }

        if (data.length == 0) {
            data = [0]
        }

        // create value labels
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

        // set color and allow pressing labels to update information
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
                    yMax={50}
                    yAccessor={({ item }) => item.value}
                    animate={false}>
                    <Grid direction={Grid.Direction.HORIZONTAL}/>
                    <Labels/>
                </BarChart>
                <XAxis
                    style={{ marginHorizontal: -10 }}
                    data={ xData }
                    formatLabel={ (value, index) => index }
                    contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'black' }}
                />
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