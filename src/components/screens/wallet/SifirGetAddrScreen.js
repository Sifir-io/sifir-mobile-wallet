import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
} from 'react-native';

import {Images, AppStyle, C} from '@common/index';
import SifirQrCodeCamera from '@elements/SifirQrCodeCamera';

export default class SifirGetAddrScreen extends Component {
  state = {
    btnStatus: 0,
    showModal: false,
    torchOn: false,
    address: null,
    txnInfo: this.props.navigation.getParam('txnInfo'),
    addrFontSize: 22,
  };

  closeModal = data => {
    if (data === null) {
      this.setState({showModal: false});
      return;
    }
    this.setState({
      address: data,
      showModal: false,
      addrFontSize: (1.2 * C.SCREEN_WIDTH) / data.length,
    });
  };

  continue = () => {
    let {txnInfo} = this.state;
    txnInfo.address = this.state.address;
    this.props.navigation.navigate('BtcSendTxnInputAmount', {txnInfo});
  };

  inputAddr = address => {
    if (address.length * 22 < C.SCREEN_WIDTH) {
      this.setState({address, addrFontSize: 22});
    } else {
      this.setState({
        address,
        addrFontSize: (1.2 * C.SCREEN_WIDTH) / address.length,
      });
    }
  };

  render() {
    const {navigate} = this.props.navigation;
    const {showModal, address, addrFontSize} = this.state;
    return (
      <View style={styles.mainView}>
        <View style={styles.contentView}>
          <TouchableOpacity>
            <View
              style={styles.backNavView}
              onTouchEnd={() => navigate('Account')}>
              <Image source={Images.icon_back} style={styles.backImg} />
              <Image source={Images.icon_btc_cir} style={styles.btcImg} />
              <Text style={styles.backNavTxt}>{C.STR_Send}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.titleStyle}>
            <Text style={styles.commentTxt}>{C.STR_Enter_addr}</Text>
            <Text style={styles.commentTxt}>{C.SCAN_ORSCAN}</Text>
          </View>

          <View style={styles.inputView}>
            <TextInput
              placeholder={C.STR_Enter_Addr}
              placeholderTextColor="white"
              style={[styles.inputTxtStyle, {fontSize: addrFontSize}]}
              value={address}
              onChangeText={add => this.inputAddr(add)}
            />
          </View>

          <View
            style={styles.qrScanView}
            onTouchEnd={() => {
              this.setState({showModal: true});
            }}>
            <TouchableOpacity>
              <Image source={Images.img_camera} style={styles.cameraImg} />
            </TouchableOpacity>
          </View>

          {address != null && (
            <TouchableOpacity>
              <View
                style={styles.continueBtnView}
                onTouchEnd={() => this.continue()}>
                <Text style={styles.continueTxt}>{C.STR_CONTINUE}</Text>
                <Image
                  source={Images.icon_up_blue}
                  style={{width: 20, height: 20, marginLeft: 20}}
                />
              </View>
            </TouchableOpacity>
          )}
          {address == null && (
            <View style={[styles.continueBtnView, {opacity: 0.5}]}>
              <Text style={styles.continueTxt}>{C.STR_CONTINUE}</Text>
              <Image
                source={Images.icon_up_blue}
                style={{width: 20, height: 20, marginLeft: 20}}
              />
            </View>
          )}
        </View>
        <Modal
          visible={showModal}
          animationType="fade"
          presentationStyle="fullScreen">
          <SifirQrCodeCamera closeHandler={this.closeModal} />
        </Modal>
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
    left: 0,
    top: 0,
  },
  backNavView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 0,
    marginLeft: 13,
  },
  backNavTxt: {
    fontFamily: AppStyle.mainFontBold,
    fontSize: 15,
    color: 'white',
    marginLeft: 5,
  },
  backImg: {
    width: 15,
    height: 15,
    marginLeft: 10,
    marginTop: 2,
  },
  btcImg: {
    width: 23,
    height: 23,
    marginLeft: 5,
  },
  commentTxt: {
    color: 'white',
    fontSize: 15,
    marginBottom: -5,
  },
  continueBtnView: {
    height: 90,
    marginTop: 30,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: AppStyle.mainColor,
    borderWidth: 2,
    borderRadius: 10,
    marginLeft: 43,
    marginRight: 43,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
    width: C.SCREEN_WIDTH * 0.8,
    marginLeft: C.SCREEN_WIDTH * 0.1,
    height: 70,
    borderRadius: 10,
    borderColor: AppStyle.mainColor,
    borderWidth: 2,
  },
  qrScanView: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: C.SCREEN_WIDTH,
    padding: 0,
    margin: 0,
  },
  inputTxtStyle: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    textAlign: 'left',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  titleStyle: {
    flex: 0.7,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  continueTxt: {
    color: AppStyle.mainColor,
    fontSize: 25,
    fontWeight: 'bold',
  },
  cameraImg: {
    height: C.SCREEN_HEIGHT - 495,
    width: (C.SCREEN_HEIGHT - 495) * 1.06,
  },
});
