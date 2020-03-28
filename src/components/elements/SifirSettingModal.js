/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Slider from 'react-native-slider';

import {Images, AppStyle, C} from '@common/index';
import {useNavigation} from '@react-navigation/native';
const MenuListItem = ({label, icon, onPress, hideTopBorder = false}) => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        borderTopWidth: hideTopBorder ? 0 : 1,
        borderColor: 'rgba(0,0,0,0.1)',
      }}
      onPress={onPress}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          // TODO replace icon for Open Channels
          resizeMode="contain"
          source={icon}
          style={{
            width: 37,
            height: 37,
          }}
        />
        <Text style={styles.textStyle}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

class SifirSettingModal extends Component {
  state = {curMenu: 0, value: 0.6};

  // TODO
  // Create an array of menu items and map over it to render <MenuListItem/>, instead of manually rendering every menu item.

  render() {
    const {navigation, walletInfo} = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={this.props.hideModal}>
          <Image source={Images.icon_close} style={styles.closeImg} />
        </TouchableOpacity>
        <Image
          source={Images.icon_dialog_arrow}
          resizeMode="contain"
          style={styles.upArrow}
        />
        <View style={styles.bodyStyle}>
          {this.state.curMenu === 1 && (
            <View style={styles.timeView}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.clockImgView}>
                  <Image source={Images.icon_clock} style={styles.clockImg} />
                  <Text style={styles.setFeeTxt}>{C.STR_SET_FEES}</Text>
                </View>
                <View style={styles.feeTxtView}>
                  <Text style={styles.feeTxt}>0.015 BTC</Text>
                </View>
              </View>
              <View style={{width: '100%'}}>
                <Slider
                  animationType="spring"
                  value={this.state.value}
                  thumbTintColor="#5595a8"
                  onValueChange={value => this.setState({value})}
                  minimumTrackTintColor="#25b6fa"
                  maximumTrackTintColor="#412160"
                  thumbStyle={styles.thumb}
                  trackStyle={{
                    height: 10,
                    borderRadius: 5,
                  }}
                />
              </View>
              <View style={styles.waitView}>
                <Text style={{fontSize: 20}}>{C.STR_Wait}</Text>
                <Text style={{fontSize: 20, color: 'blue'}}>4 Hours</Text>
              </View>
            </View>
          )}
          {this.state.curMenu === 0 && (
            <View style={{flex: 1}}>
              {this.props.showManageFunds && (
                <MenuListItem
                  icon={Images.icon_funds}
                  label={C.STR_Manage_Fund}
                  onPress={() => {
                    this.setState({curMenu: 1});
                  }}
                />
              )}
              {this.props.feeSettingEnabled && (
                <MenuListItem
                  icon={Images.icon_clock}
                  label={C.STR_SET_FEES}
                  onPress={() => {
                    this.setState({curMenu: 1});
                  }}
                />
              )}
              {this.props.showSettings && (
                <MenuListItem
                  icon={Images.icon_dollar}
                  label={C.STR_SETTINGS}
                  onPress={() => {
                    this.props.hideModal();
                  }}
                />
              )}
              {this.props.showTopUp && (
                <MenuListItem
                  icon={Images.icon_funds}
                  hideTopBorder={true}
                  label={C.TOP_UP}
                  onPress={() => {
                    this.props.hideModal();
                    this.props.navigation.navigate('BtcReceiveTxn', {
                      walletInfo,
                    });
                  }}
                />
              )}
              {this.props.showWithdraw && (
                <MenuListItem
                  icon={Images.icon_dollar}
                  label={C.WITHDRAW}
                  onPress={() => {
                    this.props.hideModal();
                    this.props.navigation.navigate('GetAddress', {
                      walletInfo: {...walletInfo, type: C.STR_LN_WITHDRAW},
                    });
                  }}
                />
              )}
              {this.props.showOpenChannel && (
                <MenuListItem
                  icon={Images.icon_dollar}
                  label={C.Open_Channels}
                  onPress={() => {
                    this.props.hideModal();
                    navigation.navigate('LNChannelRoute', {
                      screen: 'LnNodeSelect',
                      params: {walletInfo},
                    });
                  }}
                />
              )}
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default props => {
  const navigation = useNavigation();
  return <SifirSettingModal {...props} navigation={navigation} />;
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  textStyle: {
    fontFamily: AppStyle.mainFont,
    fontSize: 17,
    marginLeft: 10,
  },
  bodyStyle: {
    borderRadius: 15,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 5,
    height: 160,
  },
  rowStyle: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  bottomStyle: {
    flexDirection: 'row-reverse',
  },
  feeTxtView: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 14,
  },
  closeBtn: {
    top: -10,
  },
  closeImg: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    borderRadius: 6,
    overflow: 'hidden',
  },
  timeView: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 15,
  },
  clockImgView: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  clockImg: {width: 25, height: 25},
  setFeeTxt: {fontSize: 18, marginLeft: 5},
  feeTxt: {
    fontSize: 25,
    marginVertical: 10,
    marginHorizontal: 4,
  },
  waitView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  thumb: {height: 25, width: 25, borderRadius: 12.5},
  upArrow: {
    height: 40,
    width: 40,
    transform: [{rotate: '180deg'}],
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 15,
  },
});
