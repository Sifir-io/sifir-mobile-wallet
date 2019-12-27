import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {Images, AppStyle, C} from '@common/index';
// import {Badge} from 'react-native-elements';

export default class SifirChatMsg extends Component {
  state = {};
  render() {
    const {data, onPlayMedia} = this.props;
    switch (data.type) {
      case 'TIME':
        return (
          <View style={styles.timeItemView}>
            <Text style={styles.timeItemTxt}>{data.content}</Text>
          </View>
        );
      case 'RECEIVED':
        if (data.cont_type === 'media') {
          return (
            <View style={{marginBottom: 17}}>
              <View style={styles.mediaView}>
                <Image
                  source={Images.icon_receiverMark}
                  style={styles.receiverMarkImg}
                />
                <Image source={Images.img_media} style={styles.mediaImg} />
              </View>
              <TouchableOpacity
                style={{position: 'absolute', top: '40%', left: '42%'}}
                onPressOut={() => {
                  onPlayMedia(data);
                }}>
                <Image
                  source={Images.icon_play}
                  style={[styles.mediaPlayImg, {opacity: 1}]}
                />
              </TouchableOpacity>
            </View>
          );
        } else {
          return (
            <View style={styles.recMsgView}>
              <View style={styles.recContView}>
                <Image
                  source={Images.icon_receiverMark}
                  style={styles.receiverMarkImg}
                />
                <View style={styles.recTxtView}>
                  <Text style={styles.recMsgTxt}>{data.content}</Text>
                </View>
              </View>
              <View style={{marginLeft: 12, marginTop: 5}}>
                <Text style={styles.timeTxt}>{data.time}</Text>
              </View>
            </View>
          );
        }
      case 'SENT':
        return (
          <View style={styles.sentMsgView}>
            <View style={styles.sentContView}>
              <View style={styles.sentTxtView}>
                <Text style={styles.sentMsgTxt}>{data.content}</Text>
              </View>
              <Image
                source={Images.icon_senderMark}
                style={styles.senderMarkImg}
              />
            </View>
          </View>
        );
      case 'COIN_REQUEST':
        return (
          <View style={styles.coinSentView}>
            <Text style={styles.coinTimeTxt}>{data.content.time}</Text>
            <Text style={styles.coinNameTxt}>YOU</Text>
            <Text style={styles.coinTimeTxt}>ARE REQUESTING</Text>
            <Text style={styles.coinNameTxt}>
              {data.content.amount + ' ' + data.content.currency}
            </Text>
            <Image
              source={Images.icon_vertical_line_black}
              style={styles.lineImage}
            />
            <Image
              source={Images.icon_requestCoin}
              style={styles.sentCoinImg}
            />
          </View>
        );
      case 'COIN_SENT':
        return (
          <View style={styles.coinSentView}>
            <Text style={styles.coinTimeTxt}>{data.content.time}</Text>
            <Text style={styles.coinNameTxt}>{data.content.name}</Text>
            <Text style={styles.coinTimeTxt}>SENT YOU</Text>
            <Text style={styles.coinNameTxt}>
              {data.content.amount + ' ' + data.content.currency}
            </Text>
            <Image
              source={Images.icon_vertical_line_black}
              style={styles.lineImage}
            />
            <Image source={Images.icon_sentCoin} style={styles.sentCoinImg} />
          </View>
        );
      default:
        break;
    }
    return <></>;
  }
}

const styles = StyleSheet.create({
  timeItemView: {
    alignItems: 'center',
  },
  timeItemTxt: {
    color: '#3E9598',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recMsgView: {
    marginTop: 20,
    marginBottom: 17,
    backgroundColor: 'transparent',
    marginLeft: 15,
  },
  recMsgTxt: {
    color: AppStyle.mainColor,
    fontSize: 17,
  },
  recTxtView: {
    backgroundColor: '#173A49',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  recContView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiverMarkImg: {
    width: 10,
    height: 13,
  },
  timeTxt: {
    color: '#3E9598',
    fontSize: 10,
  },
  sentMsgView: {
    backgroundColor: 'transparent',
    marginHorizontal: 15,
    marginBottom: 17,
  },
  sentContView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sentTxtView: {
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
    marginRight: 15,
  },
  sentMsgTxt: {
    color: 'white',
    fontSize: 15,
  },
  senderMarkImg: {
    width: 13,
    height: 16,
    marginLeft: -16,
  },
  coinSentView: {
    backgroundColor: AppStyle.mainColor,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 17,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinTimeTxt: {
    fontSize: 10,
    marginHorizontal: 6.5,
  },
  coinNameTxt: {
    fontSize: 15,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  lineImage: {
    height: 30,
    width: 2,
  },
  sentCoinImg: {
    height: 30,
    width: 30,
    marginHorizontal: 10,
  },
  mediaView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    opacity: 0.6,
    position: 'relative',
    width: C.SCREEN_WIDTH * 0.8,
  },
  mediaImg: {
    height: 130,
    borderRadius: 20,
    width: C.SCREEN_WIDTH * 0.8,
  },
  mediaPlayImg: {
    width: 40,
    height: 40,
    opacity: 1,
  },
});
