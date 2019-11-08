import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import {Images, AppStyle, Constants} from '@common/index';
import {getWallet} from '@store/states/wallet';

class SifirAccountScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.props.getWallet();
  }
  state = {
    btnStatus: 0,
  };

  render() {
    const {navigate} = this.props.navigation;

    const {btnStatus} = this.state;
    const BTN_WIDTH = Constants.SCREEN_WIDTH / 2;

    const {data, error, loaded, loading} = this.props.wallet;
    const {txnData, walletName, walletType, balanceAmount, balanceType} = data;
    return (
      <View style={styles.mainView}>
        <View style={{flex: 0.7}}>
          <TouchableOpacity>
            <View
              style={styles.backNavView}
              onTouchEnd={() => navigate('AccountsList')}>
              <Image source={Images.icon_back} style={styles.backImg} />
              <Text style={styles.backNavTxt}>{Constants.STR_My_Wallets}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.headerView}>
          <LinearGradient
            height={BTN_WIDTH - 50}
            width={BTN_WIDTH - 40}
            colors={['#52d4cd', '#54a5b1', '#57658c']}
            style={styles.gradient}>
            <View>
              <Image source={Images.icon_bitcoin} style={styles.boxImage} />
              {loading === true && (
                <ActivityIndicator size="large" color={AppStyle.mainColor} />
              )}
              {loaded === true && loading === false && (
                <>
                  <Text style={styles.boxTxt}>{walletName}</Text>
                  <Text style={styles.boxTxt}>{walletType}</Text>
                </>
              )}
            </View>
          </LinearGradient>
          <View
            height={BTN_WIDTH - 30}
            width={BTN_WIDTH - 30}
            style={styles.balanceView}>
            {loading === true && (
              <ActivityIndicator size="large" color={AppStyle.mainColor} />
            )}
            {loaded === true && loading === false && (
              <>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.balAmountTxt}>{balanceAmount}</Text>
                  <Text style={styles.satTxt}>{balanceType}</Text>
                </View>
                <Text style={styles.balanceTxt}>
                  {Constants.STR_Cur_Balance}
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.btnAreaView}>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPressIn={() => this.setState({btnStatus: 1})}
            onPressOut={() => {
              this.setState({btnStatus: 0});
              navigate('GetAddress');
            }}>
            <View
              style={[
                styles.txnBtnView,
                btnStatus === 1 ? {backgroundColor: 'black', opacity: 0.7} : {},
              ]}>
              <Text style={{color: 'white', fontSize: 15}}>
                {Constants.STR_SEND}
              </Text>
              <Image
                source={Images.icon_up_arrow}
                style={{width: 11, height: 11, marginLeft: 10}}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPressIn={() => this.setState({btnStatus: 2})}
            onPressOut={() => {
              this.setState({btnStatus: 0});
              navigate('BtcReceiveTxn', {address: '#Temp Address'});
            }}>
            <View
              style={[
                styles.txnBtnView,
                styles.leftTxnBtnView,
                btnStatus === 2 ? {backgroundColor: 'black', opacity: 0.7} : {},
              ]}>
              <Text style={[{color: 'white', fontSize: 15}]}>
                {Constants.STR_RECEIVE}
              </Text>
              <Image
                source={Images.icon_down_arrow}
                style={{width: 11, height: 11, marginLeft: 10}}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.txnSetView}>
          <Text style={styles.txnLblTxt}>{Constants.TRANSACTIONS}</Text>
          <TouchableOpacity>
            <Image
              source={Images.icon_setting}
              style={{width: 20, height: 20, marginLeft: 20, marginTop: 7}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.txnListView}>
          {loading === true && (
            <ActivityIndicator size="large" color={AppStyle.mainColor} />
          )}
          {loaded === true && loading === false && (
            <FlatList
              data={txnData}
              width={BTN_WIDTH * 2 - 50}
              style={{height: 200}}
              renderItem={({item}) => (
                <TouchableOpacity>
                  <View style={styles.listItme}>
                    <Image
                      source={Images[item.imgURL]}
                      style={{width: 30, height: 30}}
                    />
                    <View style={{flex: 5, marginLeft: 20}}>
                      <Text style={{color: AppStyle.mainColor}}>{item.s1}</Text>
                      <Text
                        style={{color: AppStyle.mainColor, fontWeight: 'bold'}}>
                        {item.s2}
                      </Text>
                    </View>
                    <Text
                      style={{
                        flex: 2,
                        color: AppStyle.mainColor,
                      }}>
                      {item.s3}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    wallet: state.wallet,
  };
};

const mapDispatchToProps = {getWallet};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirAccountScreen);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor,
  },
  leftTxnBtnView: {
    borderRightColor: 'transparent',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  headerView: {
    flex: 3,
    marginTop: 0,
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnAreaView: {
    flex: 1,
    flexDirection: 'row',
    borderColor: AppStyle.mainColor,
    borderWidth: 1,
    borderRadius: 7,
    height: 55,
    marginLeft: 26,
    marginRight: 26,
    marginTop: 30,
  },
  txnListView: {
    flex: 3,
    height: '100%',
    marginBottom: 20,
    marginLeft: 25,
  },
  boxTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 25,
    marginLeft: 13,
    marginBottom: -10,
  },
  boxImage: {
    marginBottom: 10,
    marginTop: 15,
    marginLeft: 13,
    width: 43,
    height: 43,
    opacity: 0.6,
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
  gradient: {
    flex: 4.6,
    borderRadius: 5,
    borderWidth: 1,
    borderRadius: 15,
  },
  txnBtnView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRightColor: AppStyle.mainColor,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    height: '100%',
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
  },
  listItme: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderBottomColor: AppStyle.listViewSep,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  satTxt: {
    color: 'white',
    fontSize: 26,
    fontFamily: AppStyle.mainFont,
    textAlignVertical: 'bottom',
    marginBottom: 7,
    marginLeft: 5,
  },
  balanceTxt: {
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFont,
    fontSize: 16,
    textAlignVertical: 'bottom',
    marginBottom: -5,
    marginLeft: 5,
  },
  balanceView: {
    flex: 5,
    flexDirection: 'column-reverse',
    marginLeft: 25,
    paddingBottom: 15,
  },
  txnLblTxt: {
    color: 'white',
    fontSize: 23,
    fontWeight: 'bold',
  },
  txnSetView: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 26,
    marginTop: 30,
  },
  balAmountTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 50,
  },
});
