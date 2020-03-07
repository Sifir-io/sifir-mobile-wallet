import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import SifirWalletButton from '@elements/SifirWalletButton';
import {getBtcWalletList} from '@actions/btcwallet';
import {getLnNodeInfo, createInvoice} from '@actions/lnWallet';
import {Images, AppStyle, C} from '@common/index';
import {Alert} from 'react-native';

class SifirAccountsListScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    // FIXME combine to one init function

    this.props.getBtcWalletList();
    this.props.getLnNodeInfo();
    // TODO remove createInvoice method from this component,it was added for testing purpose.
    // const inv = {
    //   msatoshi: 123,
    //   label: 'another invoice ' + new Date().getSeconds(),
    //   description: 'desc here',
    //   expiry: 100000000,
    //   callback_url: 'CallBackUrl',
    // };
    // this.props.createInvoice(inv);
  }

  render() {
    const CARD_SIZE = C.SCREEN_WIDTH / 2 - 40;
    const {navigate} = this.props.navigation;
    const {
      btcWallet: {
        btcWalletList,
        loaded: btcLoaded,
        loading: btcLoading,
        error: btcError,
      },
      lnWallet: {
        nodeInfo,
        loaded: lnLoaded,
        loading: lnLoading,
        error: lnError,
      },
    } = this.props;
    if (btcError) {
      Alert.alert(
        C.STR_ERROR_btc_action,
        C.STR_ERROR_account_list_screen,
        [
          {
            text: 'Try again',
            onPress: () => this.props.getBtcWalletList(),
          },
        ],
        {cancelable: false},
      );
    }
    if (lnError) {
      Alert.alert(
        C.STR_ERROR_btc_action,
        C.STR_ERROR_account_list_screen,
        [
          {
            text: 'Try again',
            onPress: () => this.props.getLnNodeInfo(),
          },
        ],
        {cancelable: false},
      );
    }
    return (
      <View style={styles.mainView}>
        <View style={styles.settingView}>
          <TouchableOpacity>
            <Image source={Images.icon_setting} style={styles.settingImage} />
          </TouchableOpacity>
        </View>
        {btcLoading === true && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={AppStyle.mainColor} />
          </View>
        )}
        <View style={styles.girdView}>
          {btcLoaded === true &&
            btcLoading === false &&
            btcWalletList.map((wallet, i) => (
              <SifirWalletButton
                key={wallet.label}
                width={CARD_SIZE}
                height={CARD_SIZE * 1.1}
                walletInfo={wallet}
                navigate={navigate}
              />
            ))}
          {lnLoaded === true &&
            lnLoading === false &&
            nodeInfo.map((info, i) => {
              return (
                <SifirWalletButton
                  key={info.alias}
                  width={CARD_SIZE}
                  height={CARD_SIZE * 1.1}
                  walletInfo={info}
                  navigate={navigate}
                />
              );
            })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  settingView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 30,
    marginTop: 10,
    height: 100,
  },
  settingImage: {
    width: 35,
    height: 35,
  },
  mainView: {
    flex: 1,
    display: 'flex',
    width: '100%',
    backgroundColor: AppStyle.backgroundColor,
  },
  girdView: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -25,
    padding: 30,
    justifyContent: 'space-between',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    btcWallet: state.btcWallet,
    lnWallet: state.lnWallet,
  };
};

const mapDispatchToProps = {getBtcWalletList, getLnNodeInfo, createInvoice};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirAccountsListScreen);
