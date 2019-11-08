import React, {Component} from 'react';
import {Provider} from 'react-redux';
import Root from '@containers/index';
import store from '@store';

export default class SifirApp extends Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}
