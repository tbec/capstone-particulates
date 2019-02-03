import React, {Component} from 'react';
import {Text, View, TouchableHighlight, ImageBackground, Linking, Alert, AsyncStorage} from 'react-native';
import styles from '../../StyleSheets/Styles'

/**
 * Edit existing devices, accessed from Settings screen
 */
export default class EditDevice extends Component<Props> {
    constructor(props) {
        super(props);
        this.getSensors = this.getDevice.bind(this)
        this.editDevice = this.editDevice.bind(this)
        this.state=({sensorList: null, selectedSensor: null})
    }

    componentWillMount() {
        this.getSensors()
    }

    // gets list of saved sensors
    async getSensors() {
        let sensorsList = await this.getSensorList();
        this.setState({sensorList: sensorsList, selectedSensor: sensorsList[0]})
    }

    async getSensorList() {
        return await AsyncStorage.getItem(SENSOR_ARRAY).then(res => JSON.parse(res))
    }
    
    // edits device info locally and in web database
    editDevice() {
        // make web call

        // update settings locally
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={{flex: 20, backgroundColor: '#b3e6ff'}}>
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', paddingTop: 20, flexDirection: 'column'}}>
                        <Image source={require('../../Resources/red_cloud.jpeg')} 
                                        style={{width: '50%', height: '60%'}}/>
                    </View>
                    <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.textInputLabel}>Device Name</Text>
                        <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder={this.state.selectedSensor.sensorName} secureTextEntry={false} 
                                style={styles.textInput}
                                onChangeText={(value) => {this.setState({login: value})}}
                                />
                    </KeyboardAvoidingView>
                    <View style={[styles.home, {flex: 3}]}>
                    </View>
                </View>
            </View>
        )
    }
}