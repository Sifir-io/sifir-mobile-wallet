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
      <View style={styles.mainscreen}>
        <View style={styles.content}>
          <TouchableOpacity>
            <View
              style={styles.backNavStyle}
              onTouchEnd={() => navigate('Account')}>
              <Image source={Images.icon_back} style={styles.image} />
              <Image source={Images.icon_btc_cir} style={styles.image_btc} />
              <Text style={styles.backTextStyle}>{Constants.STR_Send}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.titleStyle}>
            <Text style={styles.comment}>{Constants.STR_Enter_addr}</Text>
            <Text style={styles.comment}>{Constants.STR_or_scan}</Text>
          </View>

          <View style={styles.inputStyle}>
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
            style={styles.tapStyle}
            onTouchEnd={() => {
              this.setState({showModal: true});
              // navigate('QRScan');
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
                style={styles.btnStyle}
                onTouchEnd={() =>
                  navigate('BtcSendTxnInputAmount', {
                    receipient: this.state.scannedAddr,
                  })
                }>
                <Text style={styles.btnTxtStyle}>{Constants.STR_CONTINUE}</Text>
                <Image
                  source={Images.icon_up_blue}
                  style={{width: 20, height: 20, marginLeft: 20}}
                />
              </View>
            </TouchableOpacity>
          )}
          {scannedAddr == null && (
            <View style={[styles.btnStyle, {opacity: 0.5}]}>
              <Text style={styles.btnTxtStyle}>{Constants.STR_CONTINUE}</Text>
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
  mainscreen: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    position: 'relative',
  },
  content: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  backNavStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 0,
    marginLeft: 13,
  },
  backTextStyle: {
    fontFamily: AppStyle.mainFontBold,
    fontSize: 15,
    color: 'white',
    marginLeft: 5,
  },
  image: {
    width: 15,
    height: 15,
    marginLeft: 10,
    marginTop: 2,
  },
  image_btc: {
    width: 23,
    height: 23,
    marginLeft: 5,
  },

  comment: {
    color: 'white',
    fontSize: 15,
    marginBottom: -5,
  },
  btnStyle: {
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
  inputStyle: {
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
  tapStyle: {
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
  btnTxtStyle: {
    color: AppStyle.mainColor,
    fontSize: 25,
    fontWeight: 'bold',
  },
});
