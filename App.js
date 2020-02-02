import React, {Component} from 'react';
import {Provider} from 'react-redux';
import Root from '@containers/index';
import * as reducers from '@reducers';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import Reactotron from './reactotron';
const rootReducer = (state, action) => {
  return combineReducers(reducers)(state, action);
};

let store;
if (__DEV__) {
  store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunkMiddleware),
      Reactotron.createEnhancer(),
    ),
  );
} else {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
}
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
