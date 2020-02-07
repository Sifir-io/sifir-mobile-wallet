import 'react-native-gesture-handler';
import React, {Component} from 'react';
import Root from '@containers/index';
import {Provider} from 'react-redux';
import * as reducers from '@reducers';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
const rootReducer = (state, action) => {
  return combineReducers(reducers)(state, action);
};

let store;
store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
console.disableYellowBox = true;
export default class SifirApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}
