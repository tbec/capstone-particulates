import {StyleSheet} from 'react-native';

// CSS Styles page
export const styles = StyleSheet.create({
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
    },
    // header for image on home screen
    header: {
        flex: 5,
        flexDirection: 'column',
        padding: 40,
        alignItems: 'center',
    },
    // home layout, with buttons centered and spaced
    home: {
        flex: 100,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center', 
    }, 

    // Button with text justified in center, used on Home screen
    button: {
        borderWidth: 2,
        padding: 1,
        borderColor: 'black',
        backgroundColor: 'powderblue',
        width: 150,
        height: 50, 
        alignItems: 'center', 
        justifyContent: 'space-evenly'
    }, 
    mainView: {
        flex: 1,
        paddingTop: 30, 
        flexDirection: 'column',
        justifyContent: 'space-between', 
        height: '80%'
    }, 
    // next arrow used in setup
    nextButton: {
        flex: 5,
        padding: 10,
        borderColor: 'black',
        width:  40,
        height: 40, 
        alignItems: 'flex-end', 
        justifyContent: 'flex-end',
        backgroundColor: 'transparent'
    }, 
    // previous arrow used in setup
    previousButton: {
        flex: 5,
        padding: 10,
        borderColor: 'black',
        width:  40,
        height: 40, 
        alignItems: 'flex-start', 
        justifyContent: 'flex-start',
        backgroundColor: 'transparent'
    }, 
    // position for bottom NavBar.js
    navBar: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        alignContent: 'space-between'
    }
});

export default styles