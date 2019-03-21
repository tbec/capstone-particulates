import {AsyncStorage} from 'react-native'
import {SENSOR_ARRAY} from '../Components/Constants'
import React from 'react'

/**
 * Information related to sensor
 * 
 * Sensor dataset should contain following information:
 *  [array of Days]
 * A day has:
 *  date: day it corresponds to
 *  dataSet
 *    [] of values corresponding to measuremeant
 *    avg of each which is average over dataset
 * 
 * @param id string Sensor MAC ID
 * @param name string Name of sensor
 * @param Privacy boolean true or false
 * @param Dataset set of data
 */

export const sensorFuncs = {
    // sensor attributes
    getID: function(sensor) {
        return sensor.id
    },

    getName: function(sensor) {
        let name = sensor.sensorName
        return name
    },

    getPrivacy: function (sensor) {
        return sensor.privacy
    },

    getDataSet: function(sensor) {
        return sensor.sensorData
    },

    /**
     * Create new empty day
     */
    emptyWeek: function() {
        let emptyWeek = [sensorFuncs.emptyDay(), sensorFuncs.emptyDay(), sensorFuncs.emptyDay(), sensorFuncs.emptyDay()
                , sensorFuncs.emptyDay(), sensorFuncs.emptyDay(), sensorFuncs.emptyDay()]
        return emptyWeek
    },

    /**
     * Create new empty day
     */
    emptyDay: function() {
        var _data = []

        for (i = 0; i < 24; i++) {
            _data.push({pm1: [], pm25: [], pm10: [], pm1Avg: 0.00, pm25Avg: 0.00, pm10Avg: 0.00})
        }

        let _date = new Date(Date.now())
        _date = new Date(_date.setHours(0,0,0))
        _avg = {pm1Avg: 0, pm25Avg: 0, pm10Avg: 0}
        let emptyDay = {date: _date, data: _data, avg: _avg}
        return emptyDay
    },

    /**
     * Adds a new datapoint to the set. If it it a new day, 
     *  will remove previous day as well
     * @param sensor Sensor to pull data from
     * @param dataPoint datapoint to add
     * @param dataSet Entire sensor dataset
     * @returns sensor with updated data
     */
    addData: function(sensorList, position, dataPoint, dataSet) {
        // setup
        let sensor = sensorList[position]
        
        // get date
        let date = new Date(Date.now())
        let dateStart = new Date(Date.now())
        dateStart = new Date(dateStart.setHours(0,0,0))
        let dayOfWeek = date.getDay()
        let day = dataSet[dayOfWeek]
        dayDate = new Date(day.date)

        // if dates are different, update day
        if (dayDate.getDate() != dateStart.getDate()) {
            day = sensorFuncs.emptyDay()
        }

        let hour = date.getHours()
        let currHour = day.data[hour]

        // add data. Will be null if server could not find, such as setting up a new sensor
        if (dataPoint.pm1 != null) {
            currHour.pm1.push(parseInt(dataPoint.pm1.toFixed(2)))
        } else {
            currHour.pm1.push(0)
        }
        if (dataPoint.pm25 != null) {
            currHour.pm25.push(parseInt(dataPoint.pm25.toFixed(2)))
        } else {
            currHour.pm25.push(0)
        }
        if (dataPoint.pm10 != null) {
            currHour.pm10.push(parseInt(dataPoint.pm10.toFixed(2)))
        } else {
            currHour.pm10.push(0)
        }

        // update averages and reduce to 2 decimalsd)
        for (i = 0; i < currHour.pm1.length; i++) {
            currHour.pm1Avg = currHour.pm1Avg + currHour.pm1[i]
            currHour.pm25Avg = currHour.pm25Avg + currHour.pm25[i]
            currHour.pm10Avg = currHour.pm10Avg + currHour.pm10[i]
        }

        currHour.pm1Avg = currHour.pm1Avg / currHour.pm1.length 
        currHour.pm25Avg = currHour.pm25Avg / currHour.pm25.length 
        currHour.pm10Avg = currHour.pm10Avg / currHour.pm10.length 

        day.avg.pm1Avg = (day.avg.pm1Avg + currHour.pm1Avg) / 2
        day.avg.pm25Avg = (day.avg.pm25Avg + currHour.pm25Avg) / 2
        day.avg.pm10Avg = (day.avg.pm10Avg + currHour.pm10Avg) / 2

        // set data point
        day.data[hour] = currHour
        sensor.sensorData[dayOfWeek] = day

        // save sensor and return
        sensorList[position] = sensor
        jsonList = JSON.stringify(sensorList)
        AsyncStorage.setItem(SENSOR_ARRAY, jsonList)

        return sensor
    }
}