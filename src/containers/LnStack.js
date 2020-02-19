// FIXME to new navgirattor schema
import {fromRight} from 'react-navigation-transitions';
import {createStackNavigator} from 'react-navigation-stack';

import {HomeScreen, SettingsScreen, LinksScreen} from '@screens/ln/index';

const LnStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null,
      },
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        header: null,
      },
    },
    Links: {
      screen: LinksScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'Home',
    transitionConfig: () => fromRight(700),
  },
);

export default LnStack;
