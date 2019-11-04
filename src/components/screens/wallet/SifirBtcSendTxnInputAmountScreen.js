import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';

import {AppStyle, Constants} from '@common';

export default class SifirBtcSendTxnInputAmountScreen extends Component {
  state = {
    receipient: this.props.navigation.getParam('receipient'),
    btnStatus: 0,
    amount: null,
  };

  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.contentView}>
          <View style={{alignItems: 'center', flex: 5}}>
            <Text style={styles.recLblTxt}>
              {Constants.STR_PAYMENT_RECEIPIENT}
            </Text>
            <Text style={styles.recTxt}>{this.state.receipient}</Text>
            <Text style={styles.amountTxt}>{Constants.STR_PAYMENT_AMOUNT}</Text>
          </View>
          <View style={{marginTop: 15}}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <TextInput
                style={styles.inputStyle}
                keyboardType="number-pad"
                onChangeText={amount => this.setState({amount: amount})}
              />
              <Text style={styles.btcTxt}>{Constants.STR_BTC}</Text>
            </View>
            <View style={styles.lineStyle}></View>
          </View>
          {this.state.amount !== null && (
            <TouchableOpacity
              style={{
                marginTop: Constants.SCREEN_HEIGHT - 520,
              }}
              shadowColor="black"
              shadowOffset="30">
              <View
                style={styles.btnStyle}
                onTouchEnd={() =>
                  this.props.navigation.navigate('BtcSendTxnConfirm', {
                    receipient: this.state.receipient,
                    amount: this.state.amount,
                  })
                }>
                <Text style={styles.confirmTxtStyle}>
                  {Constants.STR_CONFIRM}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {(this.state.amount === null ||
            parseInt(this.state.amount, 10) == 0) && (
            <View
              style={[
                styles.btnStyle,
                {marginTop: Constants.SCREEN_HEIGHT - 520, opacity: 0.5},
              ]}
              shadowColor="black"
              shadowOffset="30">
              <Text style={styles.confirmTxtStyle}>
                {Constants.STR_CONFIRM}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    position: 'relative',
  },
  contentView: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    left: 0,
    top: 0,
  },
  btnStyle: {
    width: Constants.SCREEN_WIDTH * 0.6,
    height: 60,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  lineStyle: {
    marginTop: -5,
    borderTopColor: AppStyle.mainColor,
    borderTopWidth: 2,
  },
  recLblTxt: {
    color: AppStyle.mainColor,
    fontSize: 16,
    marginTop: 30,
    fontFamily: AppStyle.mainFontBold,
  },
  inputStyle: {
    color: 'white',
    fontSize: 50,
    width: Constants.SCREEN_WIDTH * 0.55,
    fontFamily: AppStyle.mainFont,
  },
  confirmTxtStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 23,
  },
  recTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 30,
    marginTop: 10,
  },
  amountTxt: {
    color: AppStyle.mainColor,
    fontSize: 16,
    marginTop: 40,
    fontFamily: AppStyle.mainFontBold,
  },
  btcTxt: {
    color: 'white',
    fontSize: 38,
    marginBottom: 15,
  },
});
