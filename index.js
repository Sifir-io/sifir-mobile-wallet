/**
 * @format
 */
// TODO HAMZA revert back npm start to "./node_modules/react-native/cli.js run-android"
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);
