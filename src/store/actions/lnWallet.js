import * as types from '@types/';
import {FULFILLED, PENDING, REJECTED} from '@utils/constants';
import _ln from '@io/lnClient';
import _sifir from '@io/sifirClient';
import {Images, C} from '@common/index';
import {getTransportFromToken} from '@io/transports';
import {log, error} from '@io/events/';
import bolt11Lib from '@helpers/bolt11.min';
let lnClient;
let sifirClient;

const initLnClient = () => async (dispatch, getState) => {
  if (!lnClient) {
    log('lnWallet:starting ln client');
    const {
      auth: {token, key, nodePubkey, devicePgpKey},
    } = getState();

    if (!token || !key || !nodePubkey) {
      throw 'Unable to init ln client';
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
const initSifirClient = () => async (dispatch, getState) => {
  if (!sifirClient) {
    log('sifir:starting sifir client');
    const {
      auth: {token, key, nodePubkey, devicePgpKey},
    } = getState();

    if (!token || !key || !nodePubkey) {
      throw 'Unable to init sifir client';
    }
    const transport = await getTransportFromToken({
      token,
      nodePubkey,
      devicePgpKey,
    });
    sifirClient = await _sifir({transport});
  }
  return sifirClient;
};

const getLnNodeInfo = () => async dispatch => {
  dispatch({type: types.LN_WALLET_NODEINFO + PENDING});
  await dispatch(initLnClient());
  try {
    const nodeInfo = await lnClient.getNodeInfo();
    //const [{channels, outputs}, nodeInfo] = await Promise.all([
    //  lnClient.listFunds(),
    //  lnClient.getNodeInfo(),
    //]);
    //const inChannelBalance = channels.reduce((balance, {channel_sat}) => {
    //  balance += channel_sat;
    //  return balance;
    //}, 0);
    //const outputBalance = outputs.reduce((balance, {value}) => {
    //  balance += value;
    //  return balance;
    //}, 0);
    //const balance = inChannelBalance + outputBalance;
    nodeInfo.pageURL = 'Account';
    nodeInfo.type = C.STR_LN_WALLET_TYPE;
    nodeInfo.label = nodeInfo.alias;
    nodeInfo.iconURL = Images.icon_light;
    nodeInfo.iconClickedURL = Images.icon_light_clicked;
    // nodeInfo.balance = balance;
    dispatch({
      type: types.LN_WALLET_NODEINFO + FULFILLED,
      payload: {nodeInfo},
    });
  } catch (err) {
    error(err);
    dispatch({
      type: types.LN_WALLET_NODEINFO + REJECTED,
      payload: {nodeError: err},
    });
  }
};

const getLnWalletDetails = () => async dispatch => {
  dispatch({type: types.LN_WALLET_DETAILS + PENDING});
  try {
    await dispatch(initSifirClient());
    const {
      funds: {channels, outputs},
      invoices,
      pays,
    } = await sifirClient.getLnWalletSnapshot();
    const inChannelBalance = channels.reduce((balance, {channel_sat}) => {
      balance += channel_sat;
      return balance;
    }, 0);
    const outputBalance = outputs.reduce((balance, {value}) => {
      balance += value;
      return balance;
    }, 0);
    const balance = inChannelBalance + outputBalance;

    // FIXME THIS SHIT
    // const invoicesWithDecodedBolts = [...invoices];
    // const paysWithDecodedBolts = [...pays];
    const time = Date.now();
    const invoicesWithDecodedBolts = invoices.map(inv => {
      try {
        return {
          ...inv,
          // decodedBolt: bolt11Lib.decode(inv.bolt11),
          type: 'invoice',
        };
      } catch {}
    });
    console.log('TIME1', time - Date.now());
    const time2 = Date.now();
    const paysWithDecodedBolts = pays.map(pay => {
      try {
        return {
          ...pay,
          // decodedBolt: bolt11Lib.decode(pay.bolt11),
          type: 'pays',
        };
      } catch {}
    });
    console.log('TIME2', time2 - Date.now());

    // const txnData = [...invoicesWithDecodedBolts, ...paysWithDecodedBolts];
    // remove invalid txns from array
    //const filteredTxnData = txnData
    //  .filter(txn => txn?.decodedBolt?.timestamp > 1)
    //  .sort((a, b) => b.decodedBolt.timestamp - a.decodedBolt.timestamp);
    dispatch({
      type: types.LN_WALLET_DETAILS + FULFILLED,
    });
    return {
      balance,
      txnData: [...paysWithDecodedBolts, ...invoicesWithDecodedBolts],
    };
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
    const {channels, outputs} = await lnClient.listFunds();
    const inChannelBalance = channels.reduce((balance, {channel_sat}) => {
      balance += channel_sat;
      return balance;
    }, 0);
    const outputBalance = outputs.reduce((balance, {value}) => {
      balance += value;
      return balance;
    }, 0);
    const balance = inChannelBalance + outputBalance;
    dispatch({
      type: types.LN_WALLET_GET_FUNDS + FULFILLED,
      payload: {balance},
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
    dispatch({
      type: types.LN_WALLET_DECODE_BOLT + REJECTED,
      payload: {error: err.err.err},
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
    // if throws no found exception
    if (err.err.err.code === 205) {
      dispatch({
        type: types.LN_WALLET_GET_ROUTE + FULFILLED,
      });
      return [];
    } else {
      error(err);
      dispatch({
        type: types.LN_WALLET_GET_ROUTE + REJECTED,
      });
    }
  }
};

const payBolt = bolt11 => async dispatch => {
  dispatch({type: types.LN_WALLET_PAY_BOLT + PENDING});
  try {
    await dispatch(initLnClient());
    const txnDetails = await lnClient.payBolt11(bolt11);
    dispatch({
      type: types.LN_WALLET_PAY_BOLT + FULFILLED,
    });
    return txnDetails;
  } catch (err) {
    error(err);
    dispatch({
      type: types.LN_WALLET_PAY_BOLT + REJECTED,
      payload: {error: err.err.err},
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
      payload: {peers},
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
  // Commenting it for future testing

  // invoice = {
  //   msatoshi: 9999,
  //   label: 'Test in',
  //   description: 'Test inv 3.28.2020',
  //   expiry: 100000,
  //   callback_url: 'CallBackUrl',
  // };
  dispatch({type: types.LN_WALLET_CREATE_INVOICE + PENDING});
  try {
    await dispatch(initLnClient());
    const createdInvoice = await lnClient.createInvoice(invoice);
    dispatch({
      type: types.LN_WALLET_CREATE_INVOICE + FULFILLED,
    });
    return createdInvoice;
  } catch (err) {
    error(err);
    dispatch({
      type: types.LN_WALLET_CREATE_INVOICE + REJECTED,
      payload: {error: err},
    });
  }
};
const openAndFundPeerChannel = payload => async dispatch => {
  dispatch({type: types.LN_WALLET_OPEN_FUND_PEER_CHANNEL + PENDING});
  try {
    await dispatch(initLnClient());
    const fundingResponse = await lnClient.openAndFundPeerChannel(payload);
    dispatch({
      type: types.LN_WALLET_OPEN_FUND_PEER_CHANNEL + FULFILLED,
    });
    return fundingResponse;
  } catch (err) {
    // if timedout; consider it as success.
    if (typeof err?.err === 'string' && err.err.includes('timedout')) {
      const fundingResponse = {
        message: C.LN_ERROR_Funding_timeout_sucess_response,
      };
      dispatch({
        type: types.LN_WALLET_OPEN_FUND_PEER_CHANNEL + FULFILLED,
      });
      return fundingResponse;
    } else {
      dispatch({
        type: types.LN_WALLET_OPEN_FUND_PEER_CHANNEL + REJECTED,
        payload: {error: err.err.err}, //nested err obj received :|
      });
    }
  }
};

const getNewAddress = () => async dispatch => {
  dispatch({type: types.LN_WALLET_GET_NEW_ADDRESS + PENDING});
  try {
    await dispatch(initLnClient());
    const address = await lnClient.getNewAddress();
    dispatch({
      type: types.LN_WALLET_GET_NEW_ADDRESS + FULFILLED,
      payload: {address},
    });
    return address;
  } catch (err) {
    dispatch({
      type: types.LN_WALLET_GET_NEW_ADDRESS + REJECTED,
      payload: {error: err},
    });
    error(err);
  }
};

const withdrawFunds = (address, amount) => async dispatch => {
  dispatch({type: types.LN_WALLET_WITHDRAW_FUNDS + PENDING});
  try {
    await dispatch(initLnClient());
    const btcSendResult = await lnClient.withdrawFunds(address, amount);
    dispatch({
      type: types.LN_WALLET_WITHDRAW_FUNDS + FULFILLED,
    });
    return btcSendResult;
  } catch (err) {
    error(err);
    dispatch({
      type: types.LN_WALLET_WITHDRAW_FUNDS + REJECTED,
      payload: {error: err.err.err},
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
  openAndFundPeerChannel,
  getNewAddress,
  withdrawFunds,
};
