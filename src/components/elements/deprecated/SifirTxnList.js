/* @DEPRECATED
 * contents moved to sifirtransacotins
 * */
import React, {useState} from 'react';
import {StyleSheet, FlatList} from 'react-native';

// I think this gets moved one level up to SifirTransactions , onFilter can set the data it will render after each filter returns
const SifirTxnList = ({txnData, renderItem, processData}) => {
  const [txnDataCached, setTxnDataCached] = useState([]);
  // FIXME proper array compare
  if (txnData.length !== txnDataCached.length) {
    setTxnDataCached(txnData);
  }
  const txnListToRender = React.useMemo(() => {
    return processData(txnData, 0, 20);
  }, [txnDataCached]);
  return (
    <FlatList
      data={txnListToRender}
      extraData={txnListToRender}
      keyExtractor={(item, index) =>
        item?.bolt11 + item?.txid + index + item.tx
      }
      renderItem={({item}) => {
        return renderItem(item);
      }}
    />
  );
};

export default SifirTxnList;

const styles = StyleSheet.create({});
