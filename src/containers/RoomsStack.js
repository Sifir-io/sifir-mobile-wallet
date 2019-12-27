import {fromRight} from 'react-navigation-transitions';
import {createStackNavigator} from 'react-navigation-stack';

import {RoomsMainScreen, RoomsDetailScreen} from '@screens/rooms/index';

const RoomsStack = createStackNavigator(
  {
    RoomsMain: {
      screen: RoomsMainScreen,
      navigationOptions: {
        header: null,
      },
    },
    RoomsDetail: {
      screen: RoomsDetailScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'RoomsMain',
    transitionConfig: () => fromRight(700),
  },
);

export default RoomsStack;
