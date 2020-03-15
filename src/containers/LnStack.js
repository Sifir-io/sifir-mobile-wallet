import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  SifirLNChannelFundingScreen,
  SifirLNNodeSelectScreen,
  SifirLNInvoiceConfirmScreen,
  SifirLNChannelConfirmedScreen,
} from '@screens/ln/';
import {SifirBtcTxnConfirmedScreen, SifirGetAddrScreen} from '@screens/wallet/';
import {C} from '@common/index';

const LNPayInvoiceStack = createStackNavigator();
const LNChannelStack = createStackNavigator();

const LNPayInvoiceRoute = () => {
  return (
    <LNPayInvoiceStack.Navigator
      initialRouteName="LnScanBolt"
      headerMode="none"
      screenOptions={{
        gestureEnabled: false,
      }}>
      <LNPayInvoiceStack.Screen
        name="LnScanBolt"
        component={SifirGetAddrScreen}
        initialParams={{walletInfo: {type: C.STR_LN_WALLET_TYPE}}}
      />
      <LNPayInvoiceStack.Screen
        name="LnInvoiceConfirm"
        component={SifirLNInvoiceConfirmScreen}
      />
      <LNPayInvoiceStack.Screen
        name="LnInvoicePaymentConfirmed"
        component={SifirBtcTxnConfirmedScreen}
        initialParams={{type: C.STR_LN_WALLET_TYPE}}
      />
    </LNPayInvoiceStack.Navigator>
  );
};
const LNChannelRoute = () => {
  return (
    <LNChannelStack.Navigator
      initialRouteName="LnNodeSelect"
      headerMode="none"
      screenOptions={{
        gestureEnabled: false,
      }}>
      <LNChannelStack.Screen
        name="LnNodeSelect"
        component={SifirLNNodeSelectScreen}
        initialParams={{type: 'bolt'}}
      />
      <LNChannelStack.Screen
        name="LnChannelFunding"
        component={SifirLNChannelFundingScreen}
      />
      <LNChannelStack.Screen
        name="LnChannelConfirmed"
        component={SifirLNChannelConfirmedScreen}
      />
    </LNChannelStack.Navigator>
  );
};

export {LNPayInvoiceRoute, LNChannelRoute};
