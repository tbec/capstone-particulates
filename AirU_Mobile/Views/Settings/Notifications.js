import React, { Component } from 'react';
import { Text, View, Button, AsyncStorage } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import styles from '../../StyleSheets/Styles';
import { CheckBox } from 'react-native-elements';
import { NOTIFICATIONS, SENSITIVE } from '../../Components/Constants';

export default class Notifications extends Component<Props> {
    constructor(Props) {
        super(Props)
        this.state = {
            sensitive: false,
            on: true
        }
    }

    componentWillMount() {
        AsyncStorage.getItem(NOTIFICATIONS, (error, result) => {
            if (result == 'false') {
                this.setState({ on: false });
            } else {
                this.setState({ on: true });
            }
        });
        AsyncStorage.getItem(SENSITIVE, (error, result) => {
            if (result == 'true') {
                this.setState({ sensitive: true });
            } else {
                this.setState({ sensitive: false });
            }
        });
    }

    render() {
        return (
            <View style={[styles.container]}>
                <View style={{ padding: 10 }}>
                    <CheckBox
                        containerStyle={{ backgroundColor: '#00000000' }}
                        left
                        title='Receive notification warnings when having been exposed to dangerous levels of pollution for extended periods of time'
                        checked={this.state.on}
                        onPress={() => this.setState({ on: !this.state.on })}
                    />
                    <CheckBox
                        containerStyle={{ backgroundColor: '#00000000' }}
                        left
                        title='Receive pollution warning notifications for individuals such as those with asthma, heart conditions, the elderly, or those participating in strenuous exercise'
                        checked={this.state.sensitive}
                        onPress={() => this.setState({ sensitive: !this.state.sensitive })}
                    />
                    <Button title="Update Notifications"
                        onPress={() => this.updateNotifications()}
                        color='crimson'
                    />
                </View>
            </View>
        )
    }

    updateNotifications() {
        AsyncStorage.setItem(NOTIFICATIONS, this.state.on.toString());
        AsyncStorage.setItem(SENSITIVE, this.state.sensitive.toString());
        this.props.navigation.pop();
    }
}