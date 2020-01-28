import * as types from '@types/index';
import {FULFILLED, PENDING, REJECTED} from '@utils/constants';
import {getClient, pairMatrixClient} from '@io/matrix/';
import {saveAuthInfo, getSavedAuthInfo, deleteAuthInfo} from '@io/auth';
// FIXME get keys first then try loadAuth
export const loadAuthInfo = () => async dispatch => {
  const {token, key} = await getSavedAuthInfo();

  if (token && key) {
    dispatch({
      type: types.GET_AUTH_STATUS + FULFILLED,
      payload: {token, key},
    });
  } else {
    dispatch({
      type: types.GET_AUTH_STATUS + REJECTED,
      warning: 'AUTH_INFO_NOT_FOUND',
    });
  }
};
export const clearAuthInfo = () => async dispatch => {
  await deleteAuthInfo();
  dispatch({
    type: types.DELETE_AUTH_STATUS + FULFILLED,
  });
};
//export const initMatrixClient = ({token}) => async dispatch => {
//  const client = await getClient();
//  dispatch({
//    type: types.ACTION_MATRIX_CLIENT + FULFILLED,
//    payload: {clientInit: true},
//  });
//  return client;
//};
export const pairPhoneWithToken = ({token, key}) => async dispatch => {
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
