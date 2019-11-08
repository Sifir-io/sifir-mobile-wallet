import * as types from './types';
import {createReducer, FULFILLED, PENDING, REJECTED} from '@utils/index';

const initialState = {
  loading: false,
  error: null,
  loaded: false,
  data: [],
};

const walletList = createReducer(initialState)({
  [types.WALLETLIST_DATA_UPDATE + PENDING]: state => ({
    ...state,
    loading: true,
  }),
  [types.WALLETLIST_DATA_UPDATE + FULFILLED]: (state, action) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    data: action.payload,
  }),
  [types.WALLETLIST_DATA_UPDATE + REJECTED]: state => ({
    ...state,
    error: true,
  }),
});

export default walletList;
