import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import Overlay from 'react-native-modal-overlay';
import SifirQRCode from '@elements/SifirQRCode';
import Share from 'react-native-share';

import {getWalletAddress} from '@actions/btcwallet';
import {Images, AppStyle, C} from '@common/index';
import {log, error} from '@io/events/';

class SifirBtcReceiveTxnScreen extends Component {
  constructor(props) {
    super(props);
    this.qrCode = '';
  }

  state = {
    btnStatus: 0,
    modalVisible: false,
    checkStatus: true,
    label: '',
    type: '',
    addrType: C.STR_SELECT_ADDRTYPE,
    showQRCode: false,
    showSelector: false,
    enableWatchSelection: false,
  };

  componentDidMount() {
    const {label, type} = this.props.route.params.walletInfo;
    this.setState({label, type});
    if (type === C.STR_WATCH_WALLET_TYPE) {
      this.props.getWalletAddress({label, type});
      this.setState({showQRCode: true});
    }
  }

  onClose = () => this.setState({modalVisible: false, showSelector: false});

  onShare = (address, isQRCode) => {
    this.setState({showSelector: false});
    if (this.qrCode) {
      let shareOptions;
      if (isQRCode) {
        shareOptions = {
          type: 'image/jpg',
          title: C.STR_ADDR_QR_SHARE,
          url: this.qrCode,
        };
      } else {
        shareOptions = {
          title: C.STR_ADDR_SHARE,
          message: address,
        };
      }
      Share.open(shareOptions).catch(err => error(err));
    }
  };

