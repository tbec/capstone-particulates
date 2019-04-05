import React, { Component } from 'react';
import { View, Button, Text, FlatList, TouchableOpacity } from 'react-native';
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
                <View style={{ padding: 10 }}>
                    <Button title="Start New" onPress={this.startNew.bind(this)}></Button>
                </View>
                <FlatList
                    style={{ marginTop: 20 }}
                    data={this.state.savedData}
                    renderItem={({ item, index }) =>
                        <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'stretch' }}>
                            <Text onPress={this.viewData.bind(this, item)}
                                style={{ fontSize: 30, textAlign: "center", padding: 10 }}>{item.title}</Text>
                            <TouchableOpacity style={{ backgroundColor: 'red', height: 40, borderRadius: 7, marginTop: 12, position: 'absolute', right: 10, padding: 10 }}
                                onPress={this.deleteData.bind(this, index)}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    }
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

    deleteData(index) {
        this.state.savedData.splice(index, 1);
        AsyncStorage.setItem(EXPOSUREDATA, JSON.stringify(this.state.savedData));
        this.updateList();
    }

}