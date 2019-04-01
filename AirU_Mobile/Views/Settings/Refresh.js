import React, {Component} from 'react';
import {Text, View, Image, KeyboardAvoidingView, TextInput, Button, AsyncStorage} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import styles from '../../StyleSheets/Styles'
import { REFRESH } from '../../Components/Constants'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'

export default class Refresh extends Component<Props> {
    constructor(Props) {
        super(Props)
        
        this.setRate = this.setRate.bind(this);
        this.saveRate = this.saveRate.bind(this);
        this.getRate = this.getRate.bind(this);
        this.state = {refresh: 30000}
    }

    componentWillMount() {
        this.getRate()
    }

    // get current refresh rate, default to 30 seconds
    getRate() {
        AsyncStorage.getItem(REFRESH).then((_retrieveData) => {
            if (_retrieveData == null) {
                this.setState({refresh: 30000})
            } else {
                this.setState({refresh: _retrieveData})
            }})
    }

    setRate(rate) {
        this.setState({refresh: rate})
    }

    saveRate() {
        AsyncStorage.setItem(REFRESH, JSON.stringify(this.state.refresh))
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={[styles.container, {paddingTop: 30}]}>
                <RadioButtons rate={this.state.refresh} handler={this.setRate}/>
                <Button title="Update Settings"
                            onPress={() => this.saveRate()}
                            color='crimson' 
                        />
            </View>
        )
    }
}

/**
 * Renders radio buttons on screen for selecting Public or Private
 * @param {boolean} rate - Current true/false setting
 * @param {method} handler - callback handler when data changed
 */
class RadioButtons extends Component<Props> {
    constructor(Props) {
        super(Props)
    }

    render() {
        var radio_props = [
            {label: '30 Seconds', value: 30000 },
            {label: '1 Minute', value: 60000 },
            {label: '5 Minute', value: 300000 },
            {label: '10 Minutes', value: 600000 },
            {label: '15 Minutes', value: 900000 }
          ];

          // set selected button
          var defaultValue
          switch(this.props.refreshRate) {
              case 30000: defaultValue = 0; break;
              case 60000: defaultValue = 1; break;
              case 300000: defaultValue = 2; break;
              case 600000: defaultValue = 3; break;
              case 900000: defaultValue = 4; break;
              default: defaultValue = 0;
          }

          return(
              <View style={{alignContent: 'center', flexDirection: 'row'}}>
                  <RadioForm
                    radio_props={radio_props}
                    initial={defaultValue}
                    formHorizontal={false}
                    labelHorizontal={true}
                    buttonColor={'red'}
                    animation={true}
                    onPress={(value) => this.props.handler(value)}
                    />
              </View>
          )
    }
}