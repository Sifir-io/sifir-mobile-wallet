import React, {useState} from 'react';
import {StyleSheet, FlatList} from 'react-native';

const SifirTxnList = ({unit, txnData, type, renderItem, processData}) => {
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
        return renderItem(item, unit);
      }}
    />
  );
};

export default SifirTxnList;

const styles = StyleSheet.create({});
