import {
  FULFILLED,
  PENDING,
  REJECTED,
  AUTH_INFO_NOT_FOUND,
  PGP_KEYS_NOT_FOUND,
  READY,
} from '@utils/constants';
import {
  DELETE_AUTH_STATUS,
  PGP_GET_KEYS,
  PGP_UNLOCK_KEYS,
  REQUEST_PAIR,
  GET_AUTH_STATUS,
} from '@types/';
import {getClient, pairMatrixClient} from '@io/matrix/';
import {rnTorTransport} from '@io/tor/sifirRnTorTransport';
import {
  saveAuthInfo,
  getSavedAuthInfo,
  deleteAuthInfo,
  savePGPKeys,
  loadPGPKeys,
  deletePgpKeys,
} from '@io/auth';
import {
  encryptMessage,
  makeNewPgpKey,
  initAndUnlockKeys,
  signMessage,
  verifySignedMessage,
} from '@io/pgp';
import base64 from 'base-64';

const initAndUnlockDeviceKeys = ({
  privkeyArmored,
  passphrase,
}) => async dispatch => {
  try {
    const keyDetails = await initAndUnlockKeys({
      privatekeyArmored: privkeyArmored,
      passphrase,
    });
    if (!keyDetails) throw 'Error unlocking key';
    dispatch({
      type: PGP_UNLOCK_KEYS + FULFILLED,
      payload: keyDetails,
    });
  } catch (err) {
    dispatch({
      type: PGP_UNLOCK_KEYS + REJECTED,
      error: err,
    });
  }
};

const genAndSaveDevicePgpKeys = ({
  user,
  email,
  passphrase,
}) => async dispatch => {
  try {
    const keys = await dispatch(loadDevicePgpKeys());
    if (keys)
      throw 'Keys already detected! , please remove keys before generating news ones';
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
  }
};
const deleteDevicePgpKeys = () => async dispatch => {
  await deletePgpKeys();
};
const loadDevicePgpKeys = () => async dispatch => {
  const payload = await loadPGPKeys();
  if (payload) {
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
  } else {
    dispatch({
      type: GET_AUTH_STATUS + REJECTED,
      warning: AUTH_INFO_NOT_FOUND,
    });
  }
};
const savedEncryptedAuthInfo = payload => async (dispatch, getState) => {
  const {pubKeyArmored} = getState();
  if (!pubKeyArmored) {
    throw 'Cannot save auth info without keys being loaded or init';
  }
  const encInfo = encryptMessage(JSON.stringify(payload));
  await saveAuthInfo(encInfo);
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
  console.log('doing tor', token, key, devicePgpKey);
  try {
    // make sure token + keys have been loaded
    if (!token || !devicePgpKey)
      throw 'Cannot pair phone wihtout setting state first';
    const {eventType} = token;
    dispatch({type: REQUEST_PAIR + PENDING});
    switch (eventType) {
      case 'matrix':
        const client = await getClient(token);
        await pairMatrixClient(client, {token, key});
        dispatch({
          type: REQUEST_PAIR + FULFILLED,
          // payload: {token, key},
        });
        break;
      case 'tor':
        console.log('doing tor', devicePgpKey, token);
        const {fingerprint, publicKeyArmored} = devicePgpKey;
        const payloadSigner = async ({command, payload}) => {
          const payloadToSign = JSON.stringify({
            command,
            payload: payload || null,
          });
          const {armoredSignature} = await signMessage({msg: payloadToSign});
          return base64.encode(`${armoredSignature};${fingerprint}`);
        };
        const payloadSignatureVerifier = async (payload, signatureb64) => {
          const signature = base64.decode(signatureb64);
          const [sig, sigfingerprint] = signature.split(';');
          if (!sig || !sigfingerprint) {
            throw 'missing sig or fingerprint on request';
          }
          // FIXME we need to get the nodes fingerprintt...
          // for now we just check with the public key we have in the token
          try {
            return await verifySignedMessage({
              msg: payload,
              armoredSignature: sig,
              armoredKey: nodePubKey,
            });
          } catch (err) {
            console.error(
              'error validating signature of incoming message',
              err,
            );
            return false;
          }
        };

        const {onionUrl, deviceId, nodeKeyId} = token;
        const torClient = rnTorTransport({
          onionUrl,
          payloadSigner,
          payloadSignatureVerifier,
        });
        const {isValid, nodePubkey} = torClient.post('pairing-event', {
          devicePubkey: publicKeyArmored,
          deviceId,
          nodeKeyId,
          token,
          key,
        });
        // TODO check nodePubkey's finger print matches the one we scanned in QR
        if (isValid === true) {
          dispatch({
            type: REQUEST_PAIR + FULFILLED,
            payload: {nodePubkey},
          });
        } else {
          throw 'Non valid reponse got from node';
        }
        return isValid;
      default:
        throw `${eventType} is not valid pairing type`;
    }
  } catch (error) {
    dispatch({
      type: REQUEST_PAIR + REJECTED,
      error,
    });
    return false;
  }
};
const clearAuthInfo = () => async dispatch => {
  await deleteAuthInfo();
  dispatch({
    type: DELETE_AUTH_STATUS + FULFILLED,
  });
};

export {
  loadEncryptedAuthInfo,
  savedEncryptedAuthInfo,
  setAuthInfoState,
  loadDevicePgpKeys,
  clearAuthInfo,
  pairPhoneWithToken,
  genAndSaveDevicePgpKeys,
  deleteDevicePgpKeys,
  initAndUnlockDeviceKeys,
};
