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
        return sensor.name
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
        let dataPoint = {pm1: [], pm25: [], pm10: [], pm1Avg: 0, pm25Avg: 0, pm10Avg: 0}
        var _data = []

        for (i = 0; i < 24; i++) {
            _data.push(dataPoint)
        }

        let _date = new Date(Date.now())
        _date = new Date(_date.setHours(0,0,0))
        let emptyDay = {date: _date, data: _data}
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
    addData: function(sensor, dataPoint, dataSet) {
        // setup
        let date = new Date(Date.now())
        let dateStart = new Date(Date.now())
        dateStart = new Date(dateStart.setHours(0,0,0))
        let dayOfWeek = date.getDay()
        let day = dataSet[dayOfWeek]

        // if dates are different, update day
        if (day.date.valueOf != dateStart.valueOf) {
            day = sensorFuncs.emptyDay()
        }

        let hour = date.getHours()
        let today = day.data[hour]

        // add data
        today.pm1.push(dataPoint.pm1)
        today.pm25.push(dataPoint.pm25)
        today.pm10.push(dataPoint.pm10)

        reducer = (first, second, length) => (first + second) / length;

        // update averages
        today.pm1Avg = today.pm1.reduce(reducer)
        today.pm25Avg = today.pm25.reduce(reducer)
        today.pm10Avg = today.pm10.reduce(reducer)

        // set data point and return
        day.data[hour] = today
        sensor.sensorData[dayOfWeek] = day

        // save sensor?
        return sensor
    }
}