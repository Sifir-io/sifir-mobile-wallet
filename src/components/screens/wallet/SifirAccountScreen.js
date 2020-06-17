import React, {useState, useEffect, useMemo} from 'react';
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
  const [txnData, setTxnData] = useState([]);
  const [isVisibleSettingsModal, setIsVisibleSettingsModal] = useState(false);
  const [anonset, setAnonset] = useState(0);
  const [bottomExtraSpace, setBottomExtraSpace] = useState(sheetHeight);
  const [showAccountHistory, setShowAccountHistory] = useState(false);
  const navigation = useNavigation();
  const {walletInfo} = props.route.params;
  const {navigate} = navigation;

  const _loadWalletFromProps = async () => {
    const {label, type} = walletInfo;
    switch (type) {
      case C.STR_LN_WALLET_TYPE:
        let {balance, txnData} = await props.getLnWalletDetails({label});
        setBalance(balance);
        setTxnData(txnData);
        setShowAccountHistory(true);
        break;
      case C.STR_SPEND_WALLET_TYPE:
      case C.STR_WATCH_WALLET_TYPE:
        let {
          balance: walletBalance,
          txnData: walletTxnData,
        } = await props.getWalletDetails({
          label,
          type,
        });
        setBalance(walletBalance);
        setTxnData(walletTxnData);
        setShowAccountHistory(true);
        break;
      case C.STR_WASABI_WALLET_TYPE:
        // TODO move loading txns to tab change
        const [{unspentcoins: unspentCoins}] = await Promise.all([
          props.getUnspentCoins(),
          props.wasabiGetTxns(),
        ]);
        setTxnData({unspentCoins});
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

  const handleChartSlider = data =>
    debounce(({anonset, value}) => {
      setAnonset(Math.floor(anonset));
      setBalance(value);
    }, 1);
  const onExtraSpaceLayout = event => {
    const {height} = event.nativeEvent.layout;
    setBottomExtraSpace(height);
  };

  const {label, type} = walletInfo;
  const {
    isLoading,
    isLoaded,
    hasError,
    accountIcon,
    accountIconOnPress,
    accountHeaderText,
    accountTransactionHeaderText,
    accountActionSendLabel = C.STR_SEND,
    btcUnit,
    chartData = null,
    dataMap,
    filterMap,
    settingModalProps = {},
  } = useMemo(() => {
    console.log('USEMEM');
    switch (type) {
      case C.STR_LN_WALLET_TYPE:
        return {
          isLoading: props.lnWallet.loading,
          isLoaded: props.lnWallet.loaded,
          hasError: props.lnWallet.error,
          accountIcon: Images.icon_light,
          accountIconOnPress: toggleSettingsModal.bind(this),
          accountHeaderText: C.STR_Balance_Channels_n_Outputs,
          accountTransactionHeaderText: C.STR_INVOICES_AND_PAYS,
          settingModalProps: {
            toolTipStyle: false,
            showOpenChannel: true,
            showTopUp: true,
            showWithdraw: true,
          },
          btcUnit: C.STR_MSAT,
          accountActionSendLabel: 'Pay Invoice',
          dataMap: [
            // FIXME key strings
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
            //{
            //  key: C.STR_UNSPENT_COINS,
            //  title: 'Unspent Coins',
            //  data: props.wasabiWallet.unspentCoinsList?.unspentcoins,
            //},
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
          isLoading: props.wasabiWallet.loading,
          isLoaded: props.wasabiWallet.loaded,
          hasError: props.wasabiWallet.error,
          accountIcon: Images.icon_wasabi,
          accountIconOnPress: toggleSettingsModal.bind(this),

          accountHeaderText: C.STR_Wasabi_Header + anonset,
          accountTransactionHeaderText: C.STR_ALL_TRANSACTIONS,
          btcUnit: C.STR_SAT,
          // only show chart when more than one unspentcoin
          chartData:
            txnData?.unspentCoins?.length > 1 ? txnData.unspentCoins : null,
          settingModalProps: {
            isLoading,
            menuItems: [
              {
                label: 'Auto Send: Disabled',
                onPress: () => {
                  toggleSettingsModal.apply(this);
                  navigate('WalletSelectMenu', {
                    onBackPress: () => {
                      navigation.pop();
                      toggleSettingsModal();
                    },
                    onConfirm: async ({
                      selectedWallet,
                      anonset: autoSpendAnonset,
                    }) => {
                      console.log(
                        'confirmed',
                        selectedWallet,
                        autoSpendAnonset,
                      );
                      await props.setWasabiAutoSpendWalletAndAnonset({
                        label: selectedWallet.label,
                        anonset: autoSpendAnonset,
                      });
                      Alert.alert(
                        `Auto Send To Wallet: ${props.getWasabiAutoSpendWallet()}`,
                        `Coins reaching An anonymity set of ${autoSpendAnonset} will be automagically sent to your wallet: ${
                          selectedWallet.label
                        } - ${selectedWallet.desc}.`,
                      );
                      navigation.pop();
                      toggleSettingsModal();
                    },
                    walletList: props.btcWallet.btcWalletList?.filter(
                      ({type: walletType}) =>
                        walletType !== C.STR_WASABI_WALLET_TYPE,
                    ),
                    // FIXME this is a promise
                    autoSpendWallet: props.getWasabiAutoSpendWallet(),
                    autoSpendWalletMinAnonset: props.getWasabiAutoSpendMinAnonset(),
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
            // FIXME key strings
            {
              key: C.STR_WASABI_WALLET_TYPE,
              title: 'Transactions',
              data: props.wasabiWallet.txnsList?.transactions,
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
          accountHeaderText: C.STR_Cur_Balance,
          accountIcon: Images.icon_bitcoin,
          accountIconOnPress: () => {},
          accountTransactionHeaderText: C.STR_TRANSACTIONS,
          btcUnit: C.STR_BTC,
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
  }, [txnData, balance, walletInfo]);
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
              handleChartSlider={handleChartSlider()}
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
          />
        </View>
        <View style={styles.extraSpace} onLayout={onExtraSpaceLayout} />
      </View>
      {showAccountHistory && (
        <SifirAccountHistoryTabs
          loading={isLoading}
          loaded={isLoaded}
          type={type}
          filterMap={filterMap}
          dataMap={dataMap}
          txnData={txnData}
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
