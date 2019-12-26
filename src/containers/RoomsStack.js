import RoomsMainScreen from '../components/screens/rooms/RoomsMainScreen';
import RoomsDetailScreen from '../components/screens/rooms/RoomsDetailScreen';
import {createStackNavigator} from 'react-navigation-stack';

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
  },
);

export default RoomsStack;
