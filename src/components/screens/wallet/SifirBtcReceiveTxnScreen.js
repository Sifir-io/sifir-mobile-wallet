import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import Overlay from 'react-native-modal-overlay';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';

import {Images, AppStyle, Constants} from '@common';
import SifirNotificationModal from '@elements/SifirNotificationModal';
export default class SifirBtcReceiveTxnScreen extends Component {
  state = {
    btnStatus: 0,
    modalVisible: false,
    checkStatus: true,
    addrType: 'Select address type',
    receivedModal: false,
    sender: '#1243243523523',
    amount: '0.0123',
  };

  onClose = () => this.setState({modalVisible: false, receivedModal: false});

  onShare = async () => {
    const shareOptions = {
      title: 'Sifir',
      message: this.props.address,
    };
    await Share.open(shareOptions);
  };

  render() {
    const {navigate} = this.props.navigation;

    return (
      <View style={styles.mainView}>
        <View style={styles.settingView}>
          <TouchableOpacity>
            <View
              style={styles.backNavStyle}
              onTouchEnd={() => navigate('Account')}>
              <Image source={Images.icon_back} style={styles.backImg} />
              <Image source={Images.icon_btc_cir} style={styles.btcImg} />
              <Text style={styles.backTxt}>{Constants.STR_RECEIVE}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={Images.icon_setting}
              style={{width: 30, height: 30, marginRight: 20}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.qrCodeView}>
          <QRCode
            value={this.props.address}
            size={Constants.SCREEN_HEIGHT * 0.25}
            backgroundColor="white"
          />
        </View>

        <View style={styles.selectAddrView}>
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
        <View style={styles.watchAddrView}>
          <Text style={styles.watchTxt}>{Constants.STR_WATCH_ADDR}</Text>
          <TouchableOpacity
            onPressOut={() =>
              this.setState({checkStatus: !this.state.checkStatus})
            }>
            <View style={{position: 'relative'}}>
              <Image
                source={Images.icon_rectangle}
                style={styles.watchRectImg}
              />
              {this.state.checkStatus == true && (
                <Image
                  source={Images.icon_check_white}
                  style={styles.chkIconImg}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPressOut={() => {
            // this.setState({receivedModal: true});
            this.onShare();
          }}
          style={styles.shareBtnOpa}>
          <View
            shadowColor="black"
            shadowOffset="30"
            style={styles.shareBtnView}>
            <Text style={styles.shareBtnTxt}>{Constants.STR_SHARE}</Text>
            <Image
              source={Images.icon_network}
              style={{width: 28, height: 30}}
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
                {key: '1 - Legacy'},
                {key: '2 - Segwit Compatible'},
                {key: '3 -  Bech32'},
              ]}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    width: Constants.SCREEN_WIDTH,
                    marginLeft: 15,
                  }}
                  onPressOut={() => {
                    this.setState({addrType: item.key});
                    hideModal();
                  }}>
                  <Text style={styles.item}>{item.key}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </Overlay>
        <SifirNotificationModal
          visible={this.state.receivedModal}
          marginTop={100}
          onClose={this.onClose}
          nextScreen="BtcTxnConfirmed"
          nextScreenData={{
            address: this.state.sender,
            amount: this.state.amount,
            isSendTxn: false,
          }}
          title={Constants.STR_YOU + ' ' + Constants.STR_RECEIVED}
          content={this.state.amount + Constants.STR_BTC}
          navigate={this.props.navigation.navigate}
        />
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
    position: 'relative',
    alignItems: 'center',
  },
  settingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Constants.SCREEN_WIDTH,
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
    width: Constants.SCREEN_WIDTH - 50,
    height: 10 * vh,
    alignItems: 'center',
    marginTop: 4 * vh,
    justifyContent: 'space-between',
  },
  selectBtnView: {
    flexDirection: 'row',
    marginRight: 15,
    alignItems: 'center',
  },
  shareBtnView: {
    width: Constants.SCREEN_WIDTH * 0.7,
    flexDirection: 'row',
    height: 10.5 * vh,
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
    width: Constants.SCREEN_WIDTH,
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
    marginTop: 5 * vh,
    height: 27 * vh,
    width: 27 * vh,
    backgroundColor: 'white',
  },
  shareBtnOpa: {marginTop: 3 * vh, alignItems: 'center'},
  watchTxt: {fontSize: 3.4 * vh, color: AppStyle.mainColor, marginLeft: 30},
  selectAddrTxt: {fontSize: 3.3 * vh, marginLeft: 10, color: 'white'},
  selectLineImg: {height: 5.2 * vh, width: 2, marginRight: 20},
  watchRectImg: {width: 5.5 * vh, height: 5.5 * vh, marginRight: 30},
  chkIconImg: {
    width: 5.5 * vh,
    height: 5.5 * vh,
    marginRight: 30,
    position: 'absolute',
    zIndex: 100,
    top: -2 * vh,
    left: 8,
  },
});
