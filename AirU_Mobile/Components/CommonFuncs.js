import * as Keychain from 'react-native-keychain';
import {WEB_URL} from './Constants'
import {AsyncStorage} from 'react-native'
import React from 'react'

export const accountFuncs = {

     /**Logs into the site, must call before adding device **/
    async loginKeychain() {
        let username, password

        await Keychain.getGenericPassword().then((credentials) => {
            if (credentials == null) {
                return null
            } else {
                username = credentials.username
                password = credentials.password
            }
        })

        let urlBase = WEB_URL + '/login?'
        let user = 'username=' + username
        let passwordParam = '&password=' + password

        let url = urlBase + user + passwordParam

        console.log('URL: ' + url)

        return fetch(url, {method: 'POST', credentials: 'include'})
            .then((response) => response.json())
            .then((responseJson) => {
            return responseJson })
            .catch((error) => { 
                console.log(error)
                return null
            })
    },

    /** Saves account details locally */
    async saveAccount(username, password) {
        await Keychain.setGenericPassword(username, password)
    },

    /** Removes account details locally **/
    async removeAccount() {
        await Keychain.resetGenericPassword();
    },

    /**
     * Get sensors from server and add locally
     */
    async updateArrays() {
        let _login

        // try to login, return if could not or credentials not saved
        let res = await accountFuncs.loginKeychain()
        if (res == null) {
            return
        }
        
        // if successfully logged in, get account sensors
        if (res != null && JSON.parse(res).success) {
            let sensors = await this.getSensorsWebCall()
            let sensorJSON = JSON.parse(sensors)
            console.log("Got sensor JSON")

            // if no data, remove all sensors?
            if (sensorJSON == null) {
                AsyncStorage.setItem(SENSOR_ARRAY, null)
                return
            }

            sensorList = await AsyncStorage.getItem(SENSOR_ARRAY).then(res => JSON.parse(res))
            var newSensorList = []
            var inSensor = false

            // for each loop to go through and add sensors
            for (let currSensor of sensorJSON) {
                inSensor = false

                // check if exists
                if (sensorList != null) {
                    for (let listSensor of sensorList) {
                        if (currSensor.DeviceName == sensorFuncs.getName(listSensor)) {
                            inSensor = true
                            break;
                        }
                    }
                }

                if (inSensor) {
                    continue;
                }

                // if did not find, add to list
                _id = currSensor.DeviceId
                _name = currSensor.DeviceName
                _privacy = false
                _sensorData = sensorFuncs.emptyWeek()

                let newSensor = {id: _id, sensorName: _name, privacy: _privacy, sensorData: _sensorData};
                newSensorList.push(newSensor)
            }

            if (sensorList == null) {
                sensorList = []
            }

            sensorList.push(newSensorList)
            AsyncStorage.setItem(SENSOR_ARRAY, JSON.stringify(sensorList))
            console.log("Wrote sensors")

            // get data for each?
        }
    },

    /**
     * Gets sensors associated with account
     */
    async getSensorsWebCall() {
        let urlBase = WEB_URL + '/user/devices'
        let url = urlBase

        console.log('URL: ' + url)

        // format returned [DeviceID: .... DeviceName: ....]
        return fetch(url, {method: 'GET', credentials: 'include' })
            .then((response) => response.json())
            .then((responseJson) => {
            return responseJson })
          .catch((error) => { 
              console.error(log)
              return null
        })
    }
}