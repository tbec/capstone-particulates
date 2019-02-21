import React, {Component} from 'react';

const sensorFuncs = (props) => {
    // sensor attributes
    function getID(sensor) {
        return sensor.id
    }

    function getName(sensor) {
        return sensor.name
    }

    function getPrivacy(sensor) {
        return sensor.privacy
    }

    function getDataSet(sensor) {
        return sensor.sensorData
    }

    /**
     * Create new empty day
     */
    function emptyWeek() {
        let emptyDay = emptyDay()
        let emptyWeek = [emptyDay, emptyDay, emptyDay, emptyDay, emptyDay, emptyDay, emptyDay]
        return emptyWeek
    }

    /**
     * Create new empty day
     */
    function emptyDay() {
        let dataPoint = {pm1: [], pm25: [], pm10: [], pm1Avg: 0, pm25Avg: 0, pm10Avg: 0}
        var _data

        for (i = 0; i < 24; i++) {
            data[i] = dataPoint
        }

        let emptyDay = {date: new Date(Date.now), avg: 0, data: _data}
        return emptyDay
    }

    /**
     * Adds a new datapoint to the set. If it it a new day, 
     *  will remove previous day as well
     * @param dataPoint datapoint to add
     * @param dataSet Entire sensor dataset
     */
    function addData(props) {
        dataPoint = props.dataPoint
        dataSet = props.dataSet

        let date = new Date(Date.now())
        let dayOfWeek = date.dayOfWeek()
        let day = dataSet[dayOfWeek]

        if (day.date.valueOf != date.setHours(0,0,0)) {
            day = emptyDay()
        }

        let hour = date.getHours()
        let today = day[hour]

        // add data
        today.pm1.push(dataPoint.pm1)
        today.pm25.push(dataPoint.pm25)
        today.pm10.push(dataPoint.pm10)

        // update averages
        today.pm1Avg = today.pm1Avg.reduce((a, b) => a + b) / today.pm1Avg.length;
        today.pm25Avg = today.pm25Avg.reduce((a, b) => a + b) / today.pm25Avg.length;
        today.pm10Avg = today.pm10Avg.reduce((a, b) => a + b) / today.pm10Avg.length;

        // set data point and return
        day[hour] = today
        return dataSet
    }
}