import React, {Component} from 'react';
import {View, TouchableHighlight, Image,Text} from 'react-native';
import {styles} from '../StyleSheets/Styles'

export default class NavBar extends Component<Props>
{
    constructor(Props) {
        super(Props);
        console.log('next: ' + Props.next)
        this.state={next: Props.next}
    }

    render(){
        var nextButton, prevButton
        if (this.state.next !== '') {
            nextButton= <TouchableHighlight 
                            style={styles.previousButton}
                            onPress={() => this.props.navigation.navigate(this.state.next)}>
                                <Image source={require('../Resources/previous.png')} style={styles.nextButton}/>
                        </TouchableHighlight>
        } else {
            nextButton=null
        }
        // if (this.state.previous !== '') {
        //     prevButton=<TouchableHighlight 
        //             style={styles.nextButton}
        //             onPress={() => this.props.navigation.navigate(this.state.previous)}>
        //                 <Image source={require('../Resources/next.png')} style={styles.nextButton}/>
        //         </TouchableHighlight>
        // } else {
        //     prevButton=null
        // }

        return(
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text>NavBar</Text>
                {/* {this.nextButton} */}
                {/* {this.prevButton} */}
                <TouchableHighlight 
                            style={styles.next}
                            onPress={() => this.props.navigation.navigate(this.state.next)}>
                                <Image source={require('../Resources/next.png')} style={styles.nextButton}/>
                        </TouchableHighlight>
                <Text>Finished</Text>
            </View>
        )
    };
}