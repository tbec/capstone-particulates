import React, {Component} from 'react';
import {Text, View, Image, KeyboardAvoidingView, Linking, TextInput, Button} from 'react-native';
import styles from '../../StyleSheets/Styles'

/**
 * Edit existing devices, accessed from Settings screen
 */
export default class EditDevice extends Component<Props> {
    constructor(props) {
        super(props);
        this.editDevice = this.editDevice.bind(this)
        sensorsList = this.props.navigation.getParam('sensorList', 'NewSensor')
        this.state=({sensorList: sensorsList, 
                        selectedSensor: sensorsList[0], name: sensorsList[0].sensorName, 
                        id: sensorsList[0].id, privacy: sensorsList[0].privacy})
    }
    
    // edits device info locally and in web database
    editDevice() {
        // make web call

        // update settings locally

        // navigate back
        this.props.navigation.goBack();
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={{flex: 20, backgroundColor: '#b3e6ff'}}>
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', paddingTop: 20, flexDirection: 'column'}}>
                        <Image source={require('../../Resources/red_cloud.jpeg')} 
                                        style={{width: '50%', height: '60%'}}/>
                    </View>
                    <Text>{this.state.id}</Text>
                    <KeyboardAvoidingView style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={styles.textInputLabel}>Device Name</Text>
                        <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} secureTextEntry={false} 
                                style={styles.textInput}
                                onChangeText={(value) => {this.setState({login: value})}}
                                value={this.state.name}
                                />
                    </KeyboardAvoidingView>
                    <View style={[styles.home, {flex: 3}]}>
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