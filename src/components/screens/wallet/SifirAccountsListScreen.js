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
import {Images, AppStyle, C} from '@common/index';

class SifirAccountsListScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.props.getBtcWalletList();
  }

  render() {
    const CARD_SIZE = C.SCREEN_WIDTH / 2 - 40;
    const {navigate} = this.props.navigation;
    const {
      btcWallet: {btcWalletList, loaded, loading},
    } = this.props;
    return (
      <View style={styles.mainView}>
        <View style={styles.settingView}>
          <TouchableOpacity>
            <Image source={Images.icon_setting} style={styles.settingImage} />
          </TouchableOpacity>
        </View>
        {loading === true && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={AppStyle.mainColor} />
          </View>
        )}
        <View style={styles.girdView}>
          {loaded === true &&
            loading === false &&
            btcWalletList.map((wallet, i) => (
              <SifirWalletButton
                key={i}
                width={CARD_SIZE}
                height={CARD_SIZE * 1.1}
                walletInfo={wallet}
                navigate={navigate}
              />
            ))}
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
  };
};

const mapDispatchToProps = {getBtcWalletList};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirAccountsListScreen);
