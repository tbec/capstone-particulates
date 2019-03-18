import * as Keychain from 'react-native-keychain';
import {WEB_URL} from './Constants'

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
    }
}