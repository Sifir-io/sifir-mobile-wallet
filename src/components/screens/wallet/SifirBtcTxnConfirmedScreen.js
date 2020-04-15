// TODO rename this to txnDetails
import React, {Component} from 'react';
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
import SifirBTCAmount from '@elements/SifirBTCAmount';

class SifirBtcTxnConfirmedScreen extends Component {
  backToAccount = () => {
    const {type, walletInfo} = this.props.route.params;
    if (type === C.STR_LN_WALLET_TYPE) {
      this.props.navigation.navigate('Account', {walletInfo});
    } else {
      this.props.navigation.navigate('AccountList');
    }
  };

  render() {
    const {type} = this.props.route.params;
    const addrTxtFontSize = (C.vw * 250) / address?.length || 25;

    const {amount, address, isSendTxn, unit} = this.props.route.params.txnInfo;
    const payTitleText =
      type === C.STR_LN_WALLET_TYPE
        ? C.STR_PAID
        : isSendTxn
        ? C.STR_SENT
        : C.STR_RECEIVED;
    const payDataTitleText = `${C.STR_PAYMENT} ${
      type === C.STR_LN_WALLET_TYPE
        ? C.STR_PRE_IMAGE
        : isSendTxn
        ? C.STR_RECEIPIENT
        : C.STR_SENDER
    }`;
    return (
      <View style={styles.mainView}>
        <ScrollView style={styles.sv}>
          <View style={styles.container}>
            <Image source={Images.icon_done} style={styles.checkImg} />
            <Text style={styles.paymentTxt}>
              {type === C.STR_LN_WALLET_TYPE ? C.STR_INVOICE : C.STR_PAYMENT}
            </Text>
            <Text style={styles.addressLblTxt}>{payTitleText}</Text>
            <Text style={styles.payAddrTxt}>{payDataTitleText}</Text>
            <Text style={[styles.addrTxt, {fontSize: addrTxtFontSize}]}>
              {address}
            </Text>
            <Text style={styles.amountLblTxt}>{C.STR_PAYMENT_AMOUNT}</Text>
            <Text style={styles.amountTxt}>
              <SifirBTCAmount amount={amount} unit={unit} />
            </Text>
          </View>
          <TouchableOpacity
            style={styles.doneTouch}
            onPressOut={() => this.backToAccount()}>
            <View shadowColor="black" shadowOffset="30" style={styles.doneView}>
              <Text style={styles.doneTxt}>{C.STR_DONE}</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
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

const mapDispatchToProps = {};

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
    paddingVertical: 15,
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
    alignSelf: 'center',
    marginTop: C.SCREEN_HEIGHT / 4,
  },
  sv: {
    flex: 1,
  },
});
