import ShopMainScreen from '../components/screens/shop/ShopMainScreen';
import {createStackNavigator} from 'react-navigation-stack';

const ShopStack = createStackNavigator(
  {
    ShopMainScreen: {
      screen: ShopMainScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'ShopMainScreen',
  },
);

export default ShopStack;
