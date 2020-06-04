import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';

import {Images, AppStyle, C} from '@common/index';
import SifirQrCodeCamera from '@elements/SifirQrCodeCamera';
import {decodeBolt} from '@actions/lnWallet';
import {connect} from 'react-redux';
import {ErrorScreen} from '@screens/error';

class SifirGetAddrScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }
  state = {
    showModal: false,
    torchOn: false,
    scannedQRdata: null,
  };
  closeModal = data => {
    if (data === null) {
      return this.setState({showModal: false});
    }
    const {
      walletInfo: {type},
    } = this.props.route.params;

    this.setState(
      {
        scannedQRdata: data,
        showModal: false,
      },
      () => {
        if (type === C.STR_LN_WITHDRAW) {
          this.handleAddressScanned();
        } else {
          this.handleBoltScanned();
        }
      },
    );
  };

  handleBoltScanned = async () => {
    const {scannedQRdata} = this.state;
    const invoice = await this.props.decodeBolt(scannedQRdata);
    const {walletInfo} = this.props.route.params;

    if (invoice?.amount_msat) {
      this.props.navigation.navigate('LnInvoiceConfirm', {
        invoice,
        walletInfo,
        bolt11: scannedQRdata,
      });
    }
  };

  handleAddressScanned = () => {
    const {walletInfo} = this.props.route.params;
    const {scannedQRdata} = this.state;
    this.props.navigation.navigate('BtcSendTxnInputAmount', {
      txnInfo: {address: scannedQRdata},
      walletInfo,
    });
  };
  handleContinueBtn = async () => {
    const {
      walletInfo,
      walletInfo: {type},
    } = this.props.route.params;
    const {scannedQRdata} = this.state;
    if (type === C.STR_LN_WALLET_TYPE) {
      // Bolt scanned
      const invoice = await this.props.decodeBolt(scannedQRdata);
      if (invoice?.amount_msat) {
        this.props.navigation.navigate('LnInvoiceConfirm', {
          invoice,
          walletInfo,
          bolt11: scannedQRdata,
        });
      }
    } else {
      // Normal btc Txn or 'Withdraw'
      this.props.navigation.navigate('BtcSendTxnInputAmount', {
        txnInfo: {address: scannedQRdata},
        walletInfo,
      });
    }
  };

  handleBackButton = () => {
    const {walletInfo} = this.props.route.params;
    const {type} = walletInfo;
    if (type === C.STR_LN_WITHDRAW) {
      this.props.navigation.goBack();
    } else {
      this.props.navigation.navigate('Account', {walletInfo});
    }
  };

  inputAddr = address => {
    this.setState({scannedQRdata: address});
  };

  render() {
    const {showModal, scannedQRdata} = this.state;
    const {loading, error} = this.props.lnWallet;
    const {
      walletInfo: {type, label, backIcon},
    } = this.props.route.params;
    const placeHolder =
      type === C.STR_LN_WALLET_TYPE ? C.STR_Enter_bolt : C.STR_Enter_addr;
    if (error && scannedQRdata) {
      return (
        <ErrorScreen
          title={C.STR_ERROR_transaction}
          desc={C.STR_ERROR_btc_txn_error}
          error={error}
          actions={[
            {
              text: C.STR_GO_BACK,
              onPress: () => this.props.navigation.goBack(),
            },
          ]}
        />
      );
    }
    return (
      <View style={styles.mainView}>
        <View style={styles.contentView}>
          <TouchableOpacity
            style={styles.backNavView}
            onPress={() => this.handleBackButton()}>
            <Image source={Images.icon_back} style={styles.backImg} />
            <Image source={backIcon} style={styles.btcImg} />
            <Text style={styles.backNavTxt}>{label}</Text>
          </TouchableOpacity>

          <View style={styles.titleStyle}>
            <Text style={styles.commentTxt}>{placeHolder}</Text>
            <Text style={styles.commentTxt}>{C.SCAN_ORSCAN}</Text>
          </View>

          <View style={styles.inputView}>
            <TextInput
              placeholder={placeHolder}
              placeholderTextColor="white"
              style={styles.inputTxtStyle}
              value={scannedQRdata}
              onChangeText={add => this.inputAddr(add)}
            />
          </View>
          <View
            style={[styles.qrScanView]}
            onTouchEnd={() => {
              this.setState({showModal: true});
            }}>
            <TouchableOpacity>
              <Image source={Images.img_camera} style={styles.cameraImg} />
            </TouchableOpacity>
          </View>
          {loading && <ActivityIndicator size="large" style={styles.spinner} />}
          <TouchableOpacity
            onPress={() => this.handleContinueBtn()}
            disabled={scannedQRdata && !loading ? false : true}>
            <View
              style={[
                styles.continueBtnView,
                {opacity: scannedQRdata && !loading ? 1 : 0.5},
              ]}>
              <Text style={styles.continueTxt}>{C.STR_CONTINUE}</Text>
              <Image
                source={Images.icon_up_blue}
                style={{width: 20, height: 20, marginLeft: 20}}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Modal
          visible={showModal}
          animationType="fade"
          onRequestClose={() => this.setState({showModal: false})}
          presentationStyle="fullScreen">
          <SifirQrCodeCamera closeHandler={this.closeModal} />
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    lnWallet: state.lnWallet,
  };
};

const mapDispatchToProps = {
  decodeBolt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirGetAddrScreen);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    position: 'relative',
  },
  contentView: {
    paddingTop: 20,
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
  spinner: {
    marginTop: 20,
  },
});
