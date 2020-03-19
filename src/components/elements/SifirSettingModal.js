/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Slider from 'react-native-slider';

import {Images, AppStyle, C} from '@common/index';
import {useNavigation} from '@react-navigation/native';
class SifirSettingModal extends Component {
  state = {curMenu: 0, value: 0.6};

  render() {
    const {navigation, walletInfo} = this.props;
    return (
      <>
        <View>
          <View style={styles.mainView} onTouchEnd={this.props.hideModal}>
            <TouchableOpacity>
              <Image source={Images.icon_close} style={styles.closeImg} />
            </TouchableOpacity>
          </View>
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
                  <TouchableOpacity style={{flex: 1}}>
                    <View style={styles.rowStyle}>
                      <Image
                        source={Images.icon_funds}
                        style={{width: 33, height: 30}}
                      />
                      <Text style={styles.textStyle}>{C.STR_Manage_Fund}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {this.props.feeSettingEnabled && (
                  <TouchableOpacity style={{flex: 1}}>
                    <View
                      style={styles.rowStyle}
                      onTouchEnd={() => this.setState({curMenu: 1})}>
                      <Image
                        source={Images.icon_clock}
                        style={{width: 30, height: 30}}
                      />
                      <Text style={styles.textStyle}>{C.STR_SET_FEES}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {this.props.showSettings && (
                  <TouchableOpacity style={{flex: 1}}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={Images.icon_dollar}
                        style={{
                          width: 30,
                          height: 37,
                        }}
                      />
                      <Text style={styles.textStyle}>{C.STR_SETTINGS}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {this.props.showTopUp && (
                  <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => {
                      this.props.hideModal();
                      this.props.navigation.navigate('BtcReceiveTxn', {
                        walletInfo,
                      });
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={Images.icon_funds}
                        style={{
                          width: 40,
                          height: 37,
                        }}
                      />
                      <Text style={styles.textStyle}>{C.TOP_UP}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {this.props.showWithdraw && (
                  <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => {
                      this.props.hideModal();
                      this.props.navigation.navigate('GetAddress', {
                        walletInfo,
                        txnType: C.STR_LN_WITHDRAW,
                      });
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        // TODO replace icon
                        source={Images.icon_dollar}
                        style={{
                          width: 30,
                          height: 37,
                        }}
                      />
                      <Text style={styles.textStyle}>{C.WITHDRAW}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {this.props.showOpenChannel && (
                  <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() => {
                      this.props.hideModal();
                      navigation.navigate('LNChannelRoute');
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Image
                        // TODO replace icon
                        source={Images.icon_dollar}
                        style={{
                          width: 30,
                          height: 37,
                        }}
                      />
                      <Text style={styles.textStyle}>{C.Open_Channels}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          <View style={styles.bottomStyle}>
            <TouchableOpacity>
              <Image
                source={Images.icon_dialog_arrow}
                style={{height: 40, width: 40, marginRight: 10}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

export default props => {
  const navigation = useNavigation();
  return <SifirSettingModal {...props} navigation={navigation} />;
};

const styles = StyleSheet.create({
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
    paddingTop: 5,
    paddingBottom: 10,
    height: 160,
    width: C.SCREEN_WIDTH * 0.85,
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
    marginBottom: 8,
    marginTop: -21,
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
  mainView: {
    flexDirection: 'row-reverse',
    marginBottom: 8,
  },
  closeImg: {height: 30, width: 30, marginRight: 10},
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
});
