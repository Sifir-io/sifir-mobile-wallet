// import {NativeModules} from 'react-native';
//const {PgpBridge} = NativeModules;

const event = (name, payload) => {
  if (__DEV__) {
    console.log('event:', name, payload);
  }
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
