import {createBottomTabNavigator, createStackNavigator} from 'react-navigation'
import Home from '../Views/Home'
import Settings from '../Views/Settings'
import Map from '../Views/Map'
import Tracker from '../Views/Tracker'

// Home screen and options
const TabNavigator = createBottomTabNavigator(
  {
    Home: {screen: Home},
    Settings: {screen: Settings}
  },
);

const Router = createStackNavigator(
  {
    Home: {screen: Home, },
    Settings: {screen: Settings, },
    Tabs: {screen: TabNavigator, initalRouteName: 'Home'}
  },
  {
    initalRouteName: 'Home',
    navigationOptions: ({navigation}) => ({
      header: null
    }),
  },
);

export default Router