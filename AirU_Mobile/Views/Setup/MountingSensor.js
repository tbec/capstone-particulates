/**
 * Main setup page
 */

import React, {Component} from 'react';
import {Text, View, TouchableHighlight, Image} from 'react-native';
import styles from '../../StyleSheets/Styles'

export default class ReviewFirst extends Component<Props> {

    render() {
        return (
            <View style={styles.mainView}>
                <Text>Mounting</Text>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableHighlight 
                        style={styles.previousButton}
                        onPress={() => this.props.navigation.navigate('ReviewFirst')}>
                            <Image source={require('../../Resources/previous.png')} style={styles.nextButton}/>
                    </TouchableHighlight>
                    <TouchableHighlight 
                        style={styles.nextButton}
                        onPress={() => this.props.navigation.navigate('BluetoothSetup')}>
                            <Image source={require('../../Resources/next.png')} style={styles.nextButton}/>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}