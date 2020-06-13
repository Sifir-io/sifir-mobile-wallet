import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
// import SifirTxnList from '@elements/SifirTxnList';
//import SifirInvEntry from '@elements/TxnListItems/SifirInvEntry';
//import SifirTxnEntry from '@elements/TxnListItems/SifirTxnEntry';
//import SifirUnspentCoinEntry from '@elements/TxnListItems/SifirUnspentCoinEntry';
//import SifirWasabiTxnEntry from '@elements/TxnListItems/SifirWasabiTxnEntry';
import {Images, AppStyle, C} from '@common/index';
import moment from 'moment';
const SifirTransactionsTab = props => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const {headerText, filterMap = [], txnData, renderItem} = props;
  const [tabData, setTabData] = useState([]);
  const [appliedFilter, setAppliedFilter] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  // FIXME move this one level up OR action ?
  // This should all be part of action to standarize wallet into having the sam
  // timestamp
  // id
  // type
  // if we standarize data at the action leve, then this componenet can take ownership of sorting
  // We can pretty much move all SifirTxnList into here as a memo
  //const processData = async (data, start = 0, length = 20) => {
  //  const dataForTab = typeof data === 'function' ? await data() : data;
  //  switch (type) {
  //    case C.STR_WASABI_WALLET_TYPE:
  //      return [...(dataForTab?.transactions || [])]
  //        .sort((a, b) => moment(b.datetime).diff(moment(a.datetime)))
  //        .slice(start, length);
  //    case C.STR_UNSPENT_COINS:
  //      return [...(dataForTab?.unspentCoins || [])].slice(start, length);
  //    case C.STR_LN_WALLET_TYPE:
  //      /// FIXME now that we store and cache this, can we just have the DB bring us back the sorted result ?
  //      return [...(dataForTab?.invoices || []), ...(dataForTab?.pays || [])]
  //        .filter(txn => txn && txn?.decodedBolt11?.timestamp > 1)
  //        .sort((a, b) => b.decodedBolt11.timestamp - a.decodedBolt11.timestamp)
  //        .slice(start, length);
  //    case C.STR_SPEND_WALLET_TYPE:
  //      return dataForTab;
  //    case C.STR_WATCH_WALLET_TYPE:
  //      return dataForTab;
  //  }
  //};
  // fetch data on init
  useEffect(() => {
    setTabData(txnData);
  }, [txnData]);
  // auto Filter on new data refresh
  useEffect(() => {
    if (!tabData?.length || !filterMap?.length) {
      return;
    }
    const {cb, title} = filterMap.find(
      ({title: mapFilterTitle}) => mapFilterTitle === appliedFilter,
    ) || {cb: null, title: null};
    handleOnFilter({cb, title});
  }, [tabData]);

  const handleOnFilter = ({cb, title}) => {
    setAppliedFilter(title);
    // TODO
    if (title === null) {
      setFilteredData(tabData);
      return;
    }
    const filterMapData = cb(tabData);
    setFilteredData(filterMapData);
  };
  //const SifirFilteredTxns = useMemo(
  //  txns => (
  //    <FlatList
  //      data={txns}
  //      extraData={txns}
  //      keyExtractor={(item, index) =>
  //        item?.bolt11 + item?.txid + index + item.tx
  //      }
  //      renderItem={renderItem}
  //    />
  //  ),
  //  [filteredData],
  //);
  return (
    <View style={styles.container}>
      {!!filterMap?.length && (
        <View style={styles.headerRow}>
          {/* TODO make this toucableopacity that resets filter*/}
          <Text style={styles.txnLblTxt}>
            {headerText} - {appliedFilter || ''}
          </Text>
          <TouchableOpacity
            onPress={() => setShowContextMenu(!showContextMenu)}>
            <Image source={Images.filter_icon} />
          </TouchableOpacity>
        </View>
      )}
      {showContextMenu && (
        <View style={styles.filterPopupContainer}>
          {filterMap.map(({title, cb}, index) => (
            <>
              <TouchableOpacity
                style={styles.popupListItem}
                onPress={() => handleOnFilter({cb, title})}>
                <Text style={styles.listItemLabel}>{title}</Text>
              </TouchableOpacity>
              {index < filterMap.length - 1 ? (
                <View style={styles.seperator} />
              ) : (
                []
              )}
            </>
          ))}
        </View>
      )}
      <FlatList
        data={filteredData}
        extraData={filteredData}
        keyExtractor={(item, index) =>
          item?.bolt11 + item?.txid + index + item.tx
        }
        renderItem={renderItem}
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
export default SifirTransactionsTab;
