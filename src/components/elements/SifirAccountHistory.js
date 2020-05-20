/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import SifirTxnList from '@elements/SifirTxnList';
import BottomSheet from 'reanimated-bottom-sheet';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

const BTN_WIDTH = C.SCREEN_WIDTH / 2;
const sheetHeight = C.SCREEN_HEIGHT - 150;
const initialLayout = {width: C.SCREEN_WIDTH};
const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={styles.tabIndicator}
    indicatorContainerStyle={styles.tabIndicatorContainerStyle}
    style={styles.tabBar}
    renderLabel={label => (
      <Text
        style={[
          styles.tabTitleLabel,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            color: label.focused ? AppStyle.mainColor : AppStyle.grayColor,
            opacity: label.focused ? 1 : 0.55,
          },
        ]}
        numberOfLines={1}>
        {label.route.title}
      </Text>
    )}
  />
);

const SifirAccountHistory = ({
  loading,
  loaded,
  txnData,
  btcUnit,
  type,
  headerText,
}) => {
  if (type === C.STR_WASABI_WALLET_TYPE) {
    txnData = {
      instanceId: null,
      transactions: [
        {
          datetime: '2020-04-23T18:10:36+00:00',
          height: 1721643,
          amount: 340000,
          label: 'mytest',
          tx:
            '220850ec4d8a8daf6ebe9e74f4ab29ffca3392ff03a081c4915a83cb56b9e0e5',
        },
        {
          datetime: '2020-04-23T18:19:15+00:00',
          height: 1721644,
          amount: 69,
          label: '',
          tx:
            'cbef19761d3cb0289219558546b9780daf014b4ccaa514b1899f3078b0e9041c',
        },
        {
          datetime: '2020-04-23T19:34:11+00:00',
          height: 1721652,
          amount: 1000000,
          label: 'unknown',
          tx:
            '555d8c8113a7c279e2187e6d9dbd68d37068dee33107423e4c633861aefd1d4d',
        },
        {
          datetime: '2020-04-23T19:41:43+00:00',
          height: 1721654,
          amount: -258,
          label: 'Test label',
          tx:
            '2774f213412284720b0f91055aa6e7f605dacd60ead2feb2ff61dd47f90a71b7',
        },
        {
          datetime: '2020-04-23T19:41:43+00:00',
          height: 1721654,
          amount: -236,
          label: 'BY hamza',
          tx:
            '2e8b72cbc82b54e2610e3dd8a720257dfab1a42df80c883cb54041519446dfc8',
        },
        {
          datetime: '2020-04-23T19:41:43+00:00',
          height: 1721654,
          amount: -267,
          label: '',
          tx:
            '90cb834af185e3d926e9c91b9ac3f7d6a72bb0a2099d3b8a7e86de9c6020e174',
        },
      ],
    };
  }

  const [index, setIndex] = useState(0);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [filteredTxns, setFilteredTxns] = useState(txnData);
  const [routes] = useState([
    {key: 'transactions', title: 'Transactions'},
    {key: 'unspentCoins', title: 'Unspent Coins'},
    {key: 'labeledAddress', title: 'Labeled Addresses'},
  ]);
  const filterData = filter => {
    if (type === C.STR_WASABI_WALLET_TYPE) {
      const tempTxnData = {...txnData};
      if (filter === 'received') {
        const receivedTxns = tempTxnData.transactions.filter(txn => {
          return txn.amount > 0;
        });
        tempTxnData.transactions = receivedTxns;
        setFilteredTxns(tempTxnData);
      } else if (filter === 'sent') {
        const sentTxns = tempTxnData.transactions.filter(txn => {
          return txn.amount < 0;
        });
        tempTxnData.transactions = sentTxns;
        setFilteredTxns(tempTxnData);
      } else {
        setFilteredTxns(txnData);
      }
    } else {
      setFilteredTxns(txnData);
    }
  };
  const Transactions = useCallback(() => {
    // TODO should not be wrapped inside scrollview
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
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
              onPress={() => filterData('all')}>
              <Text style={styles.listItemLabel}>All</Text>
            </TouchableOpacity>
            <View style={styles.seperator} />
            <TouchableOpacity
              style={styles.popupListItem}
              onPress={() => filterData('received')}>
              <Text style={styles.listItemLabel}>Received</Text>
            </TouchableOpacity>
            <View style={styles.seperator} />
            <TouchableOpacity
              style={styles.popupListItem}
              onPress={() => filterData('sent')}>
              <Text style={styles.listItemLabel}>Sent</Text>
            </TouchableOpacity>
          </View>
        )}
        <SifirTxnList
          txnData={filteredTxns}
          type={type}
          unit={btcUnit}
          width={BTN_WIDTH * 2 - 50}
          height={200}
        />
      </ScrollView>
    );
  }, [txnData, showContextMenu, filteredTxns]);

  const UnspentCoins = useCallback(
    () => (
      // TODO should not be wrapped inside scrollview
      <ScrollView>
        <Text style={styles.txnLblTxt}>Unspent Coins</Text>
        {/* TODO filter data for Unspent */}
        <SifirTxnList
          txnData={txnData}
          type={type}
          unit={btcUnit}
          width={BTN_WIDTH * 2 - 50}
          height={200}
        />
      </ScrollView>
    ),
    [txnData.length],
  );
  const LabeledAddresses = useCallback(
    () => (
      // TODO should not be wrapped inside scrollview
      <ScrollView>
        <Text style={styles.txnLblTxt}>Labeled Addresses</Text>
        {/* TODO filter data for LabeledAddresses */}
        <SifirTxnList
          txnData={txnData}
          type={type}
          unit={btcUnit}
          width={BTN_WIDTH * 2 - 50}
          height={200}
        />
      </ScrollView>
    ),
    [txnData.length],
  );
  const renderScene = useMemo(
    () =>
      SceneMap({
        transactions: Transactions,
        unspentCoins: UnspentCoins,
        labeledAddress: LabeledAddresses,
      }),
    [filteredTxns, showContextMenu],
  );
  return (
    <View style={styles.container}>
      <BottomSheet
        snapPoints={[sheetHeight, C.SCREEN_HEIGHT * 0.3]}
        initialSnap={1}
        enabledInnerScrolling={true}
        enabledGestureInteraction={true}
        renderHeader={() => (
          <View style={styles.headerContainer}>
            {!loading && (
              <Image source={Images.arrowupArrow} style={styles.settingIcon} />
            )}
            {loading && (
              <ActivityIndicator
                style={styles.spinner}
                color={AppStyle.mainColor}
              />
            )}
          </View>
        )}
        renderContent={() => (
          <View
            style={{
              height: sheetHeight - 40,
              backgroundColor: AppStyle.mainColor,
            }}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={renderTabBar}
              lazy={false}
              sceneContainerStyle={styles.sceneContainer}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {height: C.SCREEN_HEIGHT * 0.3, bottom: -25},
  txnLblTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },
  txnListView: {
    flex: 3,
    height: '100%',
    marginBottom: 20,
    marginLeft: 25,
  },
  settingIcon: {width: 20, height: 20, marginLeft: 20, marginTop: 7},
  spinner: {alignSelf: 'center'},
  headerContainer: {
    backgroundColor: '#122C3A',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  tabTitleLabel: {fontWeight: 'bold'},
  sceneContainer: {
    backgroundColor: AppStyle.secondaryColor,
    paddingHorizontal: 20,
  },
  tabIndicatorContainerStyle: {
    borderBottomColor: AppStyle.grayColor,
    borderBottomWidth: 3,
    opacity: 0.5,
  },
  tabIndicator: {
    backgroundColor: AppStyle.mainColor,
    bottom: -2,
  },
  tabBar: {
    backgroundColor: AppStyle.secondaryColor,
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

export default SifirAccountHistory;
