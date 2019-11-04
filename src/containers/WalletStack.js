import {fromRight} from 'react-navigation-transitions';
import {createStackNavigator} from 'react-navigation-stack';

import {
  SifirGetAddrScreen,
  SifirBtcSendTxnInputAmountScreen,
  SifirBtcSendTxnConfirmScreen,
  SifirAccountsListScreen,
  SifirAccountScreen,
  SifirBtcReceiveTxnScreen,
  SifirBtcTxnConfirmedScreen,
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
    BtcSendTxnConfirm: {
      screen: SifirBtcSendTxnConfirmScreen,
      navigationOptions: {
        header: null,
      },
    },
    BtcReceiveTxn: {
      screen: SifirBtcReceiveTxnScreen,
      navigationOptions: {
        header: null,
      },
    },
    BtcTxnConfirmed: {
      screen: SifirBtcTxnConfirmedScreen,
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
