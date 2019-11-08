import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Slider from 'react-native-slider';

import {Images, AppStyle, Constants} from '@common/index';

export default class SifirSettingModal extends Component {
  state = {curMenu: 0, value: 0.6};

  render() {
    return (
      <>
        <View>
          <View
            style={{
              flexDirection: 'row-reverse',
              marginBottom: 8,
            }}
            onTouchEnd={this.props.hideModal}>
            <TouchableOpacity>
              <Image
                source={Images.icon_close}
                style={{height: 30, width: 30, marginRight: 10}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.bodyStyle}>
            {this.state.curMenu == 1 && (
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'white',
                  marginTop: 15,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={Images.icon_clock}
                      style={{width: 25, height: 25}}
                    />
                    <Text
                      style={{
                        fontSize: 18,
                        marginLeft: 5,
                      }}>
                      {Constants.STR_SET_FEES}
                    </Text>
                  </View>
                  <View style={styles.feeTxtStyle}>
                    <Text
                      style={{
                        fontSize: 25,
                        marginVertical: 10,
                        marginHorizontal: 4,
                      }}>
                      0.015 BTC
                    </Text>
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
                    thumbStyle={{
                      height: 25,
                      width: 25,
                      borderRadius: 12.5,
                    }}
                    trackStyle={{
                      height: 10,
                      borderRadius: 5,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 20}}>{Constants.STR_Wait}</Text>
                  <Text style={{fontSize: 20, color: 'blue'}}>4 Hours</Text>
                </View>
              </View>
            )}
            {this.state.curMenu == 0 && (
              <View style={{flex: 1}}>
                <TouchableOpacity style={{flex: 1}}>
                  <View style={styles.rowStyle}>
                    <Image
                      source={Images.icon_funds}
                      style={{width: 33, height: 30}}
                    />
                    <Text style={styles.textStyle}>
                      {Constants.STR_Manage_Fund}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flex: 1}}>
                  <View
                    style={styles.rowStyle}
                    onTouchEnd={() => this.setState({curMenu: 1})}>
                    <Image
                      source={Images.icon_clock}
                      style={{width: 30, height: 30}}
                    />
                    <Text style={styles.textStyle}>SET FEES</Text>
                  </View>
                </TouchableOpacity>
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
                    <Text style={styles.textStyle}>SETTINGS</Text>
                  </View>
                </TouchableOpacity>
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
    width: Constants.SCREEN_WIDTH * 0.85,
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
  feeTxtStyle: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 14,
  },
});
