/**
 * Instructions for mounting sensor setup page
 */
import React, {Component} from 'react';
import {Text, View, KeyboardAvoidingView, Image, TextInput} from 'react-native';
import NavBar from '../../Components/NavBar'
import styles from '../../StyleSheets/Styles'

export default class ReviewFirst extends Component<Props> {
    constructor(props) {
        super(props);
        this.state={sensorName: ''}
    }

    render() {
        let navBar = <NavBar navigation={this.props.navigation} next='ConnectionSetup' previous='ReviewFirst' 
                        navProps={{sensorName: this.state.sensorName}}/>

        return (
            <View style={styles.mainView}>
                <View style={{flex: 7, alignContent: 'flex-start'}}>
                    <View style={{flex: 2}}>
                        <Text>Find a suitible spot to mount the sensor outside. The location you choose should be: </Text>
                        <Text/>
                        <Text> 1. Near a power outlet</Text>
                        <Text> 2. Near a WiFi connection</Text>
                        <Text> 3. At least 4 ft. above ground</Text>
                        <Text> 4. Protected from rain and snow</Text>
                        <Text> 5. Away from exhast vents</Text>
                        <Text/>
                        <Text>Once a spot is found, use the zip ties to fix to the location and plug in the sensor</Text>
                    </View>
                    <View style={{alignContent: 'center', justifyContent: 'center', flex: 2, paddingLeft: 50, 
                            paddingBottom: 10}}>
                    <Image source={require('../../Resources/SensorMounting.png')} 
                            style={{flex:1, height: 263, width: 242}}/>
                    </View>
                </View>
                <KeyboardAvoidingView style={{flex: 1, alignContent: 'flex-start', justifyContent: 'flex-start',
                        paddingLeft: 50, alignContent: 'center'}}>
                    <Text>Enter a name for your sensor</Text>
                    <TextInput editable={true} keyboardType='default' 
                                autoCorrect={false} placeholder='Sensor Name' secureTextEntry={false}
                                style={styles.textInput}
                                onChangeText={(value) => {this.setState({sensorName: value})}}
                    />
                </KeyboardAvoidingView>
                {navBar}
            </View>
        );
    }
}