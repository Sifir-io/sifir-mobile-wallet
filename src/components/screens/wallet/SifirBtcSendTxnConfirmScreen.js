import React, {Component} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Images, AppStyle, Constants} from '@common';

import Overlay from 'react-native-modal-overlay';
import SifirSettingModal from '@elements/SifirSettingModal';

export default class SifirBtcSendTxnConfirmScreen extends Component {
  onClose = () => this.setState({modalVisible: false});

  state = {
    btnStatus: 0,
    modalVisible: false,
    receipient: this.props.navigation.getParam('receipient'),
    amount: this.props.navigation.getParam('amount'),
  };

  render() {
    return (
      <View style={styles.mainView}>
        <View
          style={styles.setting}
          onTouchEnd={() => this.setState({modalVisible: true})}>
          <TouchableOpacity>
            <Image source={Images.icon_setting} style={styles.settingImg} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 15,
          }}>
          <Text style={styles.recTxt}>{Constants.STR_PAYMENT_RECEIPIENT}</Text>
          <Text style={styles.addrTxt}>{this.state.receipient}</Text>
          <Text style={styles.amountLblTxt}>
            {Constants.STR_PAYMENT_AMOUNT}
          </Text>
        </View>
        <View style={styles.valueTxt}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Text style={styles.bigTxt}>
              {this.props.navigation.getParam('amount').substring(0, 4)}
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 38,
                marginBottom: 15,
              }}>
              {Constants.STR_BTC}
            </Text>
          </View>
          <View style={styles.lineView}></View>
        </View>
        <View style={styles.setArea}>
          <Text style={styles.setTxt}>{Constants.STR_FEES}</Text>
          <Text
            style={{
              fontSize: 23,
              color: 'white',
              marginLeft: 10,
              marginRight: 10,
            }}>
            {this.state.amount.substring(0, 4)} BTC
          </Text>
          <Text style={styles.waitTxt}>[4 Hour Wait]</Text>
        </View>
        <TouchableOpacity
          onLongPress={() =>
            this.props.navigation.navigate('BtcTxnConfirmed', {
              address: this.state.receipient,
              amount: this.state.amount,
              isSendTxn: true,
            })
          }
          style={{
            marginTop: 50,
            alignItems: 'center',
          }}>
          <View shadowColor="black" shadowOffset="30" style={styles.sendBtn}>
            <Text style={styles.sendBtnTxt}>{Constants.STR_SEND}</Text>
            <Image
              source={Images.icon_up_dark}
              style={{width: 20, height: 20}}
            />
          </View>
        </TouchableOpacity>
        <Overlay
          visible={this.state.modalVisible}
          onClose={this.onClose}
          closeOnTouchOutside
          animationType="zoomIn"
          containerStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 15,
          }}
          childrenWrapperStyle={styles.dlgChild}
          animationDuration={500}>
          {hideModal => <SifirSettingModal hideModal={hideModal} />}
        </Overlay>
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
    width: Constants.SCREEN_WIDTH * 0.7,
    flexDirection: 'row',
    height: 12 * vh,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 5 * vh,
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
    fontSize: 12 * vh,
    width: Constants.SCREEN_WIDTH * 0.55,
    textAlign: 'center',
  },
  recTxt: {
    color: AppStyle.mainColor,
    fontSize: 16,
    fontFamily: AppStyle.mainFontBold,
  },
  addrTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 5 * vh,
    marginTop: 10,
  },
  waitTxt: {
    fontSize: 3 * vh,
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
    marginTop: 3 * vh,
    fontFamily: AppStyle.mainFontBold,
  },
  dlgChild: {
    marginTop: 12 * vh,
    backgroundColor: 'transparent',
  },
});
