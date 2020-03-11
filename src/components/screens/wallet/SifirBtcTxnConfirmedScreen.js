// TODO rename this to txnDetails
import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {Images, AppStyle, C} from '@common/index';
import {payBolt} from '@actions/lnWallet';
import {ErrorScreen} from '@screens/error';
import SifirBTCAmount from '@elements/SifirBTCAmount';

class SifirBtcTxnConfirmedScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    if (this.props.route.params.type === C.STR_LN_WALLET_TYPE) {
      this.payBolt();
    }
  }

  payBolt = async () => {
    const {bolt11} = this.props.route.params;
    await this.props.payBolt(bolt11);
  };

  backToAccount = () => {
    const {walletInfo} = this.props.route.params;
    this.props.navigation.navigate('Account', {walletInfo});
  };

  render() {
    console.log('this.props.lnWallet', this.props.lnWallet);
    const {type} = this.props.route.params;
    let amount, address, isSendTxn, btcSendResult, error;
    let loading = this.props.lnWallet.loading || this.props.btcWallet.loading;
    let loaded = this.props.lnWallet.loaded || this.props.btcWallet.loaded;
    if (type === C.STR_LN_WALLET_TYPE && this.props.lnWallet.txnDetails) {
      isSendTxn = true;
      ({
        loaded,
        loading,
        error,
        txnDetails: {
          msatoshi: amount,
          payment_preimage: address,
          status: btcSendResult,
        },
      } = this.props.lnWallet);
    } else if (this.props.route.params.txnInfo) {
      ({
        txnInfo: {amount, address, isSendTxn},
      } = this.props.route.params);
      ({loaded, loading, btcSendResult, error} = this.props.btcWallet);
    }
    if (error) {
      return (
        <ErrorScreen
          title={C.STR_ERROR_btc_action}
          desc={C.STR_ERROR_txn_error}
          error={error}
          actions={[
            {
              text: C.STR_GO_BACK,
              onPress: () => this.backToAccount(),
            },
          ]}
        />
      );
    }
    const addrTxtFontSize = (C.vw * 250) / address?.length || 25;
    return (
      <View style={styles.mainView}>
        {loading === true && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={AppStyle.mainColor} />
          </View>
        )}
        {loaded === true && btcSendResult !== null && (
          <>
            <View style={styles.container}>
              <Image source={Images.icon_done} style={styles.checkImg} />
              <Text style={styles.paymentTxt}>{C.STR_PAYMENT}</Text>
              <Text style={styles.addressLblTxt}>
                {isSendTxn ? C.STR_SENT : C.STR_RECEIVED}
              </Text>
              <Text style={styles.payAddrTxt}>
                {C.STR_PAYMENT +
                  ' ' +
                  (isSendTxn ? C.STR_RECEIPIENT : C.STR_SENDER)}
              </Text>
              <Text style={[styles.addrTxt, {fontSize: addrTxtFontSize}]}>
                {address}
              </Text>
              <Text style={styles.amountLblTxt}>{C.STR_PAYMENT_AMOUNT}</Text>
              <Text style={styles.amountTxt}>
                <SifirBTCAmount amount={amount} unit="msat" />
              </Text>
            </View>
            <TouchableOpacity
              style={styles.doneTouch}
              onPressOut={() => this.backToAccount()}>
              <View
                shadowColor="black"
                shadowOffset="30"
                style={styles.doneView}>
                <Text style={styles.doneTxt}>{C.STR_DONE}</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
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

const mapDispatchToProps = {payBolt};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirBtcTxnConfirmedScreen);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 3,
  },
  mainView: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
  },
  doneView: {
    width: C.SCREEN_WIDTH * 0.5,
    flexDirection: 'row',
    height: 9.5 * C.vh,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
  paymentTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 10 * C.vh,
    marginTop: 10,
  },
  addressLblTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 10 * C.vh,
    marginTop: -30,
  },
  payAddrTxt: {
    color: AppStyle.mainColor,
    marginTop: 20,
    fontFamily: AppStyle.mainFontBold,
  },
  addrTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 28,
    marginTop: 5,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  amountLblTxt: {
    color: AppStyle.mainColor,
    fontSize: 16,
    marginTop: 25,
    fontFamily: AppStyle.mainFontBold,
  },
  amountTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 28,
    marginTop: 5,
  },
  doneTouch: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  doneTxt: {
    color: AppStyle.backgroundColor,
    fontWeight: 'bold',
    fontSize: 26,
    marginRight: 15,
  },
  checkImg: {width: 8 * C.vh, height: 8 * C.vh, marginTop: 2 * C.vh},
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
