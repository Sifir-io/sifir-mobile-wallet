import * as types from '@types/';
import {createReducer} from '@utils/';
import {FULFILLED, PENDING, REJECTED} from '@utils/constants';

const initialState = {
  loading: false,
  error: null,
  loaded: false,
  btcClientReady: false,
  btcWalletList: [],
  btcWalletDetails: {txnData: null, balance: 0, btcUnit: 'BTC'},
  address: null,
  btcSendResult: null,
  feeSettingEnabled: false,
};

const btcWallet = createReducer(initialState)({
  // Client Status
  //  btcClientReady: false,
  //}),
  //[types.BTC_CLIENT_STATUS + FULFILLED]: state => ({
  //  ...state,
  //  btcClientReady: true,
  //}),

  // Wallet List Data
  [types.BTC_WALLET_LIST_DATA_SHOW + PENDING]: state => ({
    ...state,
    loading: true,
    loaded: false,
  }),
  [types.BTC_WALLET_LIST_DATA_SHOW + FULFILLED]: (
    state,
    {payload: {btcWalletList}},
  ) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    btcWalletList,
  }),
  [types.BTC_WALLET_LIST_DATA_SHOW + REJECTED]: (
    state,
    {payload: {error}},
  ) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),

  // Get Wallet Details
  [types.BTC_WALLET_DETAILS + PENDING]: state => ({
    ...state,
    loading: true,
    loaded: false,
  }),
  [types.BTC_WALLET_DETAILS + FULFILLED]: (
    state,
    {payload: {btcWalletDetails}},
  ) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    btcWalletDetails,
  }),
  [types.BTC_WALLET_DETAILS + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),

  // Get Wallet Address
  [types.BTC_WALLET_ADDRESS + PENDING]: state => ({
    ...state,
    loading: true,
    loaded: false,
  }),
  [types.BTC_WALLET_ADDRESS + FULFILLED]: (state, {payload: {address}}) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    address,
  }),
  [types.BTC_WALLET_ADDRESS + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),

  // Send Bitcoin
  [types.SEND_BITCOIN + PENDING]: state => ({
    ...state,
    loading: true,
    loaded: false,
  }),
  [types.SEND_BITCOIN + FULFILLED]: (state, {payload: {btcSendResult}}) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    btcSendResult,
  }),
  [types.SEND_BITCOIN + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
});

export default btcWallet;
