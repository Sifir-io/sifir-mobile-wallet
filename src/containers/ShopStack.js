import React from 'react';
import ShopMainScreen from '../components/screens/shop/ShopMainScreen';
import {createStackNavigator} from 'react-navigation-stack';

const ShopStack = createStackNavigator(
  {
    ShopMain: {
      screen: ShopMainScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'ShopMain',
  },
);

export default class ShopTab extends React.Component {
  static router = ShopStack.router;

  render() {
    return <ShopStack navigation={this.props.navigation} />;
  }
}
