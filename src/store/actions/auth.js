import * as types from '@types/index';
import {FULFILLED, PENDING, REJECTED, AUTH_INFO_NOT_FOUND,READY} from '@utils/constants';
import {PGP_GET_KEYS, PGP_UNLOCK_KEYS} from '@types/';
import {getClient, pairMatrixClient} from '@io/matrix/';
import {saveAuthInfo, getSavedAuthInfo, deleteAuthInfo, savePGPKeys} from '@io/auth';
import {encryptMessage, decryptMessage, makeNewPgpKey, initAndUnlockKeys} from '@io/pgp';
import {PGP_KEYS_NOT_FOUND} from "@utils/";

const initAndUnlockDeviceKeys = ({privKeyArmored, passphrase}) => async dispatch => {
    try {
        const unlocked = await initAndUnlockKeys({
            privKeyArmored,
            passphrase,
        });
        dispatch({
            type: types.PGP_UNLOCK_KEYS + FULFILLED,
            payload: {unlocked},
        });
    } catch (err) {
        dispatch({
            type: types.PGP_UNLOCK_KEYS + REJECTED,
            error: err,
        });
    }
}

const genAndSaveDevicePgpKeys = ({email, name, passphrase}) => async dispatch => {
    try {
        const keys = await loadDevicePgpKeys();
        if (keys.pubKeyArmored && keys.privKeyArmored)
            throw 'Keys already detected! , please remove keys before generating news ones'
        const {pubKeyArmored, privKeyArmored} = await makeNewPgpKey({
            passphrase,
            email,
            name,
        });
        dispatch({
            type: types.PGP_GET_KEYS + FULFILLED,
            payload: {pubKeyArmored, privKeyArmored},
        });
        await saveDevicePgpKeys({pubKeyArmored, privKeyArmored});
        return {pubKeyArmored, privKeyArmored}
    } catch (err) {
        dispatch({
            type: types.PGP_GET_KEYS + REJECTED,
            warning: err,
        });
    }
}
const loadDevicePgpKeys = () => async dispatch => {
    const {pubKeyArmored, privKeyArmored} = await loadPGPKeys();

    if (pubKeyArmored && privKeyArmored) {
        dispatch({
            type: types.GET_PGP_KEYS + FULFILLED,
            payload: {pubKeyArmored, privKeyArmored},
        });
    } else {
        dispatch({
            type: types.GET_PGP_KEYS + REJECTED,
            warning: PGP_KEYS_NOT_FOUND,
        });
    }
}

const saveDevicePgpKeys = ({pubKeyArmored, privKeyArmored}) => async dispatch => {
    await savePGPKeys({pubKeyArmored, privKeyArmored});
    dispatch({
        type: types.GET_PGP_KEYS + FULFILLED,
        payload: {pubKeyArmored, privKeyArmored},
    });
}

const loadEncryptedAuthInfo = () => async dispatch => {
    const info = await getSavedAuthInfo();
    if (info) {
        dispatch({
            type: types.GET_AUTH_STATUS + FULFILLED,
            payload: {authInfo},
        });
    } else {
        dispatch({
            type: types.GET_AUTH_STATUS + REJECTED,
            warning: AUTH_INFO_NOT_FOUND,
        });
    }
};

const setAuthInfoState = (payload) => async dispatch => {
    dispatch({
        type: types.GET_AUTH_STATUS + READY,
        payload,
    });
};

const pairPhoneWithToken = ({token, key}) => async dispatch => {
    dispatch({type: types.REQUEST_PAIR + PENDING});
    const {eventType} = token;
    try {
        switch (eventType) {
            case 'matrix':
                const client = await getClient(token);
                await pairMatrixClient(client, {token, key});
                await saveAuthInfo({token, key, paired: true});
                dispatch({
                    type: types.REQUEST_PAIR + FULFILLED,
                    payload: {token, key},
                });
                dispatch({
                    type: types.GET_AUTH_STATUS + FULFILLED,
                    payload: {token, key},
                });
                break;
            case 'tor':
                const {onionUrl, nodeDeviceId, pubKey} = token;

                break;
            default:
                throw `${eventType} is not valid pairing type`;
        }
    } catch (error) {
        dispatch({
            type: types.REQUEST_PAIR + REJECTED,
            error,
        });
    } finally {
        // some clean up
    }
};
const clearAuthInfo = () => async dispatch => {
    await deleteAuthInfo();
    dispatch({
        type: types.DELETE_AUTH_STATUS + FULFILLED,
    });
};


export {
    loadEncryptedAuthInfo,
    setAuthInfoState,

    loadDevicePgpKeys,
    clearAuthInfo,
    pairPhoneWithToken,
    genAndSaveDevicePgpKeys,
    initAndUnlockDeviceKeys
}
