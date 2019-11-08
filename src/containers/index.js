import React from 'react';
import {createAppContainer} from 'react-navigation';
import {View} from 'react-native';

import {AppStyle} from '@common/index';
import SifirHeader from '@elements/SifirHeader';
import WalletStack from './WalletStack';
import ChatStack from './ChatStack';
import ShopStack from './ShopStack';

const WalletTab = createAppContainer(WalletStack);
const ChatTab = createAppContainer(ChatStack);
const ShopTab = createAppContainer(ShopStack);

export default class Root extends React.Component {
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
        {currentTab === 1 && <ChatTab />}
        {currentTab === 2 && <ShopTab />}
      </View>
    );
  }
}
