import React, {useState} from 'react';
import UnspentCoinListItem from '@elements/TxnListItems/SifirUnspentCoinListItem';
import {Images} from '@common/index';

const SifirUnspentCoinEntry = ({utxo, unit}) => {
  try {
    const {amount, address, confirmed, label, anonymitySet, txid} = utxo;
    // TODO add multiSelect list and use following icon
    const imgURL = confirmed ? Images.icon_confirmed : Images.icon_unconfirmed;
    return (
      <UnspentCoinListItem
        amount={amount}
        anonSet={anonymitySet}
        label={label}
        txid={txid}
        confirmed={confirmed}
        leftIcon={Images.icon_bitcoinWhiteOutlined}
        rightIcon={imgURL}
        address={address}
        unit={unit}
      />
    );
  } catch (err) {
    return null;
  }
};

export default SifirUnspentCoinEntry;
