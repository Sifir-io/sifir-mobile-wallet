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
import {getLnNodeInfo} from '@actions/lnWallet';
import {Images, AppStyle, C} from '@common/index';
import {ErrorScreen} from '@screens/error';
import Overlay from 'react-native-modal-overlay';
import SifirSettingModal from '@elements/SifirSettingModal';

class SifirAccountsListScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.lnWalletInfo = null;
  }
  state = {
    modalVisible: false,
  };

  componentDidMount() {
    // FIXME combine to one init function
    this.props.getBtcWalletList();
    this.props.getLnNodeInfo();
    const {
      props: {getBtcWalletList: getWallets},
    } = this;
    this.stopLoading = this.props.navigation.addListener('focus', getWallets);
    // getWallets();
  }
  componentWillUnmount() {
    this.stopLoading();
  }

  handleMenuBtn() {
    this.setState({modalVisible: !this.state.modalVisible});
  }

  onClose = () => this.setState({modalVisible: false});

  render() {
    const CARD_SIZE = C.SCREEN_WIDTH / 2 - 40;
    const {navigate} = this.props.navigation;
    const {
      btcWallet: {btcWalletList, loaded, loading, error},
      lnWallet: {
        nodeInfo,
        loaded: lnLoaded,
        loading: lnLoading,
        nodeError: lnError,
      },
    } = this.props;
    if (error || lnError) {
      return (
        <ErrorScreen
          title={C.STR_ERROR_btc_action}
          desc={C.STR_ERROR_account_list_screen}
          actions={[
            {
              text: C.STR_TRY_AGAIN,
              onPress: () =>
                error
                  ? this.props.getBtcWalletList()
                  : this.props.getLnNodeInfo(),
            },
          ]}
        />
      );
    }
    return (
      <View style={styles.mainView}>
        <View style={styles.settingView}>
          <TouchableOpacity
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
              hideModal={() => this.handleMenuBtn()}
              showOpenChannel={true}
              showTopUp={true}
              showWithdraw={true}
              walletInfo={this.lnWalletInfo}
            />
          </View>
        )}
        {loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={AppStyle.mainColor} />
          </View>
        )}
        <View style={styles.gridView}>
          {loaded === true &&
            loading === false &&
            btcWalletList.map((wallet, i) => (
              <SifirWalletButton
                key={wallet.label}
                width={CARD_SIZE}
                height={CARD_SIZE * 1.1}
                walletInfo={wallet}
                navigate={navigate}
              />
            ))}
          {loaded && lnLoading && (
            <View style={styles.LnSpinner}>
              <ActivityIndicator size="large" color={AppStyle.mainColor} />
            </View>
          )}
          {lnLoaded === true &&
            lnLoading === false &&
            nodeInfo.map((info, i) => {
              this.lnWalletInfo = info;
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

const mapDispatchToProps = {getBtcWalletList, getLnNodeInfo};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirAccountsListScreen);
