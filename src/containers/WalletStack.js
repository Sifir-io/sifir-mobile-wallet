import SifirAccountsListScreen from '../components/screens/wallet/SifirAccountsListScreen';
import SifirAccountScreen from '../components/screens/wallet/SifirAccountScreen';
import {fromRight} from 'react-navigation-transitions';
import {createStackNavigator} from 'react-navigation-stack';

const WalletStack = createStackNavigator(
  {
    AccountsList: {
      screen: SifirAccountsListScreen,
      navigationOptions: {
        header: null,
      },
    },
    Account: {
      screen: SifirAccountScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'AccountsList',
    transitionConfig: () => fromRight(700),
  },
);

export default WalletStack;
