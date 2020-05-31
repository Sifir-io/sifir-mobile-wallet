/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {View, Image, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import SifirTransactions from '@elements/SifirTransactions';
import SifirUnspentCoinsList from '@elements/SifirUnspentCoinsList';

import BottomSheet from 'reanimated-bottom-sheet';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {ScrollView} from 'react-native-gesture-handler';

export const sheetHeight = C.SCREEN_HEIGHT - 150;
const BTN_WIDTH = C.SCREEN_WIDTH / 2;
const initialSnap = C.SCREEN_HEIGHT * 0.35;
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
  bottomExtraSpace,
}) => {
  const [index, setIndex] = useState(0);
  const [filteredTxns, setFilteredTxns] = useState(txnData);
  const [routes] = useState([
    {key: 'transactions', title: 'Transactions'},
    {key: 'unspentCoins', title: 'Unspent Coins'},
    {key: 'labeledAddress', title: 'Labeled Addresses'},
  ]);
  useEffect(() => {
    setFilteredTxns(txnData);
  }, [txnData]);

  const filterWasabiTxnData = filter => {
    if (type === C.STR_WASABI_WALLET_TYPE && txnData?.transactions?.length) {
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
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <SifirTransactions
          txnData={filteredTxns}
          type={type}
          unit={btcUnit}
          height={200}
          headerText={headerText}
          filterWasabiTxnData={filterWasabiTxnData}
        />
      </ScrollView>
    );
  }, [txnData, filteredTxns]);

  const UnspentCoins = useCallback(
    () => (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <SifirUnspentCoinsList txnData={txnData} unit={btcUnit} />
      </ScrollView>
    ),
    [txnData],
  );
  const LabeledAddresses = useCallback(
    () => (
      // TODO create SifirLabeledAddresses component like SifirTransactions
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <SifirTransactions
          txnData={filteredTxns}
          type={type}
          unit={btcUnit}
          width={BTN_WIDTH * 2 - 50}
          height={200}
          headerText={headerText}
          filterWasabiTxnData={filterWasabiTxnData}
        />
      </ScrollView>
    ),
    [txnData],
  );
  const renderScene = useMemo(
    () =>
      SceneMap({
        transactions: Transactions,
        unspentCoins: UnspentCoins,
        labeledAddress: LabeledAddresses,
      }),
    [filteredTxns],
  );
  return (
    <BottomSheet
      snapPoints={[
        sheetHeight,
        bottomExtraSpace > 100 ? bottomExtraSpace - 20 : initialSnap,
      ]}
      initialSnap={1}
      enabledInnerScrolling={true}
      enabledGestureInteraction={true}
      renderContent={() => (
        <View
          style={{
            height: sheetHeight,
          }}>
          <View style={styles.headerContainer}>
            {!loading && (
              <Image source={Images.upArrow} style={styles.settingIcon} />
            )}
            {loading && (
              <ActivityIndicator
                style={styles.spinner}
                color={AppStyle.mainColor}
              />
            )}
          </View>
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
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: AppStyle.tertiaryColor,
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
    backgroundColor: AppStyle.tertiaryColor,
  },
});

export default SifirAccountHistory;
