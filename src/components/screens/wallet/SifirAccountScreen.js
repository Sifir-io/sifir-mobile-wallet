import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {connect} from 'react-redux';
import {Images, AppStyle, C} from '@common/index';
import {getWalletDetails} from '@actions/btcwallet';
import {getLnWalletDetails} from '@actions/lnWallet';
import SifirAccountHeader from '@elements/SifirAccountHeader';
import SifirAccountActions from '@elements/SifirAccountActions';
import SifirAccountHistory from '@elements/SifirAccountHistory';
import SifirSettingModal from '@elements/SifirSettingModal';
import {ErrorScreen} from '@screens/error';

class SifirAccountScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  state = {
    balance: 0,
    txnData: [],
    isVisibleSettingsModal: false,
  };
  stopLoading = null;

  async _loadWalletFromProps() {
    const {label, type} = this.props.route.params.walletInfo;
    if (type === C.STR_LN_WALLET_TYPE) {
      const {balance, txnData} = await this.props.getLnWalletDetails({label});
      this.setState({balance, txnData});
    } else {
      const {balance, txnData} = await this.props.getWalletDetails({
        label,
        type,
      });
      this.setState({balance, txnData});
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
    if (type === C.STR_LN_WALLET_TYPE) {
      this.props.navigation.navigate('LNPayInvoiceRoute', {
        screen: 'LnScanBolt',
        params: {walletInfo: {...walletInfo, balance}},
      });
    } else {
      this.props.navigation.navigate('GetAddress', {
        walletInfo: {...walletInfo, balance},
      });
    }
  };

  render() {
    const {balance, txnData} = this.state;
    const {navigate} = this.props.navigation;
    const {walletInfo} = this.props.route.params;
    const {label, type} = walletInfo;
    const {loading, loaded, error: errorBtc} = this.props.btcWallet;
    const {
      loading: loadingLN,
      loaded: loadedLN,
      error: errorLN,
    } = this.props.lnWallet;
    const btcUnit = type === C.STR_LN_WALLET_TYPE ? C.STR_MSAT : C.STR_BTC;
    const isLoading = type === C.STR_LN_WALLET_TYPE ? loadingLN : loading;
    const isLoaded = type === C.STR_LN_WALLET_TYPE ? loadedLN : loaded;
    const hasError = type === C.STR_LN_WALLET_TYPE ? errorLN : errorBtc;
    const {toggleSettingsModal} = this;
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
      <View style={styles.mainView}>
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
            onTouchEnd={toggleSettingsModal.bind(this)}>
            <SifirSettingModal
              toolTipStyle={false}
              hideModal={toggleSettingsModal.bind(this)}
              showOpenChannel={true}
              showTopUp={true}
              showWithdraw={true}
              walletInfo={{...walletInfo, balance}}
            />
          </View>
        )}
        <SifirAccountHeader
          accountIconOnPress={
            type === C.STR_LN_WALLET_TYPE
              ? toggleSettingsModal.bind(this)
              : () => {}
          }
          loading={isLoading}
          loaded={isLoaded}
          type={type}
          label={label}
          balance={balance}
          btcUnit={btcUnit}
          headerText={
            type === C.STR_LN_WALLET_TYPE
              ? C.STR_Balance_Channels_n_Outputs
              : C.STR_Cur_Balance
          }
        />
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
        <SifirAccountHistory
          loading={isLoading}
          loaded={isLoaded}
          type={type}
          txnData={txnData}
          btcUnit={btcUnit}
          headerText={
            type === C.STR_LN_WALLET_TYPE
              ? C.STR_INVOICES_AND_PAYS
              : C.STR_TRANSACTIONS
          }
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    btcWallet: state.btcWallet,
    lnWallet: state.lnWallet,
  };
};

const mapDispatchToProps = {
  getWalletDetails,
  getLnWalletDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirAccountScreen);

const styles = StyleSheet.create({
  navBtn: {flex: 0.7},
  mainView: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor,
    paddingTop: 10,
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
