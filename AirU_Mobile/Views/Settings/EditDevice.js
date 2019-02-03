import React, {Component} from 'react';
import {Text, View, Image, KeyboardAvoidingView, Linking, TextInput, Button, AsyncStorage} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import styles from '../../StyleSheets/Styles'
import { SENSOR_ARRAY } from '../../Components/Constants'

/**
 * Edit existing devices, accessed from Settings screen
 */
export default class EditDevice extends Component<Props> {
    constructor(props) {
        super(props);
        this.editDevice = this.editDevice.bind(this)
        this.setPrivacy = this.setPrivacy.bind(this)
        sensorsList = this.props.navigation.getParam('sensorList', 'NewSensor')
        this.state=({sensorList: sensorsList, sensorIndex: 0,
                        selectedSensor: sensorsList[0], name: sensorsList[0].sensorName, 
                        id: sensorsList[0].id, privacy: sensorsList[0].privacy})
    }

    setPrivacy(value) {
        this.setState({privacy: value})
    }
    
    // edits device info locally and in web database
    async editDevice() {
        // make web call

        // update settings locally
        sensor = this.state.selectedSensor
        sensorList = this.state.sensorList

        sensor.sensorName = this.state.name
        sensor.privacy = this.state.privacy
        sensorList[this.state.sensorIndex] = sensor;

        var json = JSON.stringify(sensorList);
        await AsyncStorage.setItem(SENSOR_ARRAY, json);

        // navigate back
        this.props.navigation.goBack();
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={{flex: 20, backgroundColor: '#b3e6ff'}}>
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20, flexDirection: 'column'}}>
                        <Image source={require('../../Resources/red_cloud.jpeg')} 
                                        style={{width: '50%', height: '60%'}}/>
                    </View>
                    <View style={styles.textGroupBox}>
                        <Text style={[styles.textInputLabel, {textAlign: 'center'}]}>Device id</Text>
                        <Text style={{textAlign: 'center', paddingBottom: 10}}>{this.state.id}</Text>
                    </View>
                    <KeyboardAvoidingView style={styles.textGroupBox}>
                        <Text style={styles.textInputLabel}>Device Name</Text>
                        <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} secureTextEntry={false} 
                                style={styles.textInput}
                                onChangeText={(value) => {this.setState({name: value})}}
                                value={this.state.name}
                                />
                    </KeyboardAvoidingView>
                    <View style={styles.textGroupBox}>
                        <Text style={styles.textInputLabel}>Privacy Setting</Text>
                        <RadioButtons privacy={this.state.privacy == false ? 0 : 1} handler={this.setPrivacy}/>
                    </View>
                    <Button title="Update Settings"
                            onPress={() => this.editDevice()}
                            color='crimson' 
                        />
                </View>
            </View>
        )
    }
}

class RadioButtons extends Component<Props> {
    constructor(Props) {
        super(Props)
    }

    render() {
        var radio_props = [
            {label: 'Private', value: false },
            {label: 'Public', value: true }
          ];

          return(
              <View style={{alignContent: 'center', flexDirection: 'row'}}>
                  <RadioForm
                    radio_props={radio_props}
                    initial={this.props.privacy}
                    formHorizontal={true}
                    labelHorizontal={false}
                    buttonColor={'red'}
                    animation={true}
                    onPress={(value) => this.props.handler(value)}
                    />
              </View>
          )
    }
}