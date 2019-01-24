import 'react-native'
import React from 'react'
import {TEST_MODE, SENSOR_ARRAY, LOGIN_NAME, LOGIN_TOKEN} from '../../../Components/Constants'

test(('All Constants Exist'), () => {
    expect(TEST_MODE).toBeDefined()
    expect(SENSOR_ARRAY).toBeDefined();
    expect(LOGIN_TOKEN).toBeDefined();
    expect(LOGIN_NAME).toBeDefined();
})