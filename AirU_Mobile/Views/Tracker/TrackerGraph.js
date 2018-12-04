import React, {Component} from 'react';
import {View, Button, TouchableHighlight, Image} from 'react-native';
import { LineChart, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Circle, G, Line, Rect, Text } from 'react-native-svg';

export default class TrackerGraph extends Component<Props>
{
    constructor(props) {
        super(props);
    }
    render() {
        const data = this.props.data;
        const selectedIndex = this.props.selectedIndex;
        const Tooltip = ({ x, y }) => (
            <G
                x={ x(selectedIndex) - (75 / 2) }
                key={ 'tooltip' }
                onPress={ () => console.log('tooltip clicked') }
            >
                <G y={ 50 }>
                    <Rect
                        height={ 40 }
                        width={ 75 }
                        stroke={ 'grey' }
                        fill={ 'white' }
                        ry={ 10 }
                        rx={ 10 }
                    />
                    <Text
                        x={ 75 / 2 }
                        dy={ 20 }
                        alignmentBaseline={ 'middle' }
                        textAnchor={ 'middle' }
                        stroke={ 'rgb(134, 65, 244)' }
                    >
                        { `${data[selectedIndex]}` }
                    </Text>
                </G>
                <G x={ 75 / 2 }>
                    <Line
                        y1={ 50 + 40 }
                        y2={ y(data[ selectedIndex ]) }
                        stroke={ 'grey' }
                        strokeWidth={ 2 }
                    />
                    <Circle
                        cy={ y(data[ selectedIndex ]) }
                        r={ 6 }
                        stroke={ 'rgb(134, 65, 244)' }
                        strokeWidth={ 2 }
                        fill={ 'white' }
                    />
                </G>
            </G>
        )

        return (
            <LineChart
                style={{ height: 200, backgroundColor: "#fff" }}
                data={ data }
                svg={{
                    stroke: 'rgb(134, 65, 244)',
                    strokeWidth: 2,
                }}
                contentInset={{ top: 20, bottom: 20 }}
                curve={ shape.curveLinear }
            >
                <Grid/>
                <Tooltip/>
            </LineChart>
        )
    };
}