import React, {Component} from 'react';
import {View, TouchableHighlight, Image,Text} from 'react-native';
import {styles} from '../StyleSheets/Styles'

// navbar that is used on bottom of screens in setup process

export default class NavBar extends Component<Props>
{
    constructor(props) {
        super(props);
        this.props.navigation = props.navigation
        this.state={next: props.next, previous: props.previous}
    }

    render(){
        var nextButton, prevButton
        if (this.state.previous != null) {
            prevButton=<TouchableHighlight 
                            style={styles.previousButton}
                            onPress={() => this.props.navigation.navigate(this.state.previous)}>
                                <Image source={require('../Resources/previous.png')} style={styles.previousButton}/>
                        </TouchableHighlight>;
        } else {
            nextButton=null
        }
        if (this.state.next != null) {
            nextButton=<TouchableHighlight 
                    style={styles.nextButton}
                    onPress={() => this.props.navigation.navigate(this.state.next)}>
                        <Image source={require('../Resources/next.png')} style={styles.nextButton}/>
                </TouchableHighlight>;
        } else {
            prevButton=null
        }

        return(
            <View style={styles.navBar}>
                {prevButton}
                {nextButton}
            </View>
        )
    };
}