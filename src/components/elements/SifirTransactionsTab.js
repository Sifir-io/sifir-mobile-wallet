import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
const SifirTransactionsTab = props => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const {headerText, filterMap = [], txnData, renderItem} = props;
  const [tabData, setTabData] = useState([]);
  const [appliedFilter, setAppliedFilter] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

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
  const SifirFilteredTxns = useMemo(
    () => (
      <FlatList
        data={filteredData}
        extraData={filteredData}
        keyExtractor={(item, index) =>
          item?.bolt11 + item?.txid + index + item.tx
        }
        renderItem={renderItem}
      />
    ),
    [filteredData],
  );
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
      {SifirFilteredTxns}
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