  getSpendWalletAddr = async addrType => {
    const {label, type} = this.state;
    await this.props.getWalletAddress({label, type, addrType});
    this.setState({showQRCode: true});
  };
  render() {
    const {navigate} = this.props.navigation;
    const {type, label, showQRCode, enableWatchSelection} = this.state;
    const {loaded, loading, address, error} = this.props.btcWallet;

    return (
      <View style={styles.mainView}>
        <View style={styles.settingView}>
          <TouchableOpacity>
            <View
              style={styles.backNavStyle}
              onTouchEnd={() => navigate('Account')}>
              <Image source={Images.icon_back} style={styles.backImg} />
              <Image source={Images.icon_btc_cir} style={styles.btcImg} />
              <Text style={styles.backTxt}>{label} Wallet</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={Images.icon_setting}
              style={{width: 30, height: 30, marginRight: 20}}
            />
          </TouchableOpacity>
        </View>

        {type === C.STR_SPEND_WALLET_TYPE && (
          <View
            style={[
              styles.selectAddrView,
              showQRCode === false || (showQRCode === true && loading === true)
                ? {marginBottom: 50 * C.vh}
                : {},
            ]}>
            <TouchableOpacity
              onPressOut={() => this.setState({modalVisible: true})}>
              <Text placeholderTextColor="white" style={styles.selectAddrTxt}>
                {this.state.addrType}
              </Text>
            </TouchableOpacity>

            <View style={styles.selectBtnView}>
              <Image
                source={Images.icon_vertical_line}
                style={styles.selectLineImg}
              />
              <TouchableOpacity
                onPressOut={() => {
                  this.setState({modalVisible: !this.state.modalVisible});
                }}>
                <Image
                  source={Images.icon_check_blue}
                  style={{height: 20, width: 20}}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {address !== null && loaded === true && showQRCode === true && (
          <>
            <View style={styles.qrCodeView}>
              <SifirQRCode
                getBase64={base64 => {
                  this.qrCode = base64;
                }}
                value={address}
                size={C.SCREEN_HEIGHT * 0.25}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </View>
            <Text style={styles.addrTxt}>{address}</Text>
          </>
        )}

        {loading === true && (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" color={AppStyle.mainColor} />
          </View>
        )}

        {address != null && loaded === true && (
          <>
            {enableWatchSelection === true && (
              <View style={styles.watchAddrView}>
                <Text style={styles.watchTxt}>{C.STR_WATCH_ADDR}</Text>
                <TouchableOpacity
                  onPressOut={() =>
                    this.setState({checkStatus: !this.state.checkStatus})
                  }>
                  <View style={{position: 'relative'}}>
                    <Image
                      source={Images.icon_rectangle}
                      style={styles.watchRectImg}
                    />
                    {this.state.checkStatus === true && (
                      <Image
                        source={Images.icon_check_white}
                        style={styles.chkIconImg}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              onPressOut={() => {
                this.setState({showSelector: true});
              }}
              style={styles.shareBtnOpa}>
              <View
                shadowColor="black"
                shadowOffset="30"
                style={styles.shareBtnView}>
                <Text style={styles.shareBtnTxt}>{C.STR_SHARE}</Text>
                <Image
                  source={Images.icon_network}
                  style={{width: 28, height: 30}}
                />
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* Select share type */}
        <Overlay
          visible={this.state.showSelector}
          onClose={this.onClose}
          closeOnTouchOutside
          animationType="zoomIn"
          containerStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 15,
          }}
          childrenWrapperStyle={styles.dlgChild}
          animationDuration={300}>
          {() => (
            <View>
              <View style={styles.shareModal}>
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    style={{flex: 1}}
                    onPressOut={() => {
                      this.onShare(address, true);
                    }}>
                    <View style={styles.shareRow}>
                      <Text style={styles.shareTxt}>{C.STR_ADDR_QR_SHARE}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{flex: 1}}
                    onPressOut={() => {
                      this.onShare(address, false);
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.shareTxt}>{C.STR_ADDR_SHARE}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.shareModalBottom}>
                <TouchableOpacity>
                  <Image
                    source={Images.icon_dialog_arrow}
                    style={{height: 40, width: 40, marginRight: 10}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Overlay>

        {/* Select the Address type in the Spending Wallet */}
        <Overlay
          visible={this.state.modalVisible}
          onClose={this.onClose}
          closeOnTouchOutside
          animationType="zoomIn"
          containerStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
          childrenWrapperStyle={{
            marginTop: 110,
            backgroundColor: 'transparent',
          }}
          animationDuration={500}>
          {hideModal => (
            <FlatList
              style={styles.addList}
              data={[
                {title: C.STR_LEGACY, addrType: 'legacy'},
                {title: C.STR_Segwit_Compatible, addrType: 'p2sh-segwit'},
                {title: C.STR_Bech32, addrType: 'bech32'},
              ]}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    width: C.SCREEN_WIDTH,
                    marginLeft: 15,
                  }}
                  onPressOut={() => {
                    this.setState({addrType: item.title});
                    this.getSpendWalletAddr(item.addrType);
                    hideModal();
                  }}>
                  <Text style={styles.item}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </Overlay>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    btcWallet: state.btcWallet,
  };
};

const mapDispatchToProps = {getWalletAddress};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirBtcReceiveTxnScreen);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loadingView: {justifyContent: 'center', position: 'absolute', top: 40 * C.vh},
  settingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: C.SCREEN_WIDTH,
  },
  backNavStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 0,
    marginLeft: 13,
  },
  backTxt: {
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
  selectAddrView: {
    flexDirection: 'row',
    borderRadius: 15,
    borderColor: AppStyle.mainColor,
    borderWidth: 1,
    width: C.SCREEN_WIDTH - 50,
    height: 10 * C.vh,
    alignItems: 'center',
    marginTop: 4 * C.vh,
    justifyContent: 'space-between',
  },
  selectBtnView: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },
  shareBtnView: {
    width: C.SCREEN_WIDTH * 0.7,
    flexDirection: 'row',
    height: 10.5 * C.vh,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  shareBtnTxt: {
    color: AppStyle.backgroundColor,
    fontWeight: 'bold',
    fontSize: 26,
    marginRight: 15,
  },
  shareTxt: {
    fontFamily: AppStyle.mainFont,
    fontSize: 17,
    marginLeft: 10,
  },
  shareModal: {
    borderRadius: 15,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 10,
    height: 120,
    width: C.SCREEN_WIDTH * 0.6,
  },
  shareRow: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  shareModalBottom: {
    flexDirection: 'row-reverse',
    marginBottom: 8,
    marginTop: -21,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    flex: 1,
  },
  watchAddrView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: C.SCREEN_WIDTH,
    marginTop: 20,
  },
  addList: {
    color: 'white',
    height: 140,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  qrCodeView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5 * C.vh,
    height: 27 * C.vh,
    width: 27 * C.vh,
    backgroundColor: 'white',
  },
  shareBtnOpa: {
    marginTop: 2 * C.vh,
    alignItems: 'center',
    marginBottom: 3 * C.vh,
  },
  watchTxt: {fontSize: 3.4 * C.vh, color: AppStyle.mainColor, marginLeft: 30},
  selectAddrTxt: {fontSize: 3.3 * C.vh, marginLeft: 10, color: 'white'},
  selectLineImg: {height: 5.2 * C.vh, width: 2, marginRight: 20},
  watchRectImg: {width: 5.5 * C.vh, height: 5.5 * C.vh, marginRight: 30},
  chkIconImg: {
    width: 5.5 * C.vh,
    height: 5.5 * C.vh,
    marginRight: 30,
    position: 'absolute',
    zIndex: 100,
    top: -2 * C.vh,
    left: 8,
  },
  dlgChild: {
    marginTop: 40 * C.vh,
    backgroundColor: 'transparent',
  },
  addrTxt: {
    fontSize: 16,
    color: 'white',
  },
});
