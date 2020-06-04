import React from 'react';
import BtcTxnListItem from '@elements/TxnListItems/SifirBtcTxnListItem';
import {Images, C} from '@common/index';
import moment from 'moment';

const SifirWasabiTxnEntry = ({txn, unit}) => {
  try {
    const {amount, datetime, label} = txn;
    const imgURL = amount > 0 ? Images.icon_yellowTxn : Images.icon_send;
    const isSentTxn = amount > 0 ? false : true;
    return (
      <BtcTxnListItem
        title={label}
        description={moment(datetime).fromNow()}
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

export default SifirWasabiTxnEntry;
