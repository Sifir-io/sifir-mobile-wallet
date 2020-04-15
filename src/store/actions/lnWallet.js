import * as types from '@types/';
import {FULFILLED, PENDING, REJECTED} from '@utils/constants';
import {lnClient as _ln} from '@io/lnClient';
import _sifir from '@io/sifirClient';
import {lnStore} from '@io/stores';
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

const getLnNodesList = () => async dispatch => {
  await dispatch(initLnClient());
  const lnNodes = await lnStore.getLnNodes();
  if (!lnNodes?.length) {
    // FIXME cold boot hack
    // mainly to stay backward compatible with old archittecture FIXME
    // Either go to observable or fix this shit
    const nodeInfo = await lnClient.getNodeInfo();
    dispatch(getLnNodeInfo(nodeInfo.alias));
  } else {
    dispatch(getLnNodeInfo(lnNodes[0].nodeInfo.alias));
  }
};
const getLnNodeInfo = label => async dispatch => {
  dispatch({type: types.LN_WALLET_NODEINFO + PENDING});
  await dispatch(initLnClient());
  try {
    let nodeInfo;
    const cachedNodeInfo = await lnStore.getLnNodeByAlias(label);
    if (
      cachedNodeInfo &&
      Date.now() - cachedNodeInfo.updatedAt.getTime() < 1000 * 60 * 10
    ) {
      log('Found cached node', cachedNodeInfo.updatedAt, cachedNodeInfo);
      nodeInfo = {...cachedNodeInfo.nodeInfo};
    } else {
      nodeInfo = await lnClient.getNodeInfo();
      log('inserting new LnNode', nodeInfo);
      await lnStore.upsertLnNodeByPubkey(nodeInfo.id, {...nodeInfo, nodeInfo});
    }
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

const getLnWalletDetails = ({label}) => async dispatch => {
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
    // get cached node info
    const lnNode = await lnStore.getLnNodeByAlias(label);
    if (!lnNode) {
      throw 'LN node not found, please reload your wallets';
    }
    // FIXME here lazy loaded transactions ? and maybe promises neede to be waiting ?
    // move the fetch to model?
    const nodeTransactions = await lnNode.transactions.fetch();
    const nodeBoltsToInsert = [];
    const [processedInvoices, processedPays] = [invoices, pays].map(
      (collection, i) =>
        collection.map(inv => {
          const type = i === 0 ? 'invoice' : 'pay';
          let payload;
          try {
            const cachedBolt = nodeTransactions.find(
              ({bolt11, type: rType}) =>
                rType === type && bolt11 === inv.bolt11,
            );
            if (cachedBolt) {
              payload = {
                decodedBolt11: cachedBolt.decodedBolt11,
                bolt11: cachedBolt.bolt11,
                type: cachedBolt.type,
                meta: cachedBolt.meta,
              };
              log('cached bolt', payload);
            } else {
              // decode and insert it
              const decodedBolt11 = bolt11Lib.decode(inv.bolt11);
              payload = {
                decodedBolt11,
                bolt11: inv.bolt11,
                type,
                meta: inv,
              };
              nodeBoltsToInsert.push(payload);
            }
            return payload;
          } catch (err) {
            log('error processing lnwallet bolt', err);
          }
        }),
    );
    if (nodeBoltsToInsert.length) {
      await lnStore.batchInsertLnNodeDecodedBolts(
        lnNode.pubkey,
        nodeBoltsToInsert,
      );
    }
    dispatch({
      type: types.LN_WALLET_DETAILS + FULFILLED,
    });
    return {
      balance,
      txnData: {invoices: processedInvoices, pays: processedPays},
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
    // TODO sometimes CN timesout while trying to connect to LN node, i think it's best we error out at this point and retry
    // // if timedout; consider it as success.
    // if (typeof err?.err === 'string' && err.err.includes('timedout')) {
    //   const fundingResponse = {
    //     message: C.LN_ERROR_Funding_timeout_sucess_response,
    //   };
    //   dispatch({
    //     type: types.LN_WALLET_OPEN_FUND_PEER_CHANNEL + FULFILLED,
    //   });
    //   return fundingResponse;
    // } else {
    dispatch({
      type: types.LN_WALLET_OPEN_FUND_PEER_CHANNEL + REJECTED,
      payload: {error: err.err.err}, //nested err obj received :|
    });
    // }
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
  getLnNodesList,
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
