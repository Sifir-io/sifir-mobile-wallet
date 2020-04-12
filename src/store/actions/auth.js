import {
  FULFILLED,
  PENDING,
  REJECTED,
  AUTH_INFO_NOT_FOUND,
  PGP_KEYS_NOT_FOUND,
  DELETE,
  READY,
} from '@utils/constants';
import {
  PGP_GET_KEYS,
  PGP_UNLOCK_KEYS,
  REQUEST_PAIR,
  AUTH_INFO_STATUS,
  GET_AUTH_STATUS,
} from '@types/';
import {pairDeviceWithNodeUsingToken} from '@io/transports/';
import {
  saveAuthInfo,
  getSavedAuthInfo,
  deleteAuthInfo,
  savePGPKeys,
  loadPGPKeys,
  deletePgpKeys,
} from '@io/auth';
import {encryptMessage, makeNewPgpKey, initAndUnlockKeys} from '@io/pgp';
import {log, error} from '@io/events/';

const initAndUnlockDeviceKeys = ({
  privkeyArmored,
  passphrase,
}) => async dispatch => {
  try {
    const keyDetails = await initAndUnlockKeys({
      privatekeyArmored: privkeyArmored,
      passphrase,
    });
    if (!keyDetails) {
      throw 'Error unlocking key';
    }
    dispatch({
      type: PGP_UNLOCK_KEYS + FULFILLED,
      payload: keyDetails,
    });
    return keyDetails;
  } catch (err) {
    log('error unlocking keys', err);
    dispatch({
      type: PGP_UNLOCK_KEYS + REJECTED,
      error: err,
    });
    return false;
  }
};

const genAndSaveDevicePgpKeys = ({
  user,
  email,
  passphrase,
}) => async dispatch => {
  try {
    const keys = await dispatch(loadDevicePgpKeys());
    if (keys) {
      throw 'Keys already detected! , please remove keys before generating news ones';
    }
    const key = await makeNewPgpKey({
      passphrase,
      user,
      email,
    });
    dispatch({
      type: PGP_GET_KEYS + FULFILLED,
      payload: key,
    });
    await dispatch(saveDevicePgpKeys(key));
    return key;
  } catch (err) {
    dispatch({
      type: PGP_GET_KEYS + REJECTED,
      warning: err,
    });
    return false;
  }
};
const deleteDevicePgpKeys = () => async dispatch => {
  await deletePgpKeys();
};
const loadDevicePgpKeys = () => async dispatch => {
  const payload = await loadPGPKeys();
  if (payload) {
    // FIXME should PGP private keys be saved in state ? or just public + finger print
    // and just return private keyu to be use in init during unlockorgenkey
    dispatch({
      type: PGP_GET_KEYS + FULFILLED,
      payload,
    });
    return payload;
  } else {
    dispatch({
      type: PGP_GET_KEYS + REJECTED,
      warning: PGP_KEYS_NOT_FOUND,
    });
  }
};

const saveDevicePgpKeys = key => async dispatch => {
  await savePGPKeys(key);
  dispatch({
    type: PGP_GET_KEYS + FULFILLED,
    payload: key,
  });
};

const loadEncryptedAuthInfo = () => async dispatch => {
  const authInfo = await getSavedAuthInfo();
  if (authInfo) {
    dispatch({
      type: GET_AUTH_STATUS + FULFILLED,
      payload: authInfo,
    });
    return authInfo;
  } else {
    dispatch({
      type: GET_AUTH_STATUS + REJECTED,
      warning: AUTH_INFO_NOT_FOUND,
    });
    return false;
  }
};
const storeEncryptedAuthInfo = payload => async (dispatch, getState) => {
  const {
    auth: {devicePgpKey},
  } = getState();
  if (!devicePgpKey || !devicePgpKey.pubkeyArmored) {
    throw 'Cannot save auth info without keys being loaded or init';
  }
  const {encryptedMsg} = await encryptMessage({
    msg: JSON.stringify(payload),
    pubKey: devicePgpKey.pubkeyArmored,
  });
  await saveAuthInfo(encryptedMsg);
};

const setAuthInfoState = payload => async dispatch => {
  dispatch({
    type: GET_AUTH_STATUS + READY,
    payload,
  });
};
const pairPhoneWithToken = ({token = null, key = null} = {}) => async (
  dispatch,
  getState,
) => {
  const {
    auth: {devicePgpKey},
  } = getState();
  try {
    // make sure token + keys have been loaded
    if (!token || !devicePgpKey) {
      throw 'Cannot pair phone wihtout setting state first';
    }
    dispatch({type: REQUEST_PAIR + PENDING});
    const pairResult = await pairDeviceWithNodeUsingToken({
      token,
      key,
      devicePgpKey,
    });
    if (!pairResult) {
      throw 'Failed to pair';
    }
    const {isValid, nodePubkey} = pairResult;
    if (isValid === true) {
      dispatch({
        type: REQUEST_PAIR + FULFILLED,
        payload: {nodePubkey},
      });
    } else {
      throw 'Non valid reponse got from node';
    }
    return {isValid, nodePubkey};
  } catch (err) {
    error('error pairing', err);
    dispatch({
      type: REQUEST_PAIR + REJECTED,
      error: err,
    });
    return false;
  }
};
const clearAuthInfo = () => async dispatch => {
  await deleteAuthInfo();
  dispatch({
    type: AUTH_INFO_STATUS + DELETE,
    payload: {},
  });
};

export {
  loadEncryptedAuthInfo,
  storeEncryptedAuthInfo,
  setAuthInfoState,
  loadDevicePgpKeys,
  clearAuthInfo,
  pairPhoneWithToken,
  genAndSaveDevicePgpKeys,
  deleteDevicePgpKeys,
  initAndUnlockDeviceKeys,
};
