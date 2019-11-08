import * as types from './types';
import {createReducer, FULFILLED, PENDING, REJECTED} from '@utils/index';

const initialState = {
  loading: false,
  error: null,
  loaded: false,
  data: [],
};

const wallet = createReducer(initialState)({
  [types.WALLET_DATA_SHOW + PENDING]: state => ({
    ...state,
    loading: true,
  }),
  [types.WALLET_DATA_SHOW + FULFILLED]: (state, action) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    data: action.payload,
  }),
  [types.WALLET_DATA_SHOW + REJECTED]: state => ({
    ...state,
    error: true,
  }),
});

export default wallet;
