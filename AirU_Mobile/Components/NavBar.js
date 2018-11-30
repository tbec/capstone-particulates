import React, {Component} from 'react';
import {View, TouchableHighlight, Image,Text} from 'react-native';
import {styles} from '../StyleSheets/Styles'

// navbar that is used on bottom of screens in setup process

export default class NavBar extends Component<Props>
{
    // Takes 'next' and 'previous', which are used for where each button will navigate to; should match to screen in Navigator.js
    constructor(props) {
        super(props);
        this.props.navigation = props.navigation
        this.state={next: props.next, previous: props.previous}
    }

    // only renders appropriate button if path is provided
    render(){
        var nextButton, prevButton
        if (this.state.previous != null) {
            prevButton=<TouchableHighlight 
                            style={styles.previousButton}
                            activeOpacity={30}
                            underlayColor="yellow"
                            onPress={() => this.props.navigation.navigate(this.state.previous)}>
                                <Image source={require('../Resources/previous.png')} style={styles.previousButton}/>
                        </TouchableHighlight>;
        } else {
            prevButton=null
        }
        if (this.state.next != null) {
            nextButton=<TouchableHighlight 
                    style={styles.nextButton}
                    activeOpacity={30}
                    underlayColor="yellow"
                    onPress={() => this.props.navigation.navigate(this.state.next)}>
                        <Image source={require('../Resources/next.png')} style={styles.nextButton}/>
                </TouchableHighlight>;
        } else {
            nextButton=null
        }

        return(
            <View style={styles.navBar}>
                {prevButton}
                {nextButton}
            </View>
        )
    };
}