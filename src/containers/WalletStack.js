import {fromRight} from 'react-navigation-transitions';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import {
  SifirGetAddrScreen,
  SifirBtcSendTxnInputAmountScreen,
  SifirBtcSendTxnConfirmScreen,
  SifirAccountsListScreen,
  SifirAccountScreen,
  SifirBtcReceiveTxnScreen,
  SifirBtcTxnConfirmedScreen,
  SifirAddWalletScreen,
} from '@screens/wallet/index';

const WalletStack = createStackNavigator();
export default function WalletTab() {
  return (
    <WalletStack.Navigator
      initialRouteName="SifirAccountsListScreen"
      headerMode="none"
      screenOptions={{
        transitionConfig: () => fromRight(700),
      }}>
      <WalletStack.Screen
        name="SifirAccountsListScreen"
        component={SifirAccountsListScreen}
        //options={{headerShown: false}}
      />
      <WalletStack.Screen
        name="SifirAccountScreen"
        component={SifirAccountScreen}
        //options={{headerShown: false}}
      />
      <WalletStack.Screen
        name="SifirGetAddrScreen"
        component={SifirGetAddrScreen}
        //options={{headerShown: false}}
      />
      <WalletStack.Screen
        name="SifirBtcSendTxnInputAmountScreen"
        component={SifirBtcSendTxnInputAmountScreen}
        //options={{headerShown: false}}
      />
      <WalletStack.Screen
        name="SifirBtcSendTxnConfirmScreen"
        component={SifirBtcSendTxnConfirmScreen}
        //options={{headerShown: false}}
      />
      <WalletStack.Screen
        name="SifirBtcReceiveTxnScreen"
        component={SifirBtcReceiveTxnScreen}
        //options={{headerShown: false}}
      />
      <WalletStack.Screen
        name="SifirBtcTxnConfirmedScreen"
        component={SifirBtcTxnConfirmedScreen}
        //options={{headerShown: false}}
      />
      <WalletStack.Screen
        name="SifirAddWalletScreen"
        component={SifirAddWalletScreen}
        //options={{headerShown: false}}
      />
    </WalletStack.Navigator>
  );
}

//const WalletStack = createStackNavigator(
//  {
//    AccountsList: {
//      screen: SifirAccountsListScreen,
//      navigationOptions: {
//        headerShown: false,
//      },
//    },
//    Account: {
//      screen: SifirAccountScreen,
//      navigationOptions: {
//        headerShown: false,
//      },
//    },
//    GetAddress: {
//      screen: SifirGetAddrScreen,
//      navigationOptions: {
//        headerShown: false,
//      },
//    },
//    BtcSendTxnInputAmount: {
//      screen: SifirBtcSendTxnInputAmountScreen,
//      navigationOptions: {
//        headerShown: false,
//      },
//    },
//    BtcSendTxnConfirm: {
//      screen: SifirBtcSendTxnConfirmScreen,
//      navigationOptions: {
//        headerShown: false,
//      },
//    },
//    BtcReceiveTxn: {
//      screen: SifirBtcReceiveTxnScreen,
//      navigationOptions: {
//        headerShown: false,
//      },
//    },
//    BtcTxnConfirmed: {
//      screen: SifirBtcTxnConfirmedScreen,
//      navigationOptions: {
//        headerShown: false,
//      },
//    },
//    AddWallet: {
//      screen: SifirAddWalletScreen,
//      navigationOptions: {
//        headerShown: false,
//      },
//    },
//  },
//  {
//    initialRouteName: 'AccountsList',
//    transitionConfig: () => fromRight(700),
//  },
//);
//
//export default class WalletTab extends React.Component {
//  static router = WalletStack.router;
//
//  render() {
//    return <WalletStack navigation={this.props.navigation} />;
//  }
//}
