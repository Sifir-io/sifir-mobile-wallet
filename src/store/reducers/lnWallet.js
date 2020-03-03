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
  [types.LN_WALLET_GET_FUNDS + FULFILLED]: (state, {payload: {funds}}) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    funds,
  }),
  [types.LN_WALLET_GET_FUNDS + REJECTED]: (state, {payload: {error}}) => ({
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
  [types.LN_WALLET_DECODE_BOLT + FULFILLED]: (
    state,
    {payload: {decodedBolt}},
  ) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    decodedBolt,
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
  [types.LN_WALLET_GET_ROUTE + FULFILLED]: (state, {payload: {route}}) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    route,
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
  [types.LN_WALLET_PAY_BOLT + FULFILLED]: (state, {payload: {payBolt}}) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    payBolt,
  }),
  [types.LN_WALLET_PAY_BOLT + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
});

export default lnWallet;
