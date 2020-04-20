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
import {getBtcWalletList, getBlockChainInfo} from '@actions/btcwallet';
import {getLnNodesList} from '@actions/lnWallet';
import {Images, AppStyle, C} from '@common/index';
import {ErrorScreen} from '@screens/error';
import SifirSettingModal from '@elements/SifirSettingModal';

class SifirAccountsListScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  state = {
    modalVisible: false,
  };

  _init = () => {
    this.props.getBtcWalletList();
    this.props.getLnNodesList();
  };

  componentDidMount() {
    this.stopLoading = this.props.navigation.addListener(
      'focus',
      this._init.bind(this),
    );
  }
  componentWillUnmount() {
    this.stopLoading();
  }

  handleMenuBtn() {
    if (this.state.modalVisible) {
      this.setState({modalVisible: !this.state.modalVisible});
    } else {
      this.props.getBlockChainInfo();
      this.setState({modalVisible: !this.state.modalVisible});
    }
  }

  onClose = () => this.setState({modalVisible: false});

  render() {
    const CARD_SIZE = C.SCREEN_WIDTH / 2 - 40;
    // const {navigate} = this.props.navigation;
    const {
      _init,
      props: {
        btcWallet: {btcWalletList, chainInfo, loading, error},
        lnWallet: {nodeInfo, loading: lnLoading, nodeError: lnError},
        navigation: {navigate},
      },
    } = this;
    if (error || lnError) {
      return (
        <ErrorScreen
          title={C.STR_ERROR_btc_action}
          desc={C.STR_ERROR_account_list_screen}
          actions={[
            {
              text: C.STR_TRY_AGAIN,
              onPress: _init.bind(this),
            },
          ]}
        />
      );
    }
    return (
      <View style={styles.mainView}>
        <View style={styles.settingView}>
          {(loading || lnLoading) && btcWalletList.length !== 0 && (
            <ActivityIndicator size="large" color={AppStyle.mainColor} />
          )}
          <View />
          <TouchableOpacity
            activeOpacity={1}
            disabled={loading || lnLoading}
            onPress={() => this.handleMenuBtn()}>
            <Image source={Images.icon_setting} style={styles.settingImage} />
          </TouchableOpacity>
        </View>
        {this.state.modalVisible && (
          <View
            style={styles.settingMenuContainer}
            onTouchEnd={() => this.handleMenuBtn()}>
            <SifirSettingModal
              toolTipStyle={true}
              isLoading={loading}
              menuItems={[
                {
                  label: `CONNECTION: ${
                    chainInfo?.chain ? 'CONNECTED' : 'NO CONNECTION'
                  }`,
                },
                {
                  label: `CHAIN: ${
                    chainInfo?.chain ? chainInfo.chain.toUpperCase() : 'NA'
                  }`,
                },
                {
                  label: `BLOCKS: ${
                    chainInfo?.blocks ? chainInfo.blocks : 'NA'
                  }`,
                },
              ]}
              hideModal={() => this.handleMenuBtn()}
            />
          </View>
        )}
        {btcWalletList.length === 0 && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={AppStyle.mainColor} />
          </View>
        )}

        <View style={styles.gridView}>
          {btcWalletList.map((wallet, i) => (
            <SifirWalletButton
              key={wallet.label}
              width={CARD_SIZE}
              height={CARD_SIZE * 1.1}
              walletInfo={wallet}
              navigate={navigate}
            />
          ))}
          {nodeInfo.map((info, i) => {
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
    justifyContent: 'space-between',
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
  gridView: {
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
  overlayContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
  },
  LnSpinner: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  settingMenuContainer: {
    position: 'absolute',
    paddingTop: 80,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: '100%',
    elevation: 10,
    zIndex: 10,
  },
});

const mapStateToProps = state => {
  return {
    btcWallet: state.btcWallet,
    lnWallet: state.lnWallet,
  };
};

const mapDispatchToProps = {
  getBtcWalletList,
  getLnNodesList,
  getBlockChainInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirAccountsListScreen);
