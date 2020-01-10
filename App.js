import React, {Component} from 'react';
import {Provider} from 'react-redux';
import Root from '@containers/index';
import * as reducers from '@reducers';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';

const rootReducer = (state, action) => {
  return combineReducers(reducers)(state, action);
};

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
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
