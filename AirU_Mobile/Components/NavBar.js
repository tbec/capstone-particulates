import React, {Component} from 'react';
import {View, TouchableHighlight, Image, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

// navbar that is used on bottom of screens in setup process

export default class NavBar extends Component<Props>
{
    // Takes 'next' and 'previous', which are used for where each button will navigate to; 
    // should match to screen in Navigator.js. 
    // Also takes in optional 'navProps' which is passed to the next screen
    constructor(props) {
        super(props);
        this.props.navigation = props.navigation
        this.props.navProps = props.navProps
        this.state={next: props.next, previous: props.previous}
    }

    // only renders appropriate button if path is provided
    render(){
        var navStyles = require('../StyleSheets/Styles');
        var nextButton, prevButton
        if (this.state.previous != null) {
            prevButton=<TouchableHighlight 
                            style={navStyles.styles.previousButton}
                            activeOpacity={30}
                            underlayColor="yellow"
                            testID={'prevButton'}
                            onPress={() => this.props.navigation.navigate(this.state.previous, this.props.navProps)}>
                                <Icon name={Platform.OS === "ios" ? "ios-arrow-dropleft" : "md-arrow-dropleft"} size={40}/>
                        </TouchableHighlight>;
        } else {
            prevButton=null
        }
        if (this.state.next != null) {
            nextButton=<TouchableHighlight 
                    style={navStyles.styles.nextButton}
                    activeOpacity={30}
                    underlayColor="yellow"
                    testID={'nextButton'}
                    onPress={() => this.props.navigation.navigate(this.state.next, this.props.navProps)}>
                        <Icon name={Platform.OS === "ios" ? "ios-arrow-dropright" : "md-arrow-dropright"} size={40}/>
                </TouchableHighlight>;
        } else {
            nextButton=null
        }

        return(
            <View style={navStyles.styles.navBar}>
                {prevButton}
                {nextButton}
            </View>
        )
    };
}