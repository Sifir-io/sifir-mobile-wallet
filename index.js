/**
 * @format
 */

import './shim';
// import 'node-libs-react-native/globals';
import {AppRegistry} from 'react-native';
//if (__DEV__) {
//  import('./reactotron').then(() => console.log('Reactotron Configured'));
//}
import App from './App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);
