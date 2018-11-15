import {createStackNavigator} from 'react-navigation'
import Home from '../Views/Home'
import Settings from '../Views/Settings'
import Map from '../Views/Map'
import Tracker from '../Views/Tracker'

// Home screen and options
export const navigation = createStackNavigator(
  {
    Home: Home,
    Settings: Settings,
    //Map: Map,
    //Tracker: Tracker
  },
  {
    initialRouteName: 'Home'
  }
);

export default navigation