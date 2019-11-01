import {fromRight} from 'react-navigation-transitions';
import {createStackNavigator} from 'react-navigation-stack';

import {
  SifirGetAddrScreen,
  SifirBtcSendTxnInputAmountScreen,
  SifirBtcTxnConfirmScreen,
  SifirBtcSendTxnConfirmedScreen,
  SifirAccountsListScreen,
  SifirAccountScreen,
} from '@screens/wallet';

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
    GetAddress: {
      screen: SifirGetAddrScreen,
      navigationOptions: {
        header: null,
      },
    },
    BtcSendTxnInputAmount: {
      screen: SifirBtcSendTxnInputAmountScreen,
      navigationOptions: {
        header: null,
      },
    },
    BtcTxnConfirm: {
      screen: SifirBtcTxnConfirmScreen,
      navigationOptions: {
        header: null,
      },
    },
    BtcSendTxnConfirmed: {
      screen: SifirBtcSendTxnConfirmedScreen,
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
