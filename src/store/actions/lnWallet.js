import * as types from '@types/';
import {FULFILLED, PENDING, REJECTED} from '@utils/constants';
import _ln from '@io/lnClient';
import {Images, C} from '@common/index';
import {getTransportFromToken} from '@io/transports';
import {log, error} from '@io/events/';
let lnClient;

const initLnClient = () => async (dispatch, getState) => {
  if (!lnClient) {
    log('btcWallet:starting btc client');
    const {
      auth: {token, key, nodePubkey, devicePgpKey},
    } = getState();

    if (!token || !key || !nodePubkey) {
      throw 'Unable to init btc client';
    }
    const transport = await getTransportFromToken({
      token,
      nodePubkey,
      devicePgpKey,
    });
    lnClient = await _ln({transport});
  }
  return lnClient;
};

const getLnNodeInfo = () => async dispatch => {
  dispatch({type: types.LN_WALLET_NODEINFO + PENDING});
  await dispatch(initLnClient());
  try {
    const nodeInfo = await lnClient.getNodeInfo();
    nodeInfo.pageURL = 'Account';
    nodeInfo.type = C.STR_LN_WALLET_TYPE;
    nodeInfo.label = nodeInfo.alias;
    nodeInfo.iconURL = Images.icon_light;
    nodeInfo.iconClickedURL = Images.icon_light_clicked;
    dispatch({
      type: types.LN_WALLET_NODEINFO + FULFILLED,
      payload: {nodeInfo},
    });
  } catch (err) {
    error(err);
    dispatch({
      type: types.LN_WALLET_NODEINFO + REJECTED,
      payload: {error: err},
    });
  }
};

const getLnWalletDetails = () => async dispatch => {
  dispatch({type: types.LN_WALLET_DETAILS + PENDING});
  try {
    await dispatch(initLnClient());
    const [{channels, outputs}, invoices] = await Promise.all([
      lnClient.listFunds(),
      lnClient.getInvoice(),
    ]);
    const inChannelBalance = channels.reduce((balance, {channel_sat}) => {
      balance += channel_sat;
      return balance;
    }, 0);
    const outputBalance = outputs.reduce((balance, {value}) => {
      balance += value;
      return balance;
    }, 0);

    dispatch({
      type: types.LN_WALLET_DETAILS + FULFILLED,
    });
    return {inChannelBalance, outputBalance, invoices};
  } catch (err) {
    error(err);
    dispatch({
      type: types.LN_WALLET_DETAILS + REJECTED,
      payload: {error: err},
    });
  }
};

const getFunds = () => async dispatch => {
  dispatch({type: types.LN_WALLET_GET_FUNDS + PENDING});
  try {
    await dispatch(initLnClient());
    const {channels, outputs} = lnClient.listFunds();
    dispatch({
      type: types.LN_WALLET_GET_FUNDS + FULFILLED,
      payload: {channels, outputs},
    });
  } catch (err) {
    error(err);
    dispatch({
      type: types.LN_WALLET_GET_FUNDS + REJECTED,
      payload: {error: err},
    });
  }
};

const decodeBolt = bolt11 => async dispatch => {
  dispatch({type: types.LN_WALLET_DECODE_BOLT + PENDING});
  try {
    await dispatch(initLnClient());
    const invoice = await lnClient.decodeBolt(bolt11);
    dispatch({
      type: types.LN_WALLET_DECODE_BOLT + FULFILLED,
    });
    return invoice;
  } catch (err) {
    error(err);
    dispatch({
      type: types.LN_WALLET_DECODE_BOLT + REJECTED,
      payload: {error: err},
    });
  }
};

const getRoute = (nodeId, msatoshi) => async dispatch => {
  dispatch({type: types.LN_WALLET_GET_ROUTE + PENDING});
  try {
    await dispatch(initLnClient());
    const routes = await lnClient.getRoute(nodeId, msatoshi);
    dispatch({
      type: types.LN_WALLET_GET_ROUTE + FULFILLED,
    });
    return routes;
  } catch (err) {
    error(err);
    dispatch({
      type: types.LN_WALLET_GET_ROUTE + REJECTED,
      payload: {error: err},
    });
  }
};

const payBolt = bolt11 => async dispatch => {
  dispatch({type: types.LN_WALLET_PAY_BOLT + PENDING});
  try {
    await dispatch(initLnClient());
    const txnDetails = await lnClient.payBolt11(bolt11);
    dispatch({
      type: types.LN_WALLET_PAY_BOLT + FULFILLED,
      payload: {txnDetails},
    });
    return txnDetails;
  } catch (err) {
    error(err);
    dispatch({
      type: types.LN_WALLET_PAY_BOLT + REJECTED,
      payload: {error: err},
    });
  }
};

const getPeers = nodeId => async dispatch => {
  dispatch({type: types.LN_WALLET_GET_PEERS + PENDING});
  try {
    await dispatch(initLnClient());
    const peers = await lnClient.listPeers(nodeId);
    dispatch({
      type: types.LN_WALLET_GET_PEERS + FULFILLED,
    });
    return peers;
  } catch (err) {
    dispatch({
      type: types.LN_WALLET_GET_PEERS + REJECTED,
      payload: {error: err},
    });
    error(err);
  }
};

const createInvoice = invoice => async dispatch => {
  dispatch({type: types.LN_WALLET_CREATE_INVOICE + PENDING});
  try {
    await dispatch(initLnClient());
    const createdInvoice = await lnClient.createInvoice(invoice);
    dispatch({
      type: types.LN_WALLET_CREATE_INVOICE + FULFILLED,
    });
    console.log('createdInvoice-----------', createdInvoice);
    return createdInvoice;
  } catch (err) {
    error(err);
    dispatch({
      type: types.LN_WALLET_CREATE_INVOICE + REJECTED,
      payload: {error: err},
    });
  }
};
export {
  getFunds,
  getLnNodeInfo,
  getLnWalletDetails,
  decodeBolt,
  getRoute,
  payBolt,
  getPeers,
  createInvoice,
};
