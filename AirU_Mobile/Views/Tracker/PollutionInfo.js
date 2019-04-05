import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Linking } from 'react-native';
export default class PollutionInfo extends Component<Props> {
    render() {
        const { navigation } = this.props;
        const pollution = navigation.getParam('pollution', .5);
        let view;
        let link = <Text style={{fontSize:18, margin: 10}}>What is <Text style={{color:'blue', textDecorationLine: 'underline'}} onPress={ ()=>{ Linking.openURL('https://blissair.com/what-is-pm-2-5.htm')}}>PM2.5?</Text></Text>
        if (pollution >= 0 && pollution < 12) {
            view =
                <View>
                    <Text style={[styles.header, { color: "green" }]}>Pollution Level: GOOD</Text>
                    <Text style={[styles.header, { color: "green" }]}>PM2.5: {pollution}</Text>
                    <View style={{ height: 250 }}>
                        <Image source={require('../../Resources/good.jpg')} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <Text style={{ fontSize: 18, margin: 10 }}>Air quality is satisfactory and poses little or no health risk.</Text>
                    {link}
                </View>
        } else if (pollution >= 12 && pollution < 35.4) {
            view =
                <View>
                    <Text style={[styles.header, { color: "yellow" }]}>Pollution Level: MODERATE</Text>
                    <Text style={[styles.header, { color: "yellow" }]}>PM2.5: {pollution}</Text>
                    <View style={{ height: 250 }}>
                        <Image source={require('../../Resources/moderate.jpg')} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <Text style={{ fontSize: 18, margin: 10 }}>
                        {"Unusually sensitive people may experience respiratory symptoms and should consider reducing prolonged or heavy outdoor exertion."}
                    </Text>
                    {link}
                </View>
        } else if (pollution >= 35.4 && pollution < 55.4) {
            view =
                <View>
                    <Text style={[styles.header, { color: "orange" }]}>Pollution Level: UNHEALTHY</Text>
                    <Text style={[styles.header, { color: "orange" }]}>PM2.5: {pollution}</Text>
                    <View style={{ height: 250 }}>
                        <Image source={require('../../Resources/bad.jpg')} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <Text style={{ fontSize: 18, margin: 10 }}>
                        {"These levels of PM2.5 are unhealthy for sensitive groups. At this level there is Increasing likelihood of respiratory symptoms in sensitive individuals, aggravation of heart or lung disease and premature mortality in persons with cardiopulmonary disease and the elderly. The following groups should reduce prolonged or heavy outdoor exertion:\n- People with lung disease, such as asthma\n- Children and older adults\n- People who are active outdoors"}
                    </Text>
                    {link}
                </View>
        } else if (pollution >= 55.4) {
            view =
                <View>
                    <Text style={[styles.header, { color: "red" }]}>Pollution Level: VERY UNHEALTHY</Text>
                    <Text style={[styles.header, { color: "red" }]}>PM2.5: {pollution}</Text>
                    <View style={{ height: 250 }}>
                        <Image source={require('../../Resources/verybad.jpg')} style={{ width: '100%', height: '100%' }} />
                    </View>
                    <Text style={{ fontSize: 18, margin: 10 }}>
                        {"This level of pollution is unhealthy for the general population and dangerous for sensitive groups. The following groups should avoid all outdoor exertion:\n- People with lung disease, such as asthma\n- Children and older adults\n- People who are active outdoors\nEveryone else should limit outdoor exertion."}
                    </Text>
                    {link}
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