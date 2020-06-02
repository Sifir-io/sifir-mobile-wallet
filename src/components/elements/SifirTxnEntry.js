import React from 'react';
import BtcTxnListItem from '@elements/TxnListItems/BtcTxnListItem';
import {Images} from '@common/index';
import moment from 'moment';

const SifirTxnEntry = ({txn, unit}) => {
  const makeTxnRenderData = ({category, txid, amount, timereceived}) => {
    let imgURL, timeStr, txIDStr;
    txIDStr = `${txid.slice(0, 3)} .. ${txid.slice(-3)}`;
    if (category) {
      switch (category) {
        case 'send':
          // TODO str to constants
          txIDStr = 'Sent - #' + txIDStr;
          imgURL = Images.icon_send;
          break;
        case 'receive':
          txIDStr = 'Received - #' + txIDStr;
          imgURL = Images.icon_receive;
          break;
        default:
          txIDStr = 'Unknown - #' + txIDStr;
          imgURL = Images.icon_receive;
          break;
      }
    } else {
      txIDStr = 'Received - #' + txIDStr;
      imgURL = Images.icon_receive;
    }
    timeStr = moment(timereceived * 1000).fromNow();
    return {imgURL, txIDStr, amount, timeStr};
  };

  const {imgURL, txIDStr, amount, timeStr} = makeTxnRenderData(txn);
  return (
    <BtcTxnListItem
      title={timeStr}
      description={txIDStr}
      amount={amount}
      unit={unit}
      imgURL={imgURL}
    />
  );
};

export default SifirTxnEntry;
