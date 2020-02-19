// import {fromRight} from 'react-navigation-transitions';
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
      initialRouteName="AccountList"
      headerMode="none"
      screenOptions={{
        gestureEnabled: false,
      }}
      // @TODO migrate to nav v5 api
      //screenOptions={{
      //  transitionConfig: () => fromRight(700),
      //}}
    >
      <WalletStack.Screen
        name="AccountList"
        component={SifirAccountsListScreen}
      />
      <WalletStack.Screen name="Account" component={SifirAccountScreen} />
      <WalletStack.Screen name="GetAddress" component={SifirGetAddrScreen} />
      <WalletStack.Screen
        name="BtcSendTxnInputAmount"
        component={SifirBtcSendTxnInputAmountScreen}
      />
      <WalletStack.Screen
        name="BtcSendTxnConfirm"
        component={SifirBtcSendTxnConfirmScreen}
      />
      <WalletStack.Screen
        name="BtcReceiveTxn"
        component={SifirBtcReceiveTxnScreen}
      />
      <WalletStack.Screen
        name="BtcTxnConfirmed"
        component={SifirBtcTxnConfirmedScreen}
      />
      <WalletStack.Screen name="AddWallet" component={SifirAddWalletScreen} />
    </WalletStack.Navigator>
  );
}
