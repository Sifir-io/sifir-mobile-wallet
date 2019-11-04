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
// import {connect} from 'react-redux';

import {Images, AppStyle, Constants} from '@common';
import SifirQrCodeCamera from '@elements/SifirQrCodeCamera';

export default class SifirGetAddrScreen extends Component {
  //   constructor(props, context) {
  //     super(props, context);
  //   }
  state = {
    btnStatus: 0,
    showModal: false,
    torchOn: false,
    scannedAddr: null,
  };

  closeModal = (available, data) => {
    if (available) {
      this.setState({scannedAddr: data});
    }
    this.setState({showModal: false});
  };

  render() {
    const {navigate} = this.props.navigation;
    const TAP_WIDTH = Constants.SCREEN_HEIGHT - 495;
    const {showModal, scannedAddr} = this.state;
    return (
      <View style={styles.mainView}>
        <View style={styles.contentView}>
          <TouchableOpacity>
            <View
              style={styles.backNavView}
              onTouchEnd={() => navigate('Account')}>
              <Image source={Images.icon_back} style={styles.backImg} />
              <Image source={Images.icon_btc_cir} style={styles.btcImg} />
              <Text style={styles.backNavTxt}>{Constants.STR_Send}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.titleStyle}>
            <Text style={styles.commentTxt}>{Constants.STR_Enter_addr}</Text>
            <Text style={styles.commentTxt}>{Constants.SCAN_ORSCAN}</Text>
          </View>

          <View style={styles.inputView}>
            <TextInput
              placeholder={Constants.STR_Enter_Addr}
              placeholderTextColor="white"
              style={styles.inputTxtStyle}
              value={scannedAddr}
              onChangeText={scannedAddr => this.setState({scannedAddr})}
            />
            <TouchableOpacity>
              <Image source={Images.icon_setting} style={styles.setImgStyle} />
            </TouchableOpacity>
          </View>

          <View
            style={styles.qrScanView}
            onTouchEnd={() => {
              this.setState({showModal: true});
            }}>
            <TouchableOpacity>
              <Image
                source={Images.img_camera}
                style={{
                  height: TAP_WIDTH,
                  width: TAP_WIDTH * 1.06,
                }}
              />
            </TouchableOpacity>
          </View>

          {scannedAddr != null && (
            <TouchableOpacity>
              <View
                style={styles.continueBtnView}
                onTouchEnd={() =>
                  navigate('BtcSendTxnInputAmount', {
                    receipient: this.state.scannedAddr,
                  })
                }>
                <Text style={styles.continueTxt}>{Constants.STR_CONTINUE}</Text>
                <Image
                  source={Images.icon_up_blue}
                  style={{width: 20, height: 20, marginLeft: 20}}
                />
              </View>
            </TouchableOpacity>
          )}
          {scannedAddr == null && (
            <View style={[styles.continueBtnView, {opacity: 0.5}]}>
              <Text style={styles.continueTxt}>{Constants.STR_CONTINUE}</Text>
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
    width: Constants.SCREEN_WIDTH * 0.8,
    marginLeft: Constants.SCREEN_WIDTH * 0.1,
    height: 70,
    borderRadius: 10,
    borderColor: AppStyle.mainColor,
    borderWidth: 2,
  },
  qrScanView: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: Constants.SCREEN_WIDTH,
    padding: 0,
    margin: 0,
  },
  inputTxtStyle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 22,
    color: 'white',
    textAlign: 'left',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  setImgStyle: {
    flex: 1,
    height: 10,
    width: 32,
    marginTop: 18,
    marginBottom: 18,
    marginRight: 10,
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
});
