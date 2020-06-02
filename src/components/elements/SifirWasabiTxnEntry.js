import React from 'react';
import BtcTxnListItem from '@elements/TxnListItems/BtcTxnListItem';
import {Images} from '@common/index';

const SifirWasabiTxnEntry = ({txn, unit}) => {
  try {
    const {amount, datetime, label} = txn;
    const imgURL = amount > 0 ? Images.icon_yellowTxn : Images.icon_send;
    const isSentTxn = amount > 0 ? false : true;
    return (
      <BtcTxnListItem
        title={label}
        description={datetime}
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
