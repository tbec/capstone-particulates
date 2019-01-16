import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import ConnectionSetup from '../../../Views/Setup/ConnectionSetup'

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

test('Snapshot ConnectionSetup Setup', () => {
    const snap = renderer.create(<ConnectionSetup/>).toJSON();
    expect(snap).toMatchSnapshot();
})