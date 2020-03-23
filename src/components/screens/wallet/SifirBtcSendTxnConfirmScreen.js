import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import {sendBitcoin} from '@actions/btcwallet';
import {withdrawFunds} from '@actions/lnWallet';
import Overlay from 'react-native-modal-overlay';
import SifirSettingModal from '@elements/SifirSettingModal';
import {ErrorScreen} from '@screens/error';

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
    const withdrawDetails = await this.props.withdrawFunds(address, amount);
    if (withdrawDetails?.tx) {
      this.props.navigation.navigate('BtcTxnConfirmed', {
        txnInfo: {
          ...txnInfo,
          isSendTxn: true,
          amount,
          address,
        },
        walletInfo,
        displayUnit: C.STR_MSAT,
        type,
      });
    }
  };

  sendBitcoin = async () => {
    const {
      txnInfo,
      walletInfo: {type},
    } = this.props.route.params;
    const {address, amount} = txnInfo;
    await this.props.sendBitcoin({address, amount});
    // TODO handle navigation here
  };

  handleSendBtn = () => {
    const {
      walletInfo: {type},
    } = this.props.route.params;
    if (type === C.STR_LN_WITHDRAW) {
      this.withdrawFunds();
    } else {
      this.sendBitcoin();
    }
  };

  render() {
    const {
      walletInfo: {feeSettingEnabled, type},
      txnInfo: {address, amount},
    } = this.props.route.params;
    const amountFontSize =
      (C.vw * 80) / (amount.length < 3 ? 5 : amount.length);
    const btcUnitFontSize = amountFontSize * 0.6;
    const recTxtFontSize = (C.vw * 120) / address.length;
    const {loading: btcLoading, error: btcError} = this.props.lnWallet;
    const {loading: lnLoading, error: lnError} = this.props.btcWallet;

    if (btcError || lnError) {
      return (
        <ErrorScreen
          title={C.STR_ERROR_transaction}
          desc={C.STR_ERROR_btc_txn_error}
          error={btcError || lnError}
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
              {amount}{' '}
            </Text>
            <Text style={[styles.amountUniLabel, {fontSize: btcUnitFontSize}]}>
              {type === C.STR_LN_WITHDRAW ? C.STR_MSAT : C.STR_BTC}
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
        {(btcLoading || lnLoading) && <ActivityIndicator size="large" />}
        <TouchableOpacity
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

const mapDispatchToProps = {sendBitcoin, withdrawFunds};

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
