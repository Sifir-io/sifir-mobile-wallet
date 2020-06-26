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
      throw 'Unable to init btc client';
    }
    const transport = await getTransportFromToken({
      token,
      nodePubkey,
      devicePgpKey,
    });
    btcClient = await _btc({transport});
  }
  return btcClient;
};

const getBlockChainInfo = () => async dispatch => {
  dispatch({type: types.BTC_WALLET_GET_BLOCKCHAININFO + PENDING});
  try {
    await dispatch(initBtcClient());
    const chainInfo = await btcClient.getBlockChainInfo();
    dispatch({
      type: types.BTC_WALLET_GET_BLOCKCHAININFO + FULFILLED,
      payload: {chainInfo},
    });
    return chainInfo;
  } catch (err) {
    error(err);
    dispatch({
      type: types.BTC_WALLET_GET_BLOCKCHAININFO + REJECTED,
      payload: {error: err},
    });
  }
};
const getBtcWalletList = () => async dispatch => {
  dispatch({type: types.BTC_WALLET_LIST_DATA_SHOW + PENDING});

  let btcWalletList = [
    //  {
    //    label: 'ADD',
    //    desc: C.STR_WALLET,
    //    iconURL: Images.icon_add,
    //    iconClickedURL: Images.icon_add_clicked,
    //    pageURL: 'AddWallet',
    //  },
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
        meta: {
          enableAddressTypeSelection: false,
        },
      }),
    );

    // Add spending wallet
    btcWalletList.push({
      label: C.STR_SPEND_WALLET_LABEL,
      desc: C.STR_WALLET,
      type: C.STR_SPEND_WALLET_TYPE,
      iconURL: Images.icon_btcBtn,
      iconClickedURL: Images.icon_btcBtn_clicked,
      backIcon: Images.icon_btc_cir,
      pageURL: 'Account',
      meta: {
        enableAddressTypeSelection: true,
        showAddressTypeSelector: true,
      },
    });

    btcWalletList.push({
      label: C.STR_WASABI_WALLET_LABEL,
      desc: C.STR_WALLET,
      type: C.STR_WASABI_WALLET_TYPE,
      iconURL: Images.icon_wasabi,
      iconClickedURL: Images.icon_wasabi_clicked,
      backIcon: Images.icon_wasabi,
      pageURL: 'Account',
      meta: {
        enableAddressLabelInput: true,
      },
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
    // TODO move this to component
    txnData.sort((a, b) => {
      return b.timereceived - a.timereceived;
    });
    dispatch({
      type: types.BTC_WALLET_DETAILS + FULFILLED,
      payload: {balance, txnData},
    });
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
    dispatch({
      type: types.BTC_WALLET_ADDRESS + FULFILLED,
      payload: {address},
    });
    return address;
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
  getBlockChainInfo,
};
