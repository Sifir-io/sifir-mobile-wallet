import ChatMainScreen from '../components/screens/chat/ChatMainScreen';
import {createStackNavigator} from 'react-navigation-stack';

const ChatStack = createStackNavigator(
  {
    ChatMainScreen: {
      screen: ChatMainScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'ChatMainScreen',
  },
);

export default ChatStack;
