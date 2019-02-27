import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { AsyncStorage } from 'react-native';
import { EXPOSUREDATA } from '../../Components/Constants';

export default class TrackerMenu extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            savedData: []
        }
    }

    async componentDidMount() {
        try {
            const savedData = await AsyncStorage.getItem(EXPOSUREDATA);
            console.log("SAVED DATA");
            console.log(savedData);
            this.setState({ savedData: savedData });
        } catch (error) {
        }
    }

    render() {
        return (
            <View>
                <Button title="Start New" onPress={this.startNew.bind(this)}></Button>
            </View>);
    }

    startNew() {
        this.props.navigation.navigate('Tracker');
    }

}