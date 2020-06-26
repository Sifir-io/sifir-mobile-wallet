import React from 'react';
import BtcTxnListItem from '@elements/TxnListItems/SifirBtcTxnListItem';
import {Images} from '@common/index';
import moment from 'moment';

const SifirInvEntry = ({inv, unit}) => {
  const {type} = inv;

  const makePaysRenderData = ({decodedBolt11, meta: {preimage}}) => {
    let amount, imgURL, description, timeStr;
    const isSentTxn = true;
    const {millisatoshis, complete, timestamp} = decodedBolt11;
    if (complete) {
      imgURL = Images.icon_send;
      // FIXME strings to constants...
      description = `Paid - ${preimage.slice(0, 3)} .. ${preimage.slice(-3)}`;
      amount = millisatoshis;
      timeStr = moment(timestamp * 1000).fromNow();
    }
    return {amount, description, imgURL, timeStr, isSentTxn};
  };

  const makeInvoiceRenderData = ({
    decodedBolt11,
    meta: {description: desc, status},
  }) => {
    let amount, imgURL, description, timeStr, isSentTxn;
    const {millisatoshis, timestamp} = decodedBolt11;
    amount = millisatoshis;
    description = desc;
    switch (status) {
      case 'unpaid':
        imgURL = Images.icon_yellowTxn;
        isSentTxn = false;
        break;
      case 'paid':
        imgURL = Images.icon_thickGreenArrowTxn;
        isSentTxn = true;
        break;
    }
    timeStr = moment(timestamp * 1000).fromNow();
    return {amount, description, imgURL, timeStr, isSentTxn};
  };

  try {
    const {amount, imgURL, timeStr, description, isSentTxn} =
      type === 'invoice' ? makeInvoiceRenderData(inv) : makePaysRenderData(inv);
    return (
      <BtcTxnListItem
        title={timeStr}
        description={description}
        amount={amount}
        unit={unit}
        imgURL={imgURL}
        isSentTxn={isSentTxn}
      />
    );
  } catch (err) {
    return null;
  }
};

export default SifirInvEntry;
