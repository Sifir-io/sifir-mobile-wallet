import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import SifirTxnList from '@elements/SifirTxnList';
import BtcTxnListItem from '@elements/TxnListItems/BtcTxnListItem';
import UnspentCoinListItem from '@elements/TxnListItems/UnspentCoinListItem';
import {Images, AppStyle, C} from '@common/index';

const SifirTransactions = ({
  type,
  headerText,
  filterWasabiTxnData,
  btcUnit,
  txnData,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);

  const renderItem = (txn, unit) => {
    if (type === C.STR_WASABI_WALLET_TYPE) {
      return <SifirWasabiTxn txn={txn} unit={unit} />;
    } else if (type === C.STR_UNSPENT_COINS) {
      return <SifirUnspentCoin txn={txn} unit={unit} />;
    }
  };

  const processData = (txnData, start = 0, length = 20) => {
    if (type === C.STR_WASABI_WALLET_TYPE) {
      const processedData = [...(txnData?.transactions || [])]
        .filter(txn => txn.label !== '')
        .sort((a, b) => b.datetime - a.datetime)
        .slice(start, length);
      return processedData;
    } else if (type === C.STR_UNSPENT_COINS) {
      const processedData = [...(txnData?.unspentCoins || [])].slice(
        start,
        length,
      );
      return processedData;
    }
  };

  const SifirWasabiTxn = ({txn, unit}) => {
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

  const SifirUnspentCoin = ({txn, unit}) => {
    try {
      const {amount, address, confirmed, label, anonymitySet, txid} = txn;
      // TODO add multiSelect list and use following icon
      const imgURL = confirmed
        ? Images.icon_confirmed
        : Images.icon_unconfirmed;
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

  return (
    <>
      {type === C.STR_WASABI_WALLET_TYPE && (
        <View style={styles.headerRow}>
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
        unit={btcUnit}
        renderItem={renderItem}
        processData={processData}
        //onFilter
        // ...
      />
    </>
  );
};

const styles = StyleSheet.create({
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
