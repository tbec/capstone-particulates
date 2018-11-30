import React, {Component} from 'react';
import {Text, View, TouchableHighlight, Image} from 'react-native';
import styles from '../../StyleSheets/Styles'

export default class WiFiSetup extends Component<Props> {

    render() {
        return (
            <View style={{flex: 1}}>
                <Text>WiFiSetup page here</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableHighlight 
                            style={styles.previousButton}
                            onPress={() => this.props.navigation.navigate('BluetoothSetup')}>
                                <Image source={require('../../Resources/previous.png')} style={styles.nextButton}/>
                        </TouchableHighlight>
                        <TouchableHighlight 
                            style={styles.nextButton}
                            onPress={() => this.props.navigation.navigate('Privacy')}>
                                <Image source={require('../../Resources/next.png')} style={styles.nextButton}/>
                        </TouchableHighlight>
                    </View>
            </View>
        );
    }
}