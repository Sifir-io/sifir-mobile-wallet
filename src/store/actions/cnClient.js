import {C} from '@common';
import * as types from '@types/';
import {FULFILLED, PENDING, REJECTED} from '@utils/constants';
import _cn from '@io/cnClient';
import {getTransportFromToken} from '@io/transports';
import {log, error} from '@io/events';

const properties = {
  CN_AUTOSPEND_WALLET_LABEL: 'wasabi_batchprivatetospender_cfg',
  CN_AUTOSPEND_ANONSET_LEVEL: 'wasabi_batchprivatetospender_minanonset',
};
let cnClient;

const initCnClient = () => async (dispatch, getState) => {
  if (!cnClient) {
    log('cnClient:starting cyphernode client');
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
    cnClient = await _cn({transport});
  }
  return cnClient;
};

const getWasabiAutoSpendWallet = () => async (dispatch, getState) => {
  const {
    cyphernode: {cfgProps},
  } = getState();
  const prop = cfgProps.find(
    ({property, value}) => property === properties.CN_AUTOSPEND_WALLET_LABEL,
  );
  if (!prop) {
    return null;
  }
  const {value: spendingWalletLabel} = prop;
  // some translations to do here
  switch (spendingWalletLabel) {
    case '_spender':
      return C.STR_SPEND_WALLET_LABEL;
    case '_disabled':
      return null;
    default:
      return spendingWalletLabel;
  }
};
const getWasabiAutoSpendMinAnonset = () => async (dispatch, getState) => {
  const {
    cyphernode: {cfgProps},
  } = getState();
  const prop = cfgProps.find(
    ({property, value}) => property === properties.CN_AUTOSPEND_ANONSET_LEVEL,
  );
  if (!prop) {
    return null;
  }
  return prop.value;
};
const setWasabiAutoSpendWalletAndAnonset = ({
  label = undefined,
  anonset = undefined,
}) => async (dispatch, getState) => {
  if (label) {
    let value;
    // some translations to do here
    switch (label) {
      case C.STR_SPEND_WALLET_LABEL:
        value = '_spending';
        break;
      case null:
        value = '_disabled';
        break;
      default:
        value = label;
        break;
    }
    await dispatch(setConfigProp(properties.CN_AUTOSPEND_WALLET_LABEL, value));
  }
  if (anonset) {
    await dispatch(
      setConfigProp(properties.CN_AUTOSPEND_ANONSET_LEVEL, anonset),
    );
  }
};
const getConfigProps = () => async dispatch => {
  dispatch({type: types.CN_CLIENT_GET_CFG_PROPS + PENDING});
  try {
    await dispatch(initCnClient());
    const cfgProps = await cnClient.getConfigProps();
    dispatch({
      type: types.CN_CLIENT_GET_CFG_PROPS + FULFILLED,
      payload: {cfgProps},
    });
    return cfgProps;
  } catch (err) {
    error(err);
    dispatch({
      type: types.CN_CLIENT_GET_CFG_PROPS + REJECTED,
      payload: {error: err},
    });
  }
};
const setConfigProp = (property, value) => async dispatch => {
  dispatch({type: types.CN_CLIENT_SET_CFG_PROPS + PENDING});
  try {
    await dispatch(initCnClient());
    console.log('sending', property, value);
    const result = await cnClient.setConfigProp(property, value);
    console.log('sending result', result);
    dispatch({
      type: types.CN_CLIENT_SET_CFG_PROPS + FULFILLED,
    });
    return result;
  } catch (err) {
    error(err);
    dispatch({
      type: types.CN_CLIENT_SET_CFG_PROPS + REJECTED,
      payload: {error: err},
    });
  }
};

export {
  getConfigProps,
  setConfigProp,
  getWasabiAutoSpendWallet,
  getWasabiAutoSpendMinAnonset,
  setWasabiAutoSpendWalletAndAnonset,
};
