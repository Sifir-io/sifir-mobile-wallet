import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';

import {AppStyle, C} from '@common/index';
import {connect} from 'react-redux';
import {getFunds} from '@actions/lnWallet';

class SifirBtcSendTxnInputAmountScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }
  state = {
    btnStatus: 0,
    amount: 0,
    validAmount: false,
  };

  componentDidMount() {
    this.props.getFunds();
  }

  goToConfirm = () => {
    const {txnInfo, walletInfo} = this.props.route.params;
    const {amount} = this.state;
    this.props.navigation.navigate('BtcSendTxnConfirm', {
      txnInfo: {...txnInfo, amount},
      walletInfo,
    });
  };
  checkAndSetInput = inputamount => {
    const {
      walletInfo: {balance},
    } = this.props.route.params;
    // TODO this to proper SATS vs BTC unit parse
    if (isNaN(inputamount)) {
      return this.setState({validAmount: false});
    }
    // Check amounts
    if (inputamount > balance) {
      return this.setState({validAmount: false});
    }
    return this.setState({
      amount: inputamount,
      // Do > 0 check here to allow temporary 0 while deleting / editing amounts
      validAmount: inputamount > 0 ? true : false,
    });
  };

  render() {
    const {amount, validAmount} = this.state;
    const {
      txnInfo: {address, txnType},
      walletInfo: {balance},
    } = this.props.route.params;
    return (
      <View style={styles.mainView}>
        <View style={styles.contentView}>
          <View style={{alignItems: 'center', flex: 5}}>
            <Text style={styles.recLblTxt}>{C.STR_PAYMENT_RECEIPIENT}</Text>
            <Text style={styles.recTxt}>{address}</Text>
            <Text style={styles.amountTxt}>{C.STR_PAYMENT_AMOUNT}</Text>
            <TouchableOpacity onPress={() => this.checkAndSetInput(balance)}>
              <Text style={styles.smallWhiteText}>
                {`${C.STR_Wallet_balance}: ${balance ||
                  this.props.lnWallet?.balance ||
                  '.....  '} `}
                {txnType === C.STR_LN_WITHDRAW ? C.STR_MSAT : C.STR_BTC}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 15}}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <TextInput
                value={amount.toString()}
                style={styles.inputStyle}
                keyboardType="decimal-pad"
                autoCorrect={false}
                autoFocus={true}
                onChangeText={this.checkAndSetInput}
              />
              <Text style={styles.btcTxt}>
                {txnType === C.STR_LN_WITHDRAW ? C.STR_MSAT : C.STR_BTC}
              </Text>
            </View>
            <View style={styles.lineStyle} />
          </View>
          {validAmount && (
            <TouchableOpacity
              style={{
                marginTop: C.SCREEN_HEIGHT - 520,
              }}
              shadowColor="black"
              shadowOffset="30">
              <View
                style={styles.btnStyle}
                onTouchEnd={() => this.goToConfirm()}>
                <Text style={styles.confirmTxtStyle}>{C.STR_CONFIRM}</Text>
              </View>
            </TouchableOpacity>
          )}
          {!validAmount && (
            <View
              style={[
                styles.btnStyle,
                {marginTop: C.SCREEN_HEIGHT - 520, opacity: 0.5},
              ]}
              shadowColor="black"
              shadowOffset="30">
              <Text style={styles.confirmTxtStyle}>{C.STR_CONFIRM}</Text>
            </View>
          )}
        </View>
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

const mapDispatchToProps = {getFunds};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirBtcSendTxnInputAmountScreen);

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
    width: C.SCREEN_WIDTH * 0.6,
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
    width: C.SCREEN_WIDTH * 0.55,
    fontFamily: AppStyle.mainFont,
  },
  confirmTxtStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 23,
  },
  smallWhiteText: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 12,
    marginTop: 10,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  recTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 30,
    marginTop: 10,
    marginHorizontal: 50,
    textAlign: 'center',
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
