import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';

import SifirWalletButton from '@elements/SifirWalletButton';
import {getWalletList} from '@store/states/walletList';

import {Images, AppStyle, Constants} from '@common/index';

class SifirAccountsListScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }
  componentDidMount() {
    this.props.getWalletList();
  }

  render() {
    const CARD_SIZE = Constants.SCREEN_WIDTH / 2 - 40;
    const {navigate} = this.props.navigation;
    const {data, error, loaded, loading} = this.props.walletList;

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
            data.map((item, i) => (
              <SifirWalletButton
                key={i}
                width={CARD_SIZE}
                height={CARD_SIZE * 1.1}
                iconURL={Images[item[0]]}
                iconClickedURL={Images[item[1]]}
                str1={item[2]}
                str2={item[3]}
                navigatePage={item[4]}
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
    marginTop: -10,
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
    walletList: state.walletList,
  };
};

const mapDispatchToProps = {
  getWalletList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirAccountsListScreen);
