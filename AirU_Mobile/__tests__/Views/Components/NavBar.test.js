import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import NavBar from '../../../Components/NavBar'

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

test('Snapshot NavBar Setup', () => {
    const snap = renderer.create(<NavBar navigation={undefined}/>).toJSON();
    expect(snap).toMatchSnapshot();
})

test('NavBar with nextButton', () => {
    const nav = renderer.create(<NavBar previous='ConnectionSetup'/>).toJSON();
    button = findById(nav, 'prevButton')
    expect(button).toBeDefined();
    button = findById(nav, 'nextButton')
    expect(button).toBeUndefined();
})

test('NavBar with nextButton', () => {
    const nav = renderer.create(<NavBar next='ConnectionSetup'/>).toJSON();
    button = findById(nav, 'nextButton')
    expect(button).toBeDefined();
    button = findById(nav, 'prevButton')
    expect(button).toBeUndefined();
})

test('NavBar with both', () => {
    const nav = renderer.create(<NavBar next='ConnectionSetup' previous='ReviewFirst'/>).toJSON();
    button = findById(nav, 'nextButton')
    expect(button).toBeDefined();
    button = findById(nav, 'prevButton')
    expect(button).toBeDefined();
})