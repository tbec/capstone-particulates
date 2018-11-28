/**
 * Screen for privacy settings
 **/ 

import React, {Component} from 'react';
import {Text, View, TouchableHighlight,Image} from 'react-native';
import NavBar from '../../Components/NavBar'
import styles from '../../StyleSheets/Styles'

export default class Privacy extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {privacy: null}
    }

    setPrivacy(value) {
        this.setState({privacy: value})
        this.props.navigation.navigate('Confirmation');
    }

    render() {
        return (
            <View style={styles.mainView}>
                <View style={{flex: 5, alignContent: 'center', justifyContent: 'center'}}>
                    <Text style={{flex: 2}}>Your sensor has been successfully connected!
                        Would you like to make your sensor visable publically? 
                        This will allow people to view your sensor's location on a map and for researchers to directly use and access 
                        the data your sensor gathers.
                    </Text>
                    <Text/>
                    <Image source={require('../../Resources/SensorPrivacy.png')} style={{width: '100%', height: '100%', flex: 4, alignContent: 'center'}}/>
                </View>
                <View style={{flex: 3, flexDirection: 'column', alignContent: 'space-between', justifyContent: 'space-evenly', 
                            paddingTop: 5, paddingBottom: 5, paddingLeft: 20, paddingRight: 20}}>
                    <TouchableHighlight style={styles.button} onPress={() => this.setPrivacy(true)}>
                        <Text>Allow</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.button} onPress={() => this.setPrivacy(false)}>
                        <Text>Deny</Text>
                    </TouchableHighlight>
                </View>
                <NavBar navigation={this.props.navigation} previous='WiFiSetup'/>
            </View>
        );
    }
}