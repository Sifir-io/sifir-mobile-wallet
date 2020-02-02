import {
  GET_AUTH_STATUS,
  REQUEST_PAIR,
  PGP_GET_KEYS,
  PGP_UNLOCK_KEYS,
} from '@types/';
import {createReducer} from '@utils/';
import {FULFILLED, PENDING, REJECTED, READY} from '@utils/constants';

const initialState = {
  loading: false,
  loaded: false,
  pairing: false,
  paired: false,
  keyWarning: '',
  keyError: '',
  authWarning: '',
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
    keyError: null,
    keyWarning: null,
  }),
  [PGP_UNLOCK_KEYS + REJECTED]: (state, {warning = null, error = null}) => ({
    ...state,
    unlocked: false,
    keyWarning: warning,
    keyError: error,
  }),
  [PGP_GET_KEYS + FULFILLED]: (state, {payload}) => ({
    ...state,
    devicePgpKey: payload,
  }),
  [PGP_GET_KEYS + REJECTED]: (state, {warning = null, error = null}) => ({
    ...state,
    keyWarning: warning,
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
  [GET_AUTH_STATUS + REJECTED]: (state, {warning = null, error = null}) => ({
    ...state,
    authWarning: warning,
    error,
    // encAuthInfo: null,
    token: null,
    pairingKey: null,
  }),
  [REQUEST_PAIR + PENDING]: state => ({
    ...state,
    paired: false,
    pairing: true,
  }),
  [REQUEST_PAIR + FULFILLED]: (state, {payload: {nodePubkey}}) => ({
    ...state,
    paired: true,
    // nodePubkey,
    pairing: false,
  }),
  [REQUEST_PAIR + REJECTED]: (state, {error}) => ({
    ...state,
    paired: false,
    pairing: false,
    // nodePubkey: '',
    error,
  }),
});

export default auth;
