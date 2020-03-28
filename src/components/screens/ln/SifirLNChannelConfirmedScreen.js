import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {Images, AppStyle, C} from '@common/index';
class SifirLNChannelConfirmedScreen extends Component {
  render() {
    const {fundingResponse, walletInfo} = this.props.route.params;
    return (
      <ScrollView contentContainerStyle={styles.sv}>
        <View style={styles.mainView}>
          <View style={styles.container}>
            <Image source={Images.icon_done} style={styles.checkImg} />
            <Text style={styles.paymentTxt}>{C.STR_OPEN_CHANNEL}</Text>
            {!fundingResponse.result && (
              <Text style={styles.payAddrTxt}>{C.STR_REQUEST_SENT}</Text>
            )}
            <Text style={styles.addrTxt}>{fundingResponse.message}</Text>
            {fundingResponse.result && (
              <>
                <Text style={styles.addrTxt}>TxID</Text>
                <Text style={styles.payAddrTxt}>{fundingResponse.txid}</Text>
                <Text style={styles.addrTxt}>Channel ID</Text>
                <Text style={styles.payAddrTxt}>
                  {fundingResponse.channel_id}
                </Text>
              </>
            )}
          </View>
          <TouchableOpacity
            style={styles.doneTouch}
            onPressOut={() =>
              this.props.navigation.navigate('LnNodeSelect', {walletInfo})
            }>
            <View shadowColor="black" shadowOffset="30" style={styles.doneView}>
              <Text style={styles.doneTxt}>{C.STR_DONE}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    lnWallet: state.lnWallet,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirLNChannelConfirmedScreen);

const styles = StyleSheet.create({
  sv: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    flex: 3,
  },
  mainView: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
    paddingVertical: 15,
  },
  doneView: {
    width: C.SCREEN_WIDTH * 0.5,
    flexDirection: 'row',
    height: 9.5 * C.vh,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
  paymentTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 10 * C.vh,
    marginTop: 10,
    textAlign: 'center',
  },
  addressLblTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 10 * C.vh,
    marginTop: -30,
  },
  payAddrTxt: {
    color: AppStyle.mainColor,
    marginTop: 20,
    fontFamily: AppStyle.mainFontBold,
    textAlign: 'center',
  },
  addrTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 28,
    marginTop: 5,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  amountLblTxt: {
    color: AppStyle.mainColor,
    fontSize: 16,
    marginTop: 25,
    fontFamily: AppStyle.mainFontBold,
  },
  amountTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 28,
    marginTop: 5,
  },
  doneTouch: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  doneTxt: {
    color: AppStyle.backgroundColor,
    fontWeight: 'bold',
    fontSize: 26,
    marginRight: 15,
  },
  checkImg: {width: 8 * C.vh, height: 8 * C.vh, marginTop: 2 * C.vh},
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
