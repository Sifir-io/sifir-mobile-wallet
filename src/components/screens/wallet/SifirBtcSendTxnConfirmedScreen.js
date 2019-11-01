import React, {Component} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
// import {connect} from 'react-redux';

import {Images, AppStyle, Constants} from '@common';

export default class SifirBtcSendTxnConfirmedScreen extends Component {
  state = {
    btnStatus: 0,
    receipient: this.props.navigation.getParam('receipient'),
    amount: this.props.navigation.getParam('amount'),
  };

  render() {
    return (
      <View style={styles.mainscreen}>
        <View style={{alignItems: 'center', flex: 3}}>
          <Image
            source={Images.icon_done}
            style={{width: 60, height: 60, marginTop: 20}}
          />
          <Text
            style={{
              color: 'white',
              fontFamily: AppStyle.mainFont,
              fontSize: 70,
              marginTop: 10,
            }}>
            {Constants.STR_PAYMENT}
          </Text>
          <Text
            style={{
              color: 'white',
              fontFamily: AppStyle.mainFont,
              fontSize: 70,
              marginTop: -30,
            }}>
            {Constants.STR_SENT}
          </Text>
          <Text
            style={{
              color: AppStyle.mainColor,
              fontSize: 16,
              marginTop: 20,
              fontFamily: AppStyle.mainFontBold,
            }}>
            {Constants.STR_PAYMENT_RECEIPIENT}
          </Text>
          <Text
            style={{
              color: 'white',
              fontFamily: AppStyle.mainFont,
              fontSize: 28,
              marginTop: 5,
            }}>
            {this.state.receipient}
          </Text>
          <Text
            style={{
              color: AppStyle.mainColor,
              fontSize: 16,
              marginTop: 25,
              fontFamily: AppStyle.mainFontBold,
            }}>
            {Constants.STR_PAYMENT_AMOUNT}
          </Text>
          <Text
            style={{
              color: 'white',
              fontFamily: AppStyle.mainFont,
              fontSize: 28,
              marginTop: 5,
            }}>
            {this.state.amount} BTC
          </Text>
        </View>

        <TouchableOpacity
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}>
          <View shadowColor="black" shadowOffset="30" style={styles.btnStyle}>
            <Text
              style={{
                color: AppStyle.backgroundColor,
                fontWeight: 'bold',
                fontSize: 26,
                marginRight: 15,
              }}>
              {Constants.STR_DONE}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainscreen: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
  },
  btnStyle: {
    width: Constants.SCREEN_WIDTH * 0.5,
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
});
