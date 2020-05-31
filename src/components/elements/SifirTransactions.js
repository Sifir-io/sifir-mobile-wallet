import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Images, C} from '@common/index';
import SifirTxnList from '@elements/SifirTxnList';

const SifirTransactions = ({
  type,
  headerText,
  filterWasabiTxnData,
  btcUnit,
  txnData,
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);

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
      <SifirTxnList txnData={txnData} type={type} unit={btcUnit} />
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
