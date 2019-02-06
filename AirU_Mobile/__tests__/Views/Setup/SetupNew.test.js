import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import SetupNew from '../../../Views/Setup/SetupNew'
import MockStorage from '../../mockStorage'

// https://stackoverflow.com/questions/40952566/how-to-test-async-storage-with-jest
const storageCache = {};
const AsyncStorage = new MockStorage(storageCache);
jest.setMock('AsyncStorage', AsyncStorage)

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
    const snap = renderer.create(<SetupNew/>).toJSON();
    expect(snap).toMatchSnapshot();
})

test ('Is Not Logged In', () => {
    let login = renderer.create(<SetupNew/>).getInstance();
    login.checkLogin();
    expect(login.state.loggedIn).toEqual(false)        
})

test ('Is Logged In', () => {
    let login = renderer.create(<SetupNew/>).getInstance();
    login.checkLogin();
    expect(login.state.loggedIn).toEqual(false)        
})