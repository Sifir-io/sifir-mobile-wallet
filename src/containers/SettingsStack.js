import SettingsMainScreen from '../components/screens/settings/SettingsMainScreen';
import {createStackNavigator} from 'react-navigation-stack';

const SettingsStack = createStackNavigator(
  {
    SettingsMainScreen: {
      screen: SettingsMainScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'SettingsMainScreen',
  },
);

export default SettingsStack;
