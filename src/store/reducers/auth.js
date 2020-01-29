import * as types from '@types/index';
import {PGP_GET_KEYS, PGP_UNLOCK_KEYS} from '@types/';
import {createReducer, FULFILLED, PENDING, REJECTED,READY} from '@utils/constants';

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
    key:null,
    encAuthInfo: null,
    pubKeyArmored: null,
    privKeyArmored: null,
};

const auth = createReducer(initialState)({
    [types.PGP_UNLOCK_KEYS + FULFILLED]: (state, {payload: {unlocked}}) => ({
        ...state,
        unlocked,
        keyError: null,
        keyWarning: null
    }),
    [types.PGP_UNLOCK_KEYS + REJECTED]: (state, {warning = null, error = null}) => ({
        ...state,
        unlocked:false,
        keyWarning: warning,
        keyError: error,
    }),
    [types.PGP_GET_KEYS + FULFILLED]: (state, {payload: {pubKeyArmored, privKeyArmored}}) => ({
        ...state,
        pubKeyArmored,
        privKeyArmored,
    }),
    [types.PGP_GET_KEYS + REJECTED]: (state, {warning = null, error = null}) => ({
        ...state,
        keyWarning: warning,
        error,
        pubKeyArmored: null,
        privKeyArmored: null,

    }),
    [types.GET_AUTH_STATUS + REJECTED]: (state, {warning = null, error = null}) => ({
        ...state,
        authWarning: warning,
        error,
        token: null,
        pairingKey: null,
    }),
    // Encrypted authinfo loaded
    [types.GET_AUTH_STATUS + FULFILLED]: (state, {payload: {authInfo}}) => ({
        ...state,
        encAuthInfo:authInfo,
    }),
    [types.GET_AUTH_STATUS + READY]: (state, {payload: {token,key}}) => ({
        ...state,
        token,
        key,
        encAuthInfo:authInfo,
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
