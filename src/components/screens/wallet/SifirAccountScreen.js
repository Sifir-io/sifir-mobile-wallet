import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {Images, AppStyle, C} from '@common/index';
import {getWalletDetails} from '@actions/btcwallet';
import {getLnWalletDetails} from '@actions/lnWallet';
import SifirTxnList from '@elements/SifirTxnList';
import SifirAccountHeader from '@elements/SifirAccountHeader';
import SifirAccountActions from '@elements/SifirAccountActions';
import SifirAccountHistory from '@elements/SifirAccountHistory';
import {Alert} from 'react-native';

class SifirAccountScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  state = {
    balance: 0,
    txnData: null,
    invoices: null,
    btcUnit: C.STR_BTC,
  };
  async _loadWalletFromProps() {
    const {label, type} = this.props.route.params.walletInfo;
    if (type === C.STR_LN_WALLET_TYPE) {
      const {
        inChannelBalance,
        outputBalance,
        invoices,
      } = await this.props.getLnWalletDetails({
        label,
        type,
      });
      const balance = inChannelBalance + outputBalance;
      this.setState({balance, invoices});
    } else {
      const {balance, txnData} = await this.props.getWalletDetails({
        label,
        type,
      });
      this.setState({balance, txnData});
    }
  }
  componentDidMount() {
    this._loadWalletFromProps();
  }

  render() {
    const {balance, invoices, btcUnit, txnData} = this.state;
    const {navigate} = this.props.navigation;
    const {label, type} = this.props.route.params.walletInfo;
    const {loading, loaded, error} = this.props.btcWallet;
    const {loading: loadingLN} = this.props.lnWallet;
    const {walletInfo} = this.props.route.params;
    if (error) {
      Alert.alert(
        C.STR_ERROR_btc_action,
        C.STR_ERROR_account_screen,
        [
          {
            text: 'Try again',
            onPress: () => this._loadWalletFromProps(),
          },
        ],
        {cancelable: false},
      );
    }
    return (
      <View style={styles.mainView}>
        <View style={{flex: 0.7}}>
          <TouchableOpacity>
            <View
              style={styles.backNavView}
              onTouchEnd={() => navigate('AccountList')}>
              <Image source={Images.icon_back} style={styles.backImg} />
              <Text style={styles.backNavTxt}>{C.STR_My_Wallets}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <SifirAccountHeader
          loading={loading}
          loaded={loaded}
          type={type}
          label={label}
          balance={balance}
          btcUnit={btcUnit}
        />
        <SifirAccountActions
          navigate={navigate}
          type={type}
          label={label}
          walletInfo={walletInfo}
        />
        <SifirAccountHistory
          loading={loading}
          loadingLN={loadingLN}
          loaded={loaded}
          invoices={invoices}
          txnData={txnData}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    btcWallet: state.btcWallet,
    lnWallet: state.lnWallet,
  };
};

const mapDispatchToProps = {
  getWalletDetails,
  getLnWalletDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(SifirAccountScreen);

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor,
  },

  backNavView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 7,
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

  satTxt: {
    color: 'white',
    fontSize: 26,
    fontFamily: AppStyle.mainFont,
    textAlignVertical: 'bottom',
    marginBottom: 7,
    marginLeft: 5,
  },
});
