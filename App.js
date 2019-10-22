import React, {Component} from 'react';
import Root from './src/containers/index';
import {Provider} from 'react-redux';
import initStore from './src/store/index';

const store = initStore();

export default class SifirApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}
