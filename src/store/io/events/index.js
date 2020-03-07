/**
This  is the events class we use for logging + tracking important events
*/
import {NativeModules} from 'react-native';
const {Rudder} = NativeModules;

const event = (name, payload = '') => {
  if (__DEV__) {
    console.log('event:', name, payload);
  }
  Rudder.event(name, JSON.stringify({env: __DEV__ ? 'dev' : 'prod', payload}));
};
const log = (name, ...payload) => {
  if (__DEV__) {
    console.log('log:', name, ...payload);
  }
};
const error = (name, ...payload) => {
  if (__DEV__) {
    console.error('ERROR:', name, ...payload);
  }
};
export {event, log, error};
