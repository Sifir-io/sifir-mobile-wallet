/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useMemo} from 'react';
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
import {ScrollView} from 'react-native-gesture-handler';

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
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'transactions', title: 'Transactions'},
    {key: 'unspentCoins', title: 'Unspent Coins'},
    {key: 'labeledAddress', title: 'Labeled Addresses'},
  ]);

  const Transactions = useCallback(
    () => (
      // TODO should not be wrapped inside scrollview
      <ScrollView>
        <Text style={styles.txnLblTxt}>{headerText}</Text>
        {/* TODO filter data for Transactions tab */}

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
    [txnData.length],
  );
  return (
    <BottomSheet
      snapPoints={[sheetHeight, C.SCREEN_HEIGHT * 0.16]}
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
  );
};

const styles = StyleSheet.create({
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
});

export default SifirAccountHistory;
