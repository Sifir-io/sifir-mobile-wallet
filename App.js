import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as reducers from '@reducers';
import Root from '@containers/index';
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
