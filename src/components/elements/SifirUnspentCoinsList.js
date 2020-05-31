import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Images, C} from '@common/index';
import SifirTxnList from '@elements/SifirTxnList';

const SifirUnspentCoinsList = ({btcUnit, txnData}) => {
  return (
    <>
      <SifirTxnList
        txnData={txnData}
        type={C.STR_UNSPENT_COINS}
        unit={btcUnit}
      />
    </>
  );
};

const styles = StyleSheet.create({});
export default SifirUnspentCoinsList;
