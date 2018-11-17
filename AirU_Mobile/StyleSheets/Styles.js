import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 5,
        flexDirection: 'column',
        padding: 30,
        alignItems: 'center',
    },
    home: {
        flex: 100,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center'
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
    }
});

export default styles