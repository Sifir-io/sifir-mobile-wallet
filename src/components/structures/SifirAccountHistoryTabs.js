/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {View, Image, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import SifirTransactionsTab from '@elements/SifirTransactionsTab';
import BottomSheet from 'reanimated-bottom-sheet';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {ScrollView} from 'react-native-gesture-handler';
import SifirInvEntry from '@elements/TxnListItems/SifirInvEntry';
import SifirTxnEntry from '@elements/TxnListItems/SifirTxnEntry';
import SifirUnspentCoinEntry from '@elements/TxnListItems/SifirUnspentCoinEntry';
import SifirWasabiTxnEntry from '@elements/TxnListItems/SifirWasabiTxnEntry';

export const sheetHeight = C.SCREEN_HEIGHT - 150;
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

const SifirAccountHistoryTabs = ({
  loading,
  loaded,
  dataMap,
  filterMap,
  btcUnit,
  type,
  headerText,
  bottomExtraSpace,
}) => {
  const [index, setIndex] = useState(0);
  const [tabData, setTabData] = useState(null);
  //useEffect(() => {
  //  setTabData(txnData);
  //}, [txnData]);

  const onTabIndexChange = async ({}) => {
    setIndex(index);
  };
  const TransctionTabFactory = ({title, key, data}) => {
    let renderItem;
    switch (key) {
      case C.STR_WASABI_WALLET_TYPE:
        renderItem = txn => <SifirWasabiTxnEntry txn={txn} unit={btcUnit} />;
        break;
      case C.STR_UNSPENT_COINS:
        // FIXME rename to UTXO ?
        renderItem = txn => <SifirUnspentCoinEntry utxo={txn} unit={btcUnit} />;
        break;
      case C.STR_LN_WALLET_TYPE:
        renderItem = txn => <SifirInvEntry inv={txn} unit={btcUnit} />;
        break;
      case C.STR_SPEND_WALLET_TYPE:
        renderItem = txn => <SifirTxnEntry txn={txn} unit={btcUnit} />;
        break;
      case C.STR_WATCH_WALLET_TYPE:
        renderItem = txn => <SifirTxnEntry txn={txn} unit={btcUnit} />;
        break;
    }
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <SifirTransactionsTab
          txnData={data}
          headerText={title}
          filterMap={filterMap}
          renderItem={renderItem}
        />
      </ScrollView>
    );
  };
  const renderScene = useMemo(
    () =>
      SceneMap(
        dataMap.reduce((sceneDict, {key, title, data}) => {
          // FIXME useMemo on scene or on TranstabFac
          sceneDict[key] = TransctionTabFactory({key, title, data});
          return sceneDict;
        }, {}),
      ),
    [tabData],
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
              // TODO change upArrow to down arrow when slider is opened.
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
            navigationState={{
              index,
              routes: dataMap.map(({key, title}) => ({key, title})),
            }}
            renderScene={renderScene}
            onIndexChange={onTabIndexChange}
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

export default SifirAccountHistoryTabs;
