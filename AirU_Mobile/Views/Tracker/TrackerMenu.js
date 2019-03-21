import React, { Component } from 'react';
import { View, Button, Text, FlatList } from 'react-native';
import { AsyncStorage } from 'react-native';
import { EXPOSUREDATA } from '../../Components/Constants';

export default class TrackerMenu extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            savedData: []
        }
    }

    async updateList() {
        try {
            const savedData = await AsyncStorage.getItem(EXPOSUREDATA);
            if (savedData) {
                this.setState({ savedData: JSON.parse(savedData) });
            }
        } catch (error) {
        }
    }

    render() {
        this.updateList();
        return (
            <View>
                <Button title="Start New" onPress={this.startNew.bind(this)} style={{ margin: 3 }}></Button>
                <FlatList
                    data={this.state.savedData}
                    renderItem={({ item }) => <Text onPress={this.viewData.bind(this, item)}
                        style={{ color: 'blue', fontSize: 30, borderBottomWidth: 2, textAlign: "center", margin: 5 }}>{item.key}</Text>}
                />
            </View>);
    }

    startNew() {
        this.props.navigation.navigate('Tracker', {
            path: undefined
        });
    }

    viewData(path) {
        this.props.navigation.navigate('Tracker', {
            path: path
        });
    }

}