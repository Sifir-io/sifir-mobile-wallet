import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import SifirTxnList from '@elements/SifirTxnList';
import SifirInvEntry from '@elements/TxnListItems/SifirInvEntry';
import SifirTxnEntry from '@elements/TxnListItems/SifirTxnEntry';
import SifirUnspentCoinEntry from '@elements/TxnListItems/SifirUnspentCoinEntry';
import SifirWasabiTxnEntry from '@elements/TxnListItems/SifirWasabiTxnEntry';
import {Images, AppStyle, C} from '@common/index';
import moment from 'moment';
const SifirTransactions = props => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const {type, headerText, filterWasabiTxnData, btcUnit, txnData} = props;

  const renderItem = txn => {
    if (type === C.STR_WASABI_WALLET_TYPE) {
      return <SifirWasabiTxnEntry txn={txn} unit={btcUnit} />;
    } else if (type === C.STR_UNSPENT_COINS) {
      return <SifirUnspentCoinEntry utxo={txn} unit={btcUnit} />;
    } else if (type === C.STR_LN_WALLET_TYPE) {
      return <SifirInvEntry inv={txn} unit={btcUnit} />;
    } else if (type === C.STR_SPEND_WALLET_TYPE) {
      return <SifirTxnEntry txn={txn} unit={btcUnit} />;
    } else if (type === C.STR_WATCH_WALLET_TYPE) {
      return <SifirTxnEntry txn={txn} unit={btcUnit} />;
    }
  };

  const processData = (txnData, start = 0, length = 20) => {
    if (type === C.STR_WASABI_WALLET_TYPE) {
      return [...(txnData?.transactions || [])]
        .sort((a, b) => moment(b.datetime).diff(moment(a.datetime)))
        .slice(start, length);
    } else if (type === C.STR_UNSPENT_COINS) {
      return [...(txnData?.unspentCoins || [])].slice(start, length);
    } else if (type === C.STR_LN_WALLET_TYPE) {
      return [...(txnData?.invoices || []), ...(txnData?.pays || [])]
        .filter(txn => txn && txn?.decodedBolt11?.timestamp > 1)
        .sort((a, b) => b.decodedBolt11.timestamp - a.decodedBolt11.timestamp)
        .slice(start, length);
    } else if (type === C.STR_SPEND_WALLET_TYPE) {
      return txnData;
    } else if (type === C.STR_WATCH_WALLET_TYPE) {
      return txnData;
    }
  };

  return (
    <View style={styles.container}>
      {type === C.STR_WASABI_WALLET_TYPE && (
        <View style={styles.headerRow}>
          {/* TODO Set header text according to filter - RECEIVED, SENT or All TRANSACTIONS */}
          <Text style={styles.txnLblTxt}>{headerText}</Text>
          <TouchableOpacity
            onPress={() => setShowContextMenu(!showContextMenu)}>
            <Image source={Images.filter_icon} />
          </TouchableOpacity>
        </View>
      )}
      {showContextMenu && (
        <View style={styles.filterPopupContainer}>
          <TouchableOpacity
            style={styles.popupListItem}
            onPress={() => filterWasabiTxnData('all')}>
            <Text style={styles.listItemLabel}>All</Text>
          </TouchableOpacity>
          <View style={styles.seperator} />
          <TouchableOpacity
            style={styles.popupListItem}
            onPress={() => filterWasabiTxnData('received')}>
            <Text style={styles.listItemLabel}>Received</Text>
          </TouchableOpacity>
          <View style={styles.seperator} />
          <TouchableOpacity
            style={styles.popupListItem}
            onPress={() => filterWasabiTxnData('sent')}>
            <Text style={styles.listItemLabel}>Sent</Text>
          </TouchableOpacity>
        </View>
      )}
      <SifirTxnList
        txnData={txnData}
        type={type}
        btcUnit={btcUnit}
        renderItem={renderItem}
        processData={processData}
        //TODO onFilter
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  txnLblTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  filterPopupContainer: {
    width: 165,
    height: 165,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    right: 0,
    position: 'absolute',
    elevation: 10,
    zIndex: 10,
    top: 50,
  },
  popupListItem: {
    backgroundColor: 'white',
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    borderRadius: 10,
  },
  seperator: {
    width: '90%',
    height: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
  },
  listItemLabel: {
    fontWeight: 'bold',
  },
});
export default SifirTransactions;
