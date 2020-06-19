import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {Images, AppStyle, C} from '@common/index';
import {getWalletDetails} from '@actions/btcwallet';
import {getLnWalletDetails} from '@actions/lnWallet';
import {getUnspentCoins, getTxns as wasabiGetTxns} from '@actions/wasabiWallet';
import {
  getWasabiAutoSpendWallet,
  setWasabiAutoSpendWalletAndAnonset,
  getWasabiAutoSpendMinAnonset,
} from '@actions/cnClient';
import SifirAccountHeader from '@elements/SifirAccountHeader';
import SifirAccountChart from '@elements/SifirAccountChart';
import SifirAccountActions from '@elements/SifirAccountActions';
import SifirAccountHistoryTabs, {
  sheetHeight,
} from '@structures/SifirAccountHistoryTabs';
import SifirSettingModal from '@elements/SifirSettingModal';
import {ErrorScreen} from '@screens/error';
import debounce from '../../../helpers/debounce';

const SifirAccountScreen = props => {
  const [balance, setBalance] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(null);
  const [chartLoaded, setChartLoaded] = useState(true);
  const [isVisibleSettingsModal, setIsVisibleSettingsModal] = useState(false);
  const [anonset, setAnonset] = useState(0);
  const [bottomExtraSpace, setBottomExtraSpace] = useState(sheetHeight);
  const [showAccountHistory, setShowAccountHistory] = useState(false);
  const navigation = useNavigation();
  const {walletInfo} = props.route.params;
  const {navigate} = navigation;

  const _loadWalletFromProps = async () => {
    setDataLoaded(null);
    const {label, type} = walletInfo;
    switch (type) {
      case C.STR_LN_WALLET_TYPE:
        let {balance: lnBalance} = await props.getLnWalletDetails({label});
        setBalance(lnBalance);
        setDataLoaded({});
        setShowAccountHistory(true);
        break;
      case C.STR_SPEND_WALLET_TYPE:
      case C.STR_WATCH_WALLET_TYPE:
        let {balance: walletBalance} = await props.getWalletDetails({
          label,
          type,
        });
        setBalance(walletBalance);
        setDataLoaded({});
        setShowAccountHistory(true);
        break;
      case C.STR_WASABI_WALLET_TYPE:
        const [
          ,
          ,
          autoSpendWallet,
          autoSpendWalletMinAnonset,
        ] = await Promise.all([
          props.getUnspentCoins(),
          props.wasabiGetTxns(),
          props.getWasabiAutoSpendWallet(),
          props.getWasabiAutoSpendMinAnonset(),
        ]);
        setDataLoaded({autoSpendWallet, autoSpendWalletMinAnonset});
        setShowAccountHistory(true);
        //if (!state.showAccountHistory) {
        //  setTimeout(() => {
        //    setState({showAccountHistory: true});
        //  }, 100);
        //}
        break;
    }
  };
  useEffect(() => {
    _loadWalletFromProps();
  }, []);

  const toggleSettingsModal = () =>
    setIsVisibleSettingsModal(!isVisibleSettingsModal);

  const handleReceiveButton = () => {
    navigate('BtcReceiveTxn', {walletInfo});
  };

  const handleSendBtn = () => {
    const {type} = walletInfo;
    switch (type) {
      case C.STR_LN_WALLET_TYPE:
        navigate('LNPayInvoiceRoute', {
          screen: 'LnScanBolt',
          params: {walletInfo: {...walletInfo, balance}},
        });
        break;
      case C.STR_WASABI_WALLET_TYPE:
        navigate('GetAddress', {
          walletInfo: {...walletInfo, balance, anonset},
        });
        break;
      default:
        navigate('GetAddress', {
          walletInfo: {...walletInfo, balance},
        });
        break;
    }
  };

  const handleChartSlider = useCallback(
    debounce(({anonset, value}) => {
      console.log('anonset', value, anonset);
      setAnonset(Math.floor(anonset));
      setBalance(value);
      setChartLoaded(true);
    }, 1),
    [],
  );
  console.log('hadasd', handleChartSlider);
  const onExtraSpaceLayout = event => {
    const {height} = event.nativeEvent.layout;
    setBottomExtraSpace(height);
  };

  const {label, type} = walletInfo;

  // Account stuff that depends on data load, IE Function only changes on Walletinfo change but runs every update
  // const walletDataCb = useCallback(() => {
  const {
    isLoading = true,
    isLoaded = false,
    hasError = null,
    dataMap = [],
    filterMap = [],
    chartData = null,
    settingModalProps = {},
  } = useMemo(() => {
    if (!dataLoaded) {
      return {};
    }
    switch (type) {
      case C.STR_LN_WALLET_TYPE:
        return {
          isLoading: props.lnWallet.loading,
          isLoaded: props.lnWallet.loaded,
          hasError: props.lnWallet.error,
          settingModalProps: {
            toolTipStyle: false,
            showOpenChannel: true,
            showTopUp: true,
            showWithdraw: true,
          },
          dataMap: [
            {
              key: C.STR_LN_WALLET_TYPE,
              title: 'Invoices & Payments',
              data: [
                ...(props.lnWallet?.invoices || []),
                ...(props.lnWallet?.pays || []),
              ]
                .filter(txn => txn && txn?.decodedBolt11?.timestamp > 1)
                .sort(
                  (a, b) =>
                    b.decodedBolt11.timestamp - a.decodedBolt11.timestamp,
                ),
            },
            // TODO funds, channels
          ],
          filterMap: [
            {
              title: 'Invoices',
              cb: (data, param) => data.filter(txn => txn.type === 'invoice'),
            },
            {
              title: 'Payments',
              cb: (data, param) => data.filter(txn => txn.type === 'pay'),
            },
          ],
        };
      case C.STR_WASABI_WALLET_TYPE:
        return {
          isLoading:
            props.cyphernode.loading ||
            (props.wasabiWallet.loading && !chartLoaded),
          isLoaded: props.wasabiWallet.loaded && chartLoaded,
          hasError: props.wasabiWallet.error,
          chartData: props.wasabiWallet.unspentCoinsList?.unspentcoins?.length
            ? props.wasabiWallet.unspentCoinsList.unspentcoins
            : null,
          settingModalProps: {
            // isLoading: props.wasabiWallet.loading,
            menuItems: [
              {
                label: `Auto Send: ${
                  dataLoaded?.autoSpendWallet
                    ? dataLoaded.autoSpendWallet +
                      '(' +
                      dataLoaded?.autoSpendWalletMinAnonset +
                      ')'
                    : 'Disabled'
                }`,
                onPress: () => {
                  toggleSettingsModal.apply(this);
                  navigate('WalletSelectMenu', {
                    onBackPress: async ({
                      isSwitchOn,
                      selectedWallet,
                      anonSetValue,
                    }) => {
                      // if user toggled autospend off when it was on, then dispatch
                      if (!isSwitchOn && dataLoaded.autoSpendWallet) {
                        await props.setWasabiAutoSpendWalletAndAnonset({
                          label: null,
                        });
                        Alert.alert(
                          `Auto Send Disabled`,
                          `Auto spend has been disabled, coins will no longer be sent to your ${
                            dataLoaded.autoSpendWallet
                          } wallet`,
                        );
                        _loadWalletFromProps();
                      }
                      navigation.pop();
                      setIsVisibleSettingsModal(false);
                    },
                    onConfirm: async ({
                      selectedWallet,
                      anonset: autoSpendAnonset,
                    }) => {
                      await props.setWasabiAutoSpendWalletAndAnonset({
                        label: selectedWallet.label,
                        anonset: autoSpendAnonset,
                      });
                      _loadWalletFromProps();
                      Alert.alert(
                        `Auto Send To Wallet: ${selectedWallet.label}`,
                        `Coins reaching An anonymity set of ${autoSpendAnonset} will be automagically sent to your wallet: ${
                          selectedWallet.label
                        } - ${selectedWallet.desc}.`,
                      );
                      navigation.pop();
                      setIsVisibleSettingsModal(false);
                    },
                    walletList: props.btcWallet.btcWalletList?.filter(
                      ({type: walletType}) =>
                        walletType !== C.STR_WASABI_WALLET_TYPE,
                    ),
                    autoSpendWallet: dataLoaded?.autoSpendWallet,
                    autoSpendWalletMinAnonset:
                      dataLoaded?.autoSpendWalletMinAnonset,
                  });
                },
              },
            ],
          },
          filterMap: [
            {
              title: 'Recieved',
              cb: (data, param) => data.filter(txn => txn.amount > 0),
            },
            {
              title: 'Sent',
              cb: (data, param) => data.filter(txn => txn.amount < 0),
            },
          ],
          dataMap: [
            {
              key: C.STR_WASABI_WALLET_TYPE,
              title: 'Transactions',
              // TODO can we make this an FN call rather than data ? So we can call it later
              data: props.wasabiWallet.txnsList,
            },
            {
              key: C.STR_UNSPENT_COINS,
              title: 'Unspent Coins',
              data: props.wasabiWallet.unspentCoinsList?.unspentcoins,
            },
          ],
        };
      default:
        return {
          isLoading: props.btcWallet.loading,
          isLoaded: props.btcWallet.loaded,
          hasError: props.btcWallet.error,
          filterMap: [
            {
              title: 'Recieved',
              cb: (data, param) =>
                data.filter(txn => {
                  return txn.amount > 0;
                }),
            },
            {
              title: 'Sent',
              cb: (data, parma) =>
                data.filter(txn => {
                  return txn.amount < 0;
                }),
            },
          ],
          dataMap: [
            {
              key: type,
              title: 'Transactions',
              data: props.btcWallet.txnData,
            },
          ],
        };
    }
  }, [dataLoaded]);
  // Aâccount data that is more static, IE values only need to be re-evaluated on walletInfo change
  const {
    accountIcon,
    accountIconOnPress,
    accountHeaderText,
    accountTransactionHeaderText,
    accountActionSendLabel = C.STR_SEND,
    btcUnit,
  } = useMemo(() => {
    switch (type) {
      case C.STR_LN_WALLET_TYPE:
        return {
          accountIcon: Images.icon_light,
          accountIconOnPress: toggleSettingsModal.bind(this),
          accountHeaderText: C.STR_Balance_Channels_n_Outputs,
          accountTransactionHeaderText: C.STR_INVOICES_AND_PAYS,
          btcUnit: C.STR_MSAT,
          accountActionSendLabel: 'Pay Invoice',
        };
      case C.STR_WASABI_WALLET_TYPE:
        return {
          accountIcon: Images.icon_wasabi,
          accountIconOnPress: toggleSettingsModal.bind(this),
          accountHeaderText: C.STR_Wasabi_Header + anonset,
          accountTransactionHeaderText: C.STR_ALL_TRANSACTIONS,
          btcUnit: C.STR_SAT,
          // only show chart when more than one unspentcoin
        };
      default:
        return {
          accountHeaderText: C.STR_Cur_Balance,
          accountIcon: Images.icon_bitcoin,
          accountIconOnPress: () => {},
          accountTransactionHeaderText: C.STR_TRANSACTIONS,
          btcUnit: C.STR_BTC,
        };
    }
  }, [walletInfo, anonset]);
  if (hasError) {
    return (
      <ErrorScreen
        title={C.STR_ERROR_btc_action}
        desc={C.STR_ERROR_account_screen}
        error={hasError}
        actions={[
          {
            text: C.STR_TRY_AGAIN,
            onPress: () => _loadWalletFromProps(),
          },
          {
            text: C.STR_GO_BACK,
            onPress: () => navigate('AccountList'),
          },
        ]}
      />
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.SVcontainer}>
      <View
        style={[
          styles.mainView,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            paddingBottom: bottomExtraSpace < 100 ? sheetHeight / 1.9 : 0,
          },
        ]}>
        <View>
          <View style={styles.navBtn}>
            <TouchableOpacity>
              <View
                style={styles.backNavView}
                onTouchEnd={() => navigate('AccountList')}>
                <Image source={Images.icon_back} style={styles.backImg} />
                <Text style={styles.backNavTxt}>{C.STR_My_Wallets}</Text>
              </View>
            </TouchableOpacity>
          </View>
          {isVisibleSettingsModal && (
            <View
              style={styles.settingMenuContainer}
              onTouchEnd={toggleSettingsModal}>
              <SifirSettingModal
                hideModal={toggleSettingsModal.bind(this)}
                {...settingModalProps}
                walletInfo={{...walletInfo, balance}}
              />
            </View>
          )}
          <SifirAccountHeader
            accountIcon={accountIcon}
            accountIconOnPress={accountIconOnPress}
            loading={isLoading}
            loaded={isLoaded}
            type={type}
            label={label}
            balance={balance}
            btcUnit={btcUnit}
            headerText={accountHeaderText}
          />
          {!!chartData && (
            <SifirAccountChart
              chartData={chartData}
              handleChartSlider={handleChartSlider}
            />
          )}
          <SifirAccountActions
            navigate={navigate}
            type={type}
            label={label}
            walletInfo={walletInfo}
            handleReceiveButton={
              // TODO update this when invoices done
              type === C.STR_LN_WALLET_TYPE ? null : handleReceiveButton
            }
            handleSendBtn={
              // For now only watching wallets cant send
              type === C.STR_WATCH_WALLET_TYPE ? null : handleSendBtn
            }
            sendActionButtonLabel={accountActionSendLabel}
            isDisabled={isLoading}
          />
        </View>
        {/* TODO fix this hack to  Calculate initial snap position to HistoryTabs - Load it when nochartdata or when chart and is loaded */}
        {(!chartData || (!!chartData && chartLoaded)) && (
          <View style={styles.extraSpace} onLayout={onExtraSpaceLayout} />
        )}
      </View>
      {showAccountHistory && (
        <SifirAccountHistoryTabs
          loading={isLoading}
          loaded={isLoaded}
          type={type}
          filterMap={filterMap}
          dataMap={dataMap}
          btcUnit={btcUnit}
          headerText={accountTransactionHeaderText}
          bottomExtraSpace={bottomExtraSpace}
        />
      )}
    </ScrollView>
  );
};

