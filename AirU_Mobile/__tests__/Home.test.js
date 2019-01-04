import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import Home from '../Views/Home'

// used to find testIDs in code
let findById = function(tree, testID) {
    if(tree.props && tree.props.testID === testID) {
        return tree
    }
    if(tree.children && tree.children.length > 0)
    {
        let childs = tree.children
        for(let i = 0; i < childs.length; i++)
        {
            let item = findById(childs[i], testID)
            if(typeof(item) !== 'undefined') {
                return item
            }
        }
    }
}

// create snapshot for home screen
test('Home Snapshot', () => {
    const snap = renderer.create(<Home/>).toJSON();
    expect(snap).toMatchSnapshot();
})

test('Select Sensor', () => {
    const home = renderer.create(<Home/>).toJSON();
    button = findById(home, 'SensorButton')
    expect(button).toBeDefined();
})

test('Select Tracker', () => {
    const home = renderer.create(<Home/>).toJSON();
    button = findById(home, 'TrackerButton')
    expect(button).toBeDefined();
})

test('Select Map', () => {
    const home = renderer.create(<Home/>).toJSON();
    button = findById(home, 'MapButton')
    expect(button).toBeDefined();
})

test('Select Settings', () => {
    const home = renderer.create(<Home/>).toJSON();
    button = findById(home, 'SettingsButton')
    expect(button).toBeDefined();
})