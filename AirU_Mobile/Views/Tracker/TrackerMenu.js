import React, { Component } from 'react';
import { View, Button, Text, FlatList, TouchableOpacity } from 'react-native';
import { AsyncStorage } from 'react-native';
import { EXPOSUREDATA } from '../../Components/Constants';
import DialogInput from 'react-native-dialog-input';

export default class TrackerMenu extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            savedData: [],
            editing: false,
            editingIndex: 0
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
        let dialog;
        if (this.state.editing) {
            dialog = <DialogInput isDialogVisible={this.state.isDialogVisible}
                title={"Edit"}
                hintInput={this.state.savedData[this.state.editingIndex].title}
                submitInput={(inputText) => { this.sendInput(inputText) }}
                closeDialog={() => { this.setState({ editing: false }) }}>
            </DialogInput>
        }
        return (
            <View>
                {dialog}
                <View style={{ padding: 10 }}>
                    <Button title="Start New" onPress={this.startNew.bind(this)}></Button>
                </View>
                <FlatList
                    style={{ marginTop: 20 }}
                    data={this.state.savedData}
                    renderItem={({ item, index }) =>
                        <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'stretch' }}>
                            <Text onPress={this.viewData.bind(this, item)} onLongPress={this.editTitle.bind(this, index)}
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

    editTitle(index) {
        this.setState({ editing: true, editingIndex: index });
    }

    sendInput(newTitle) {
        this.state.savedData[this.state.editingIndex].title = newTitle;
        AsyncStorage.setItem(EXPOSUREDATA, JSON.stringify(this.state.savedData));
        this.setState({ savedData: this.state.savedData, editing: false });
    }

    deleteData(index) {
        this.state.savedData.splice(index, 1);
        AsyncStorage.setItem(EXPOSUREDATA, JSON.stringify(this.state.savedData));
        this.updateList();
    }

}