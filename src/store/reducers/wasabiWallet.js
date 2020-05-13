import * as types from '@types/';
import {createReducer} from '@utils/';
import {FULFILLED, PENDING, REJECTED} from '@utils/constants';

const initialState = {
  loading: false,
  error: null,
  loaded: false,
};

const wasabiWallet = createReducer(initialState)({
  [types.WASABI_WALLET_GET_UNSPENTCOINS + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.WASABI_WALLET_GET_UNSPENTCOINS + FULFILLED]: (
    state,
    {payload: {unspentCoinsList}},
  ) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    unspentCoinsList,
  }),
  [types.WASABI_WALLET_GET_UNSPENTCOINS + REJECTED]: (
    state,
    {payload: {error}},
  ) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
});

export default wasabiWallet;
