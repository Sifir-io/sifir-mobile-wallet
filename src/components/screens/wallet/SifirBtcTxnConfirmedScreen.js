import React, {Component, PureComponent} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
// import {connect} from 'react-redux';

import {Images, AppStyle, Constants} from '@common';

export default class SifirBtcTxnConfirmedScreen extends Component {
  state = {
    isSendTxn: this.props.navigation.getParam('isSendTxn'),
    address: this.props.navigation.getParam('address'),
    amount: this.props.navigation.getParam('amount'),
  };
  render() {
    const {isSendTxn, amount, address} = this.state;

    return (
      <View style={styles.mainView}>
        <View style={{alignItems: 'center', flex: 3}}>
          <Image source={Images.icon_done} style={styles.checkImg} />
          <Text style={styles.paymentTxt}>{Constants.STR_PAYMENT}</Text>
          <Text style={styles.addressLblTxt}>
            {isSendTxn ? Constants.STR_SENT : Constants.STR_RECEIVED}
          </Text>
          <Text style={styles.payAddrTxt}>
            {Constants.STR_PAYMENT +
              ' ' +
              (isSendTxn ? Constants.STR_RECEIPIENT : Constants.STR_SENDER)}
          </Text>
          <Text style={styles.addrTxt}>{address}</Text>
          <Text style={styles.amountLblTxt}>
            {Constants.STR_PAYMENT_AMOUNT}
          </Text>
          <Text style={styles.amountTxt}>
            {amount + ' ' + Constants.STR_BTC}
          </Text>
        </View>

        <TouchableOpacity style={styles.doneTouch}>
          <View shadowColor="black" shadowOffset="30" style={styles.doneView}>
            <Text style={styles.doneTxt}>{Constants.STR_DONE}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const vh = Constants.SCREEN_HEIGHT / 100;
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
  },
  doneView: {
    width: Constants.SCREEN_WIDTH * 0.5,
    flexDirection: 'row',
    height: 9.5 * vh,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
  paymentTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 10 * vh,
    marginTop: 10,
  },
  addressLblTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 10 * vh,
    marginTop: -30,
  },
  payAddrTxt: {
    color: AppStyle.mainColor,
    fontSize: 16,
    marginTop: 20,
    fontFamily: AppStyle.mainFontBold,
  },
  addrTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 28,
    marginTop: 5,
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
  checkImg: {width: 8 * vh, height: 8 * vh, marginTop: 2 * vh},
});
