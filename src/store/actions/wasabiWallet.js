import * as types from '@types/';
import {FULFILLED, PENDING, REJECTED} from '@utils/constants';
import _wasabi from '@io/wasabiClient';
import {C} from '@common/index';
import {getTransportFromToken} from '@io/transports';
import {log, error} from '@io/events/';
let wasabiClient;

const initWasabiClient = () => async (dispatch, getState) => {
  if (!wasabiClient) {
    log('wasabi:starting wasabi client');
    const {
      auth: {token, key, nodePubkey, devicePgpKey},
    } = getState();

    if (!token || !key || !nodePubkey) {
      throw 'Unable to init wasabi client';
    }
    const transport = await getTransportFromToken({
      token,
      nodePubkey,
      devicePgpKey,
    });
    wasabiClient = await _wasabi({transport});
  }
  return wasabiClient;
};

const getNewAddress = ({label}) => async dispatch => {
  dispatch({type: types.WASABI_WALLET_ADDRESS + PENDING});
  try {
    await dispatch(initWasabiClient());
    const address = await wasabiClient.getNewAddress({label});
    // TODO store address
    dispatch({
      type: types.WASABI_WALLET_ADDRESS + FULFILLED,
    });
    /**
     * {
     *   address: Address;
     *   keyPath: string; //"84'/0'/0'/0/23";
     *   label: string; //'["unknown"]';
     *  }
     *
     */
    return address;
  } catch (err) {
    error(err);
    dispatch({
      type: types.WASABI_WALLET_ADDRESS + REJECTED,
      payload: {error: err},
    });
  }
};

const spend = ({
  address,
  amount,
  minanonset,
  instanceId = 0,
  privateOnly = 0,
}) => async dispatch => {
  dispatch({type: types.WASABI_WALLET_SPEND + PENDING});
  try {
    await dispatch(initWasabiClient());
    if (isNaN(amount)) {
      throw C.STR_AMOUNT_BENUMBER;
    }
    const btcSendResult = await wasabiClient.spend({
      address,
      amount,
      instanceId,
      private: privateOnly,
      minanonset,
    });
    dispatch({
      type: types.WASABI_WALLET_SPEND + FULFILLED,
    });
    return btcSendResult;
  } catch (err) {
    error(err);
    dispatch({
      type: types.WASABI_WALLET_SPEND + REJECTED,
      payload: {error: err},
    });
  }
};
const getUnspentCoins = ({instanceId = 0}) => async dispatch => {
  dispatch({type: types.WASABI_WALLET_GET_UNSPENTCOINS + PENDING});
  try {
    await dispatch(initWasabiClient());
    const unspentCoinsList = await wasabiClient.getUnspentCoins(instanceId);
    // TODO cache it ?
    dispatch({
      type: types.WASABI_WALLET_GET_UNSPENTCOINS + FULFILLED,
      payload: {unspentCoinsList},
    });
    return unspentCoinsList;
  } catch (err) {
    error(err);
    dispatch({
      type: types.WASABI_WALLET_GET_UNSPENTCOINS + REJECTED,
      payload: {error: err},
    });
  }
};

const getTxns = ({instanceId = 0}) => async dispatch => {
  dispatch({type: types.WASABI_WALLET_GET_TXNS + PENDING});
  try {
    await dispatch(initWasabiClient());
    const txnsList = await wasabiClient.getTxns(instanceId);
    // TODO cache it ?
    dispatch({
      type: types.WASABI_WALLET_GET_TXNS + FULFILLED,
      payload: {txnsList},
    });
    return txnsList;
  } catch (err) {
    error(err);
    dispatch({
      type: types.WASABI_WALLET_GET_TXNS + REJECTED,
      payload: {error: err},
    });
  }
};
export {getTxns, getUnspentCoins, getNewAddress, spend, initWasabiClient};
