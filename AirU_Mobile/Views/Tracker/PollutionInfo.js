import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
export default class PollutionInfo extends Component<Props> {
    render() {
        const { navigation } = this.props;
        const pollution = navigation.getParam('pollution', .5);
        let view;
        if (pollution >= 0 && pollution < .25) {
            view =
                <View>
                    <Text style={[styles.header, { color: "green" }]}>Pollution Level: GOOD</Text>
                    <Text style={[styles.header, { color: "green" }]}>AQI: {pollution}</Text>
                    <View style={{ height: 250 }}>
                        <Image source={require('../../Resources/good.jpg')} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <Text style={{ fontSize: 24, margin: 10 }}>Air quality is satisfactory and poses little or no health risk</Text>
                </View>
        } else if (pollution >= .25 && pollution < .5) {
            view =
                <View>
                    <Text style={[styles.header, { color: "yellow" }]}>Pollution Level: MODERATE</Text>
                    <Text style={[styles.header, { color: "yellow" }]}>AQI: {pollution}</Text>
                    <View style={{ height: 250 }}>
                        <Image source={require('../../Resources/moderate.jpg')} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <Text style={{ fontSize: 24, margin: 10 }}>
                        {"Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion."}
                    </Text>
                </View>
        } else if (pollution >= .5 && pollution < .75) {
            view =
                <View>
                    <Text style={[styles.header, { color: "orange" }]}>Pollution Level: UNHEALTHY</Text>
                    <Text style={[styles.header, { color: "orange" }]}>AQI: {pollution}</Text>
                    <View style={{ height: 250 }}>
                        <Image source={require('../../Resources/bad.jpg')} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <Text style={{ fontSize: 24, margin: 10 }}>
                        {"The following groups should reduce prolonged or heavy outdoor exertion:\n- People with lung disease, such as asthma\n- Children and older adults\n- People who are active outdoors"}
                    </Text>
                </View>
        } else if (pollution >= .75 && pollution <= 1) {
            view =
                <View>
                    <Text style={[styles.header, { color: "red" }]}>Pollution Level: VERY UNHEALTHY</Text>
                    <Text style={[styles.header, { color: "red" }]}>AQI: {pollution}</Text>
                    <View style={{ height: 250 }}>
                        <Image source={require('../../Resources/verybad.jpg')} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <Text style={{ fontSize: 24, margin: 10 }}>
                        {"The following groups should avoid all outdoor exertion:\n- People with lung disease, such as asthma\n- Children and older adults\n- People who are active outdoors\nEveryone else should limit outdoor exertion."}
                    </Text>
                </View>
        }
        return (
            <View>
                {view}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center"
    }
});