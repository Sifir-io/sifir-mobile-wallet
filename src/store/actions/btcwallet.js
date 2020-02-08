import * as types from '@types/';
import {FULFILLED, PENDING, REJECTED} from '@utils/constants';
import _btc from '@io/btcClient';
import {Images, C} from '@common/index';
import {getTransportFromToken} from '@io/transports';
import {log, error} from '@io/events/';
let btcClient;

const initBtcClient = () => async (dispatch, getState) => {
  if (!btcClient) {
    log('btcWallet:starting btc client');
    const {
      auth: {token, key, nodePubkey, devicePgpKey},
    } = getState();

    if (!token || !key || !nodePubkey) {
      //dispatch({
      //  type: types.BTC_CLIENT_STATUS + REJECTED,
      //  payload: {error: 'NO TOKEN'},
      //});
      throw 'Unable to init btc client';
    }
    const transport = await getTransportFromToken({
      token,
      nodePubkey,
      devicePgpKey,
    });
    //try {
    btcClient = await _btc({transport});
    ///} catch (err) {
    //error('error creating btc client', err);
    //dispatch({
    //  type: types.BTC_CLIENT_STATUS + REJECTED,
    //  payload: {error: 'Error creating btc client'},
    //});
    ///throw 'Unable to create btc client';
    //}
  }
  //dispatch({
  //  type: types.BTC_CLIENT_STATUS + FULFILLED,
  //});

  return btcClient;
};

const getBtcWalletList = () => async dispatch => {
  dispatch({type: types.BTC_WALLET_LIST_DATA_SHOW + PENDING});

  let btcWalletList = [
    {
      label: 'ADD',
      desc: C.STR_WALLET,
      iconURL: Images.icon_add,
      iconClickedURL: Images.icon_add_clicked,
      pageURL: 'AddWallet',
    },
  ];

  try {
    await dispatch(initBtcClient());
    const watchedPub32 = await btcClient.getWatchedPub32();
    watchedPub32.forEach(({pub32, label}) =>
      btcWalletList.push({
        pub32,
        label,
        type: C.STR_WATCH_WALLET_TYPE,
        desc: C.STR_WATCH_ONLY,
        iconURL: Images.icon_btcBtn,
        iconClickedURL: Images.icon_btcBtn_clicked,
        pageURL: 'Account',
      }),
    );

    // Add spending walet
    btcWalletList.push({
      label: 'Spending',
      desc: C.STR_WALLET,
      type: C.STR_SPEND_WALLET_TYPE,
      iconURL: Images.icon_btcBtn,
      iconClickedURL: Images.icon_btcBtn_clicked,
      pageURL: 'Account',
    });

    dispatch({
      type: types.BTC_WALLET_LIST_DATA_SHOW + FULFILLED,
      payload: {btcWalletList},
    });
  } catch (err) {
    error(err);
    dispatch({
      type: types.BTC_WALLET_LIST_DATA_SHOW + REJECTED,
      payload: {error: err},
    });
  }
};

const getWalletDetails = ({label, type}) => async dispatch => {
  dispatch({type: types.BTC_WALLET_DETAILS + PENDING});

  let balance = 0,
    txnData = [];
  log('getwalletdetails');
  try {
    await dispatch(initBtcClient());
    switch (type) {
      case C.STR_WATCH_WALLET_TYPE:
        [balance, txnData] = await Promise.all([
          btcClient.getBalanceByPub32Label(label),
          btcClient.getTransactionsByPub32Label(label),
        ]);
        break;
      case C.STR_SPEND_WALLET_TYPE:
        [balance, txnData] = await Promise.all([
          btcClient.getBalance(),
          btcClient.getTxnsSpending(),
        ]);
        break;
      default:
        break;
    }
    log('gott wallet details');
    dispatch({
      type: types.BTC_WALLET_DETAILS + FULFILLED,
      // payload: {btcWalletDetails: {balance, txnData, btcUnit}},
    });
    log('goint home');
    return {balance, txnData};

  } catch (err) {
    error(err);
    dispatch({
      type: types.BTC_WALLET_DETAILS + REJECTED,
      payload: {error: err},
    });
  }
};

const getWalletAddress = ({label, type, addrType = null}) => async dispatch => {
  log('getwalletaddress');
  dispatch({type: types.BTC_WALLET_ADDRESS + PENDING});
  let address = null;

  try {
    await dispatch(initBtcClient());
    switch (type) {
      case C.STR_WATCH_WALLET_TYPE:
        const result = await btcClient.getUnusedAddressesByPub32Label(label);
        [{address}] = result; // result[0].address;
        break;
      case C.STR_SPEND_WALLET_TYPE:
        address = await btcClient.getNewAddress(addrType);
        break;
      default:
        break;
    }
    log('dispatch getwalletaddress');
    dispatch({
      type: types.BTC_WALLET_ADDRESS + FULFILLED,
      payload: {address},
    });
    log('getwalletaddress goinghome');
  } catch (err) {
    error(err);
    dispatch({
      type: types.BTC_WALLET_ADDRESS + REJECTED,
      payload: {error: err},
    });
  }
};

const sendBitcoin = ({address, amount}) => async dispatch => {
  dispatch({type: types.SEND_BITCOIN + PENDING});
  try {
    await dispatch(initBtcClient());
    if (isNaN(amount)) {
      throw C.STR_AMOUNT_BENUMBER;
    }
    const btcSendResult = await btcClient.spend(address, Number(amount));
    dispatch({
      type: types.SEND_BITCOIN + FULFILLED,
      payload: {btcSendResult},
    });
    return btcSendResult;
  } catch (err) {
    error(err);
    dispatch({
      type: types.SEND_BITCOIN + REJECTED,
      payload: {error: err},
    });
  }
};

export {
  getWalletDetails,
  getBtcWalletList,
  initBtcClient,
  getWalletAddress,
  sendBitcoin,
};
