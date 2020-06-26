import * as types from '@types/';
import {createReducer} from '@utils/';
import {FULFILLED, PENDING, REJECTED} from '@utils/constants';

const initialState = {
  loading: false,
  error: null,
  loaded: false,
  cfgProps: [],
};

const cyphernode = createReducer(initialState)({
  [types.CN_CLIENT_GET_CFG_PROPS + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.CN_CLIENT_GET_CFG_PROPS + FULFILLED]: (
    state,
    {payload: {cfgProps}},
  ) => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
    cfgProps,
  }),
  [types.CN_CLIENT_GET_CFG_PROPS + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
  [types.CN_CLIENT_SET_CFG_PROPS + PENDING]: state => ({
    ...state,
    error: null,
    loading: true,
    loaded: false,
  }),
  [types.CN_CLIENT_SET_CFG_PROPS + FULFILLED]: state => ({
    ...state,
    loading: false,
    loaded: true,
    error: null,
  }),
  [types.CN_CLIENT_SET_CFG_PROPS + REJECTED]: (state, {payload: {error}}) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  }),
});

export default cyphernode;
