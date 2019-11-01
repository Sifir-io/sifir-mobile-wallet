import React, {Component} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Images, AppStyle, Constants} from '@common';

import Overlay from 'react-native-modal-overlay';
import SifirSettingModal from '@elements/SifirSettingModal';

export default class SifirBtcTxnConfirmScreen extends Component {
  onClose = () => this.setState({modalVisible: false});

  state = {
    btnStatus: 0,
    modalVisible: false,
    receipient: this.props.navigation.getParam('receipient'),
    amount: this.props.navigation.getParam('amount'),
  };

  render() {
    return (
      <View style={styles.mainscreen}>
        <View
          style={styles.setting}
          onTouchEnd={() => this.setState({modalVisible: true})}>
          <TouchableOpacity>
            <Image source={Images.icon_setting} style={styles.image} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginTop: 15,
          }}>
          <Text style={styles.recTxtStyle}>
            {Constants.STR_PAYMENT_RECEIPIENT}
          </Text>
          <Text style={styles.addrTxtStyle}>{this.state.receipient}</Text>
          <Text
            style={{
              color: AppStyle.mainColor,
              fontSize: 16,
              marginTop: 35,
              fontFamily: AppStyle.mainFontBold,
            }}>
            {Constants.STR_PAYMENT_AMOUNT}
          </Text>
        </View>
        <View style={styles.valueStyle}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}>
            <Text style={styles.bigTxtStyle}>
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
          <View style={styles.lineStyle}></View>
        </View>
        <View style={styles.setAreaStyle}>
          <Text style={styles.setTxtStyle}>{Constants.STR_FEES}</Text>
          <Text
            style={{
              fontSize: 23,
              color: 'white',
              marginLeft: 10,
              marginRight: 10,
            }}>
            {this.state.amount.substring(0, 4)} BTC
          </Text>
          <Text style={styles.waitTxtStyle}>[4 Hour Wait]</Text>
        </View>
        <TouchableOpacity
          onLongPress={() =>
            this.props.navigation.navigate('BtcSendTxnConfirmed', {
              receipient: this.state.receipient,
              amount: this.state.amount,
            })
          }
          style={{
            marginTop: 50,
            alignItems: 'center',
          }}>
          <View
            shadowColor="black"
            shadowOffset="30"
            style={styles.sendBtnStyle}>
            <Text style={styles.sendBtnTxtStyle}>{Constants.STR_SEND}</Text>
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
          childrenWrapperStyle={{
            marginTop: 110,
            backgroundColor: 'transparent',
          }}
          animationDuration={500}>
          {(hideModal, overlayState) => (
            <SifirSettingModal hideModal={hideModal} />
          )}
        </Overlay>
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
    display: 'flex',
  },
  setting: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 15,
    marginTop: 15,
  },
  image: {
    width: 35,
    height: 30,
  },
  sendBtnStyle: {
    width: Constants.SCREEN_WIDTH * 0.7,
    flexDirection: 'row',
    height: 90,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  sendBtnTxtStyle: {
    color: AppStyle.backgroundColor,
    fontWeight: 'bold',
    fontSize: 26,
    marginRight: 15,
  },
  valueStyle: {
    marginTop: 10,
    marginBottom: 20,
    marginRight: 40,
    marginLeft: 40,
  },
  lineStyle: {
    marginTop: -5,
    borderTopColor: AppStyle.mainColor,
    borderTopWidth: 2,
    marginHorizontal: 20,
  },
  bigTxtStyle: {
    color: 'white',
    fontSize: 80,
    width: Constants.SCREEN_WIDTH * 0.55,
    textAlign: 'center',
  },
  recTxtStyle: {
    color: AppStyle.mainColor,
    fontSize: 16,
    fontFamily: AppStyle.mainFontBold,
  },
  addrTxtStyle: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 35,
    marginTop: 10,
  },
  waitTxtStyle: {
    fontSize: 23,
    color: AppStyle.mainColor,
    marginLeft: 10,
  },
  setTxtStyle: {
    fontSize: 23,
    color: AppStyle.mainColor,
    marginRight: 10,
  },
  setAreaStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
