import * as types from '@types/index';
import {createReducer, FULFILLED, PENDING, REJECTED} from '@utils/index';
const initialState = {
  loading: false,
  loaded: false,
  pairing: false,
  paired: false,
  token: null,
  key: null,
  error: '',
};

const auth = createReducer(initialState)({
  [types.DELETE_AUTH_STATUS + FULFILLED]: state => ({
    ...state,
    token: null,
    key: null,
    loading: false,
    loaded: false,
  }),
  [types.GET_AUTH_STATUS + REJECTED]: state => ({
    ...state,
    loading: false,
    loaded: false,
    token: null,
    key: null,
  }),
  [types.GET_AUTH_STATUS + FULFILLED]: (state, {payload: {token, key}}) => ({
    ...state,
    loading: false,
    loaded: true,
    paired: true,
    token,
    key,
  }),
  [types.REQUEST_PAIR + PENDING]: state => ({
    ...state,
    paired: false,
    pairing: true,
  }),
  [types.REQUEST_PAIR + FULFILLED]: (state, {payload: {token, key}}) => ({
    ...state,
    paired: true,
    pairing: false,
  }),
  [types.REQUEST_PAIR + REJECTED]: (state, {error}) => ({
    ...state,
    paired: false,
    pairing: false,
    error,
  }),
});

export default auth;
