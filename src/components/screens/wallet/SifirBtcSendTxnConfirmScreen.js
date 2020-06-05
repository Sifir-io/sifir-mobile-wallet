import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  ScrollView,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import {sendBitcoin} from '@actions/btcwallet';
import {withdrawFunds} from '@actions/lnWallet';
import {spend as wasabiSpend} from '@actions/wasabiWallet';
import Overlay from 'react-native-modal-overlay';
import SifirSettingModal from '@elements/SifirSettingModal';
import {ErrorScreen} from '@screens/error';
import SifirBTCAmount from '@elements/SifirBTCAmount';

class SifirBtcSendTxnConfirmScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }
  onClose = () => this.setState({modalVisible: false});
  state = {
    btnStatus: 0,
    modalVisible: false,
  };

  withdrawFunds = async () => {
    const {
      txnInfo,
      walletInfo,
      walletInfo: {type},
    } = this.props.route.params;
    const {address, amount} = txnInfo;
    const sendResult = await this.props.withdrawFunds(address, amount);
    if (sendResult?.tx) {
      this.props.navigation.navigate('BtcTxnConfirmed', {
        txnInfo: {
          ...txnInfo,
          isSendTxn: true,
          amount,
          address,
        },
        sendResult,
        walletInfo,
        displayUnit: C.STR_MSAT,
        type,
      });
    }
  };

  sendBitcoin = async () => {
    const {txnInfo, walletInfo} = this.props.route.params;
    const {address, amount} = txnInfo;
    const btcSendResult = await this.props.sendBitcoin({address, amount});
    if (btcSendResult?.status === 'accepted') {
      this.props.navigation.navigate('BtcTxnConfirmed', {
        txnInfo: {...txnInfo, isSendTxn: true},
        sendResult: btcSendResult,
        walletInfo,
      });
    }
  };
  sendWasabi = async () => {
    const {txnInfo, walletInfo, anonset} = this.props.route.params;
    const {address, amount} = txnInfo;
    const sendResult = await this.props.wasabiSpend({
      address,
      amount,
      minanonset: anonset,
    });
    if (sendResult?.result?.txid) {
      this.props.navigation.navigate('BtcTxnConfirmed', {
        txnInfo: {...txnInfo, isSendTxn: true},
        sendResult,
        walletInfo,
      });
    }
  };

  handleSendBtn = () => {
    const {
      walletInfo: {type},
    } = this.props.route.params;
    switch (type) {
      case C.STR_LN_WITHDRAW:
        this.withdrawFunds();
        break;
      case C.STR_WASABI_WALLET_TYPE:
        this.sendWasabi();
        break;

      default:
        this.sendBitcoin();
        break;
    }
  };

  render() {
    const {
      walletInfo: {feeSettingEnabled, type},
      txnInfo: {address, amount, unit},
    } = this.props.route.params;
    const amountFontSize =
      (C.vw * 80) / (amount.length < 3 ? 5 : amount.length);
    const recTxtFontSize = (C.vw * 120) / address.length;
    let isLoading, hasError;
    switch (type) {
      case C.STR_LN_WITHDRAW:
        ({loading: isLoading, error: hasError} = this.props.lnWallet);
        break;
      case C.STR_WASABI_WALLET_TYPE:
        ({loading: isLoading, error: hasError} = this.props.wasabiWallet);
        break;

      default:
        ({loading: isLoading, error: hasError} = this.props.btcWallet);
        break;
    }

    if (hasError) {
      return (
        <ErrorScreen
          title={C.STR_ERROR_transaction}
          desc={C.STR_ERROR_btc_txn_error}
          error={hasError}
          actions={[
            {
              text: C.STR_GO_BACK,
              onPress: () => this.props.navigation.navigate('AccountList'),
            },
          ]}
        />
      );
    }

    return (
      <View style={styles.mainView}>
        <ScrollView>
          <View
            style={styles.setting}
            onTouchEnd={() =>
              feeSettingEnabled && this.setState({modalVisible: true})
            }>
            <TouchableOpacity>
              <Image source={Images.icon_setting} style={styles.settingImg} />
            </TouchableOpacity>
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.recTxt}>{C.STR_PAYMENT_RECEIPIENT}</Text>
            <Text style={[styles.addrTxt, {fontSize: recTxtFontSize}]}>
              {address}
            </Text>
            <Text style={styles.amountLblTxt}>{C.STR_PAYMENT_AMOUNT}</Text>
          </View>
          <View style={styles.valueTxt}>
            <View style={styles.amountContainer}>
              <Text style={[styles.bigTxt, {fontSize: amountFontSize}]}>
                <SifirBTCAmount amount={amount} unit={unit} />
              </Text>
            </View>
            <View style={styles.lineView} />
          </View>
          {feeSettingEnabled && (
            <View style={styles.setArea}>
              <Text style={styles.setTxt}>{C.STR_FEES}</Text>
              <Text style={styles.btcAmountTxt}>{amount} BTC</Text>
              <Text style={styles.waitTxt}>[4 Hour Wait]</Text>
            </View>
          )}
          {isLoading && <ActivityIndicator size="large" />}
          <TouchableOpacity
            disabled={!!isLoading}
            onLongPress={this.handleSendBtn}
            style={styles.sendBtnTouchable}>
            <View shadowColor="black" shadowOffset="30" style={styles.sendBtn}>
              <Text style={styles.sendBtnTxt}>{C.STR_SEND}</Text>
              <Image source={Images.icon_up_dark} style={styles.sendImg} />
            </View>
          </TouchableOpacity>
          <Overlay
            visible={this.state.modalVisible}
            onClose={this.onClose}
            closeOnTouchOutside
            animationType="zoomIn"
            containerStyle={styles.overlayContainer}
            childrenWrapperStyle={styles.dlgChild}
            animationDuration={500}>
            {hideModal => (
              <SifirSettingModal
                hideModal={hideModal}
                feeEnabled={feeSettingEnabled}
                showSettings={true}
                showManageFunds={true}
              />
            )}
          </Overlay>
        </ScrollView>
      </View>
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

const mapDispatchToProps = {sendBitcoin, withdrawFunds, wasabiSpend};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirBtcSendTxnConfirmScreen);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
    display: 'flex',
  },
  setting: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 15,
    marginTop: 15,
  },
  settingImg: {
    width: 35,
    height: 30,
  },
  sendBtn: {
    width: C.SCREEN_WIDTH * 0.7,
    flexDirection: 'row',
    height: 12 * C.vh,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 5 * C.vh,
  },
  sendBtnTxt: {
    color: AppStyle.backgroundColor,
    fontWeight: 'bold',
    fontSize: 26,
    marginRight: 15,
  },
  valueTxt: {
    marginTop: 10,
    marginBottom: 20,
    marginRight: 40,
    marginLeft: 40,
  },
  lineView: {
    marginTop: -5,
    borderTopColor: AppStyle.mainColor,
    borderTopWidth: 2,
    marginHorizontal: 20,
  },
  bigTxt: {
    color: 'white',
    textAlign: 'center',
  },
  recTxt: {
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFontBold,
    fontSize: 16,
  },
  addrTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    marginTop: 10,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  waitTxt: {
    fontSize: 3 * C.vh,
    color: AppStyle.mainColor,
    marginLeft: 10,
  },
  setTxt: {
    fontSize: 23,
    color: AppStyle.mainColor,
    marginRight: 10,
  },
  setArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountLblTxt: {
    color: AppStyle.mainColor,
    fontSize: 16,
    marginTop: 3 * C.vh,
    fontFamily: AppStyle.mainFontBold,
  },
  dlgChild: {
    marginTop: 12 * C.vh,
    backgroundColor: 'transparent',
  },
  btcAmountTxt: {
    fontSize: 23,
    color: 'white',
    marginLeft: 10,
    marginRight: 10,
  },
  addressContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountUniLabel: {
    color: 'white',
    marginBottom: 5,
  },
  sendBtnTouchable: {
    marginTop: 50,
    alignItems: 'center',
  },
  overlayContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
  },
  sendImg: {width: 20, height: 20},
});