const mapStateToProps = state => {
  return {
    btcWallet: state.btcWallet,
    lnWallet: state.lnWallet,
    wasabiWallet: state.wasabiWallet,
    cyphernode: state.cyphernode,
  };
};

const mapDispatchToProps = {
  getWalletDetails,
  getLnWalletDetails,
  getUnspentCoins,
  wasabiGetTxns,
  getWasabiAutoSpendWallet,
  getWasabiAutoSpendMinAnonset,
  setWasabiAutoSpendWalletAndAnonset,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirAccountScreen);

const styles = StyleSheet.create({
  navBtn: {
    marginBottom: 10,
  },
  extraSpace: {
    flexGrow: 1,
  },
  SVcontainer: {
    backgroundColor: AppStyle.backgroundColor,
    flexGrow: 1,
  },
  mainView: {
    flex: 1,
    backgroundColor: '#091110',
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  backNavView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 7,
    marginLeft: 13,
  },
  backNavTxt: {
    fontFamily: AppStyle.mainFontBold,
    fontSize: 15,
    color: 'white',
    marginLeft: 5,
  },
  backImg: {
    width: 15,
    height: 15,
    marginLeft: 10,
    marginTop: 2,
  },

  satTxt: {
    color: 'white',
    fontSize: 26,
    fontFamily: AppStyle.mainFont,
    textAlignVertical: 'bottom',
    marginBottom: 7,
    marginLeft: 5,
  },
  settingMenuContainer: {
    position: 'absolute',
    paddingTop: 80,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    elevation: 10,
    zIndex: 10,
  },
});
