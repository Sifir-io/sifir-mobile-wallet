import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Images, AppStyle, C} from '@common/index';

export default class SifirChatTxnFunds extends Component {
  state = {curMenu: 0, value: 0.6};

  render() {
    return (
      <>
        <View>
          <View style={styles.bodyStyle}>
            {this.state.curMenu === 1 && <></>}
            {this.state.curMenu === 0 && (
              <View style={{flex: 1}}>
                <TouchableOpacity style={{flex: 1}}>
                  <View style={styles.rowStyle}>
                    <Image
                      source={Images.icon_chatSend}
                      style={styles.chatSendImg}
                    />
                    <Text style={styles.textStyle}>{C.STR_SEND_FUND}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flex: 1}}>
                  <View
                    style={styles.rowStyle}
                    onTouchEnd={() => this.setState({curMenu: 1})}>
                    <Image
                      source={Images.icon_chatRequest}
                      style={styles.chatReqImg}
                    />
                    <Text style={styles.textStyle}>{C.STR_REQUEST_FUNDS}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flex: 1}}>
                  <View style={styles.mngFundView}>
                    <Image
                      source={Images.icon_dollar}
                      style={styles.mngFundImg}
                    />
                    <Text style={styles.textStyle}>{C.STR_MANAGE_FUNDS}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.bottomStyle}>
            <TouchableOpacity>
              <Image
                source={Images.icon_dialog_arrow}
                style={styles.btmArrowImg}
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
  chatSendImg: {width: 33, height: 30},
  chatReqImg: {width: 30, height: 30},
  mngFundView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mngFundImg: {width: 30, height: 37},
  btmArrowImg: {height: 40, width: 40, marginRight: 10},
});
