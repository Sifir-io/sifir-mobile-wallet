import RoomsMainScreen from '../components/screens/rooms/RoomsMainScreen';
import {createStackNavigator} from 'react-navigation-stack';

const RoomsStack = createStackNavigator(
  {
    RoomsMainScreen: {
      screen: RoomsMainScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'RoomsMainScreen',
  },
);

export default RoomsStack;
