import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {View} from 'react-native';
import SifirHeader from '@elements/SifirHeader';
import {AppLandingScreen, PairWithTokenScreen} from '@screens/auth/index';
import WalletStack from './WalletStack';
import RoomsStack from './RoomsStack';
import SettingsStack from './SettingsStack';
import {AppStyle} from '@common/index';

const WalletTab = createAppContainer(WalletStack);
const RoomsTab = createAppContainer(RoomsStack);
const SettingsTab = createAppContainer(SettingsStack);

class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 0,
    };
  }

  switchPage = page => {
    this.setState({currentTab: page});
  };

  render() {
    const {currentTab} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: AppStyle.backgroundColor}}>
        <SifirHeader switchPage={this.switchPage} />
        {currentTab === 0 && <WalletTab />}
        {currentTab === 1 && <RoomsTab />}
        {currentTab === 2 && <SettingsTab />}
      </View>
    );
  }
}

export default createAppContainer(
  createSwitchNavigator(
    {
      AppLandingScreen,
      Pair: PairWithTokenScreen,
      App: Root,
    },
    {
      initialRouteName: 'AppLandingScreen',
    },
  ),
);
