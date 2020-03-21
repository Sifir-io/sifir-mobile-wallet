import * as types from '@types/';
import {createReducer} from '@utils/';
import {FULFILLED, PENDING, REJECTED} from '@utils/constants';

const initialState = {
  loading: false,
  error: null,
  loaded: false,
  funds: [],
  peers: [],
  nodeInfo: [],
};

const lnWallet = createReducer(initialState)({
  [types.LN_WALLET_NODEINFO + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.LN_WALLET_NODEINFO + FULFILLED]: (state, {payload: {nodeInfo}}) => ({
    ...state,
    nodeInfo: [nodeInfo],
    loading: false,
    loaded: true,
    error: null,
  }),
  [types.LN_WALLET_NODEINFO + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
  [types.LN_WALLET_GET_FUNDS + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.LN_WALLET_GET_FUNDS + FULFILLED]: (state, {payload: {balance}}) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    balance,
  }),
  [types.LN_WALLET_GET_FUNDS + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
  [types.LN_WALLET_DETAILS + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.LN_WALLET_DETAILS + FULFILLED]: state => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
  }),
  [types.LN_WALLET_DETAILS + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),

  [types.LN_WALLET_DECODE_BOLT + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.LN_WALLET_DECODE_BOLT + FULFILLED]: state => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
  }),
  [types.LN_WALLET_DECODE_BOLT + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),

  [types.LN_WALLET_GET_ROUTE + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.LN_WALLET_GET_ROUTE + FULFILLED]: state => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
  }),
  [types.LN_WALLET_GET_ROUTE + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
  [types.LN_WALLET_PAY_BOLT + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.LN_WALLET_PAY_BOLT + FULFILLED]: (state, {payload: {txnDetails}}) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    txnDetails,
  }),
  [types.LN_WALLET_PAY_BOLT + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
  [types.LN_WALLET_GET_PEERS + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.LN_WALLET_GET_PEERS + FULFILLED]: (state, {payload: {peers}}) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    peers,
  }),
  [types.LN_WALLET_GET_PEERS + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
  [types.LN_WALLET_OPEN_FUND_PEER_CHANNEL + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.LN_WALLET_OPEN_FUND_PEER_CHANNEL + FULFILLED]: state => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
  }),
  [types.LN_WALLET_OPEN_FUND_PEER_CHANNEL + REJECTED]: (
    state,
    {payload: {error}},
  ) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
  [types.LN_WALLET_GET_NEW_ADDRESS + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.LN_WALLET_GET_NEW_ADDRESS + FULFILLED]: (
    state,
    {payload: {address}},
  ) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    address,
  }),
  [types.LN_WALLET_GET_NEW_ADDRESS + REJECTED]: (
    state,
    {payload: {address}},
  ) => ({
    ...state,
    address,
    loading: false,
    loaded: false,
  }),
  [types.LN_WALLET_WITHDRAW_FUNDS + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.LN_WALLET_WITHDRAW_FUNDS + FULFILLED]: (
    state,
    {payload: {btcSendResult}},
  ) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    btcSendResult,
  }),
  [types.LN_WALLET_WITHDRAW_FUNDS + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
});

export default lnWallet;
