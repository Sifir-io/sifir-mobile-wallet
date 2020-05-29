import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {Images, AppStyle, C} from '@common/index';
import {getWalletDetails} from '@actions/btcwallet';
import {getLnWalletDetails} from '@actions/lnWallet';
import {getUnspentCoins, getTxns as wasabiGetTxns} from '@actions/wasabiWallet';
import SifirAccountHeader from '@elements/SifirAccountHeader';
import SifirAccountChart from '@elements/SifirAccountChart';
import SifirAccountActions from '@elements/SifirAccountActions';
import SifirAccountHistory, {sheetHeight} from '@elements/SifirAccountHistory';
import SifirSettingModal from '@elements/SifirSettingModal';
import {ErrorScreen} from '@screens/error';
import debounce from '../../../helpers/debounce';
class SifirAccountScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  state = {
    balance: 0,
    txnData: [],
    isVisibleSettingsModal: false,
    anonset: 0,
    bottomExtraSpace: sheetHeight,
    showAccountHistory: false,
  };
  stopLoading = null;

  async _loadWalletFromProps() {
    const {label, type} = this.props.route.params.walletInfo;
    switch (type) {
      case C.STR_LN_WALLET_TYPE:
        let {balance, txnData} = await this.props.getLnWalletDetails({label});
        this.setState({balance, txnData});
        break;
      case C.STR_SPEND_WALLET_TYPE:
        let {
          balance: walletBalance,
          txnData: walletTxnData,
        } = await this.props.getWalletDetails({
          label,
          type,
        });
        this.setState({balance: walletBalance, txnData: walletTxnData});
        break;
      case C.STR_WASABI_WALLET_TYPE:
        const {unspentcoins: unspentCoins} = await this.props.getUnspentCoins();
        this.setState({txnData: {unspentCoins}});
        break;
    }
  }

  componentDidMount() {
    const {_loadWalletFromProps} = this;
    this.stopLoading = this.props.navigation.addListener(
      'focus',
      _loadWalletFromProps.bind(this),
    );
  }

  componentWillUnmount() {
    this.stopLoading();
  }
  toggleSettingsModal() {
    this.setState({isVisibleSettingsModal: !this.state.isVisibleSettingsModal});
  }

  handleReceiveButton = () => {
    const {walletInfo} = this.props.route.params;
    this.props.navigation.navigate('BtcReceiveTxn', {walletInfo});
  };

  handleSendBtn = () => {
    const {walletInfo} = this.props.route.params;
    const {type} = walletInfo;
    const {balance} = this.state;
    switch (type) {
      case C.STR_LN_WALLET_TYPE:
        this.props.navigation.navigate('LNPayInvoiceRoute', {
          screen: 'LnScanBolt',
          params: {walletInfo: {...walletInfo, balance}},
        });
        break;
      case C.STR_WASABI_WALLET_TYPE:
        this.props.navigation.navigate('GetAddress', {
          walletInfo: {...walletInfo, balance, anonset: this.state.anonset},
        });
        break;
      default:
        this.props.navigation.navigate('GetAddress', {
          walletInfo: {...walletInfo, balance},
        });
        break;
    }
  };

  handleChartSlider = data =>
    debounce(
      ({anonset, value}) =>
        this.setState({anonset: Math.floor(anonset), balance: value}),
      3,
    );
  onExtraSpaceLayout = event => {
    // Toggle SifirAccountHistory visibility to force reRender it to reposition at the bottom.
    this.setState({showAccountHistory: false});
    const {height} = event.nativeEvent.layout;
    this.setState({bottomExtraSpace: height, showAccountHistory: true});
  };

  render() {
    const {balance, txnData, anonset, bottomExtraSpace} = this.state;
    const {navigate} = this.props.navigation;
    const {walletInfo} = this.props.route.params;
    const {label, type} = walletInfo;
    const {loading, loaded, error: errorBtc} = this.props.btcWallet;
    const {
      loading: loadingLN,
      loaded: loadedLN,
      error: errorLN,
    } = this.props.lnWallet;
    const isLoading = type === C.STR_LN_WALLET_TYPE ? loadingLN : loading;
    const isLoaded = type === C.STR_LN_WALLET_TYPE ? loadedLN : loaded;
    const hasError = type === C.STR_LN_WALLET_TYPE ? errorLN : errorBtc;
    const {toggleSettingsModal} = this;
    let accountIcon,
      accountIconOnPress,
      accountHeaderText,
      accountTransactionHeaderText,
      btcUnit,
      chartData = null,
      settingModalProps = {};
    switch (type) {
      case C.STR_LN_WALLET_TYPE:
        accountIcon = Images.icon_light;
        accountIconOnPress = toggleSettingsModal.bind(this);
        accountHeaderText = C.STR_Balance_Channels_n_Outputs;
        accountTransactionHeaderText = C.STR_INVOICES_AND_PAYS;
        settingModalProps = {
          toolTipStyle: false,
          showOpenChannel: true,
          showTopUp: true,
          showWithdraw: true,
        };
        btcUnit = C.STR_MSAT;
        break;
      case C.STR_WASABI_WALLET_TYPE:
        accountIcon = Images.icon_wasabi;
        accountIconOnPress = toggleSettingsModal.bind(this);
        accountHeaderText = C.STR_Wasabi_Header + anonset;
        accountTransactionHeaderText = C.STR_ALL_TRANSACTIONS;
        btcUnit = C.STR_SAT;
        chartData = txnData?.unspentCoins;
        // settingModalProps = {anonsetSettingEnabled: true};
        break;
      default:
        accountHeaderText = C.STR_Cur_Balance;
        accountIcon = Images.icon_bitcoin;
        accountIconOnPress = () => {};
        accountTransactionHeaderText = C.STR_TRANSACTIONS;
        btcUnit = C.STR_BTC;
    }

    if (hasError) {
      return (
        <ErrorScreen
          title={C.STR_ERROR_btc_action}
          desc={C.STR_ERROR_account_screen}
          error={hasError}
          actions={[
            {
              text: C.STR_TRY_AGAIN,
              onPress: () => this._loadWalletFromProps(),
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
            {this.state.isVisibleSettingsModal && (
              <View
                style={styles.settingMenuContainer}
                onTouchEnd={() => {
                  toggleSettingsModal.bind(this);
                }}>
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
                handleChartSlider={this.handleChartSlider()}
              />
            )}
            <SifirAccountActions
              navigate={navigate}
              type={type}
              label={label}
              walletInfo={walletInfo}
              handleReceiveButton={
                // TODO update this when invoices done
                type === C.STR_LN_WALLET_TYPE ? null : this.handleReceiveButton
              }
              handleSendBtn={
                // For now only watching wallets cant send
                type === C.STR_WATCH_WALLET_TYPE ? null : this.handleSendBtn
              }
            />
          </View>
          <View style={styles.extraSpace} onLayout={this.onExtraSpaceLayout} />
        </View>
        {this.state.showAccountHistory && (
          <SifirAccountHistory
            loading={isLoading}
            loaded={isLoaded}
            type={type}
            txnData={txnData}
            btcUnit={btcUnit}
            headerText={accountTransactionHeaderText}
            bottomExtraSpace={bottomExtraSpace}
          />
        )}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    btcWallet: state.btcWallet,
    lnWallet: state.lnWallet,
    wasabiWallet: state.wasabiWallet,
  };
};

const mapDispatchToProps = {
  getWalletDetails,
  getLnWalletDetails,
  getUnspentCoins,
  wasabiGetTxns,
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
