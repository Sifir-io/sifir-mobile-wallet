import {
  GET_AUTH_STATUS,
  REQUEST_PAIR,
  PGP_GET_KEYS,
  PGP_UNLOCK_KEYS,
} from '@types/';
import {createReducer} from '@utils/';
import {RESTART, FULFILLED, PENDING, REJECTED, READY} from '@utils/constants';

const initialState = {
  loading: false,
  loaded: false,
  pairing: false,
  paired: false,
  error: '',
  unlocked: false,
  // ---
  token: null,
  key: null,
  // encAuthInfo: null,
  // pubkey,privkey,fingerprint,keyhexid
  devicePgpKey: {},
  nodePubkey: '',
};

const auth = createReducer(initialState)({
  [PGP_UNLOCK_KEYS + FULFILLED]: (state, {payload}) => ({
    ...state,
    unlocked: true,
  }),
  [PGP_UNLOCK_KEYS + REJECTED]: (state, {error = null}) => ({
    ...state,
    unlocked: false,
    error,
  }),
  [PGP_GET_KEYS + FULFILLED]: (state, {payload}) => ({
    ...state,
    devicePgpKey: payload,
  }),
  [PGP_GET_KEYS + REJECTED]: (state, {error = null}) => ({
    ...state,
    error,
    devicePgpKey: {},
  }),
  // Encrypted authinfo loaded
  [GET_AUTH_STATUS + FULFILLED]: (state, {payload: {authInfo}}) => ({
    ...state,
    // encAuthInfo: authInfo,
  }),
  // this is the only call that should modify the auth state, the rest act as status updaters
  [GET_AUTH_STATUS + READY]: (state, {payload: {token, key, nodePubkey}}) => ({
    ...state,
    token,
    nodePubkey,
    key,
  }),
  [GET_AUTH_STATUS + REJECTED]: (state, {error = null}) => ({
    ...state,
    error,
    token: null,
    pairingKey: null,
  }),
  [REQUEST_PAIR + RESTART]: state => ({
    ...state,
    paired: false,
    pairing: false,
    error: '',
  }),
  [REQUEST_PAIR + PENDING]: state => ({
    ...state,
    paired: false,
    pairing: true,
  }),
  [REQUEST_PAIR + FULFILLED]: (state, {payload: {nodePubkey}}) => ({
    ...state,
    paired: true,
    pairing: false,
  }),
  [REQUEST_PAIR + REJECTED]: (state, {error}) => ({
    ...state,
    paired: false,
    pairing: false,
    error,
  }),
});

export default auth;
