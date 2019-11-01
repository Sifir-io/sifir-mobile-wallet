// import types from '../actions/types';
import {Images} from '@common';

const defaultState = {
  data: [
    [Images.icon_add, Images.icon_add_clicked, 'ADD', 'WALLET', 'Account'],
    [
      Images.icon_light,
      Images.icon_light_clicked,
      'GHASSANS',
      'WALLET',
      'Account',
    ],
    [
      Images.icon_light,
      Images.icon_light_clicked,
      'COFFEE',
      'FUND #1',
      'Account',
    ],
    [
      Images.icon_light,
      Images.icon_light_clicked,
      'ONLINE',
      'SHOPPING',
      'Account',
    ],
  ],
};

export default accounts = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
