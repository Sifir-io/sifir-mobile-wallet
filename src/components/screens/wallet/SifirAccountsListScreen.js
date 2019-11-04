import React, {Component} from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';

import SifirAccountButton from '@elements/SifirAccountButton';

import {Images, AppStyle, Constants} from '@common';

class SifirAccountsListScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const CARD_SIZE = Constants.SCREEN_WIDTH / 2 - 40;
    const {navigate} = this.props.navigation;
    const {accountsList} = this.props;

    return (
      <View style={styles.mainView}>
        <View style={styles.settingView}>
          <TouchableOpacity>
            <Image source={Images.icon_setting} style={styles.settingImage} />
          </TouchableOpacity>
        </View>
        <View style={styles.girdView}>
          {accountsList.map((item, i) => (
            <SifirAccountButton
              key={i}
              width={CARD_SIZE}
              height={CARD_SIZE * 1.1}
              iconURL={item[0]}
              iconClickedURL={item[1]}
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
});

function mapStateToProps(state) {
  return {
    accountsList: state.accountsList.data,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirAccountsListScreen);
