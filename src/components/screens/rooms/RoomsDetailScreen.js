import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Text,
} from 'react-native';
import {Badge} from 'react-native-elements';
import Overlay from 'react-native-modal-overlay';
import {Images, AppStyle, C} from '@common/index';
import SifirChatMsg from '@elements/SifirChatMsg';
import SifirChatTxnFunds from '../../elements/SifirChatTxnFunds';

export default class RoomsDetailScreen extends Component {
  state = {
    messages: [
      {
        type: 'RECEIVED',
        cont_type: 'media',
      },
      {
        type: 'COIN_REQUEST',
        content: {
          time: '10:43 PM',
          amount: '0.012',
          currency: 'BTC',
        },
      },
      {
        type: 'SENT',
        content: 'You know it! Saved one just for you. Not many left!',
      },
      {
        type: 'COIN_SENT',
        content: {
          time: '10:43 PM',
          name: 'GHASSAN',
          amount: '0.012',
          currency: 'BTC',
        },
      },
      {
        type: 'SENT',
        content: 'You know it! Saved one just for you',
      },
      {
        type: 'RECEIVED',
        content: 'Hey man! You got a medium in black available?',
        time: '10:42 PM',
      },
      {
        type: 'TIME',
        content: 'TODAY',
      },
    ],
    mediaModal: false,
    txnFundsModal: false,
    inputMsg: '',
    selectEmoji: false,
  };

  onClose = () => this.setState({mediaModal: false, txnFundsModal: false});

  onPlayMedia = data => {
    this.setState({mediaModal: true});
  };

  sendMsg = () => {
    if (this.state.inputMsg === '') {
      return;
    }
    var sentMsg = {type: 'SENT', content: this.state.inputMsg};
    this.state.messages.unshift(sentMsg);
    this.setState({messages: this.state.messages, inputMsg: ''});
  };

  render() {
    return (
      <View style={styles.mainscreen}>
        <View style={styles.headerView}>
          <View style={styles.headerImgView}>
            <Image source={Images.img_face1} style={styles.headerImg} />
            <Badge
              status="success"
              badgeStyle={styles.itemBadge}
              containerStyle={styles.itemBadgeCont}
            />
            <Text style={styles.headerTxt}>Gassan</Text>
          </View>
          <TouchableOpacity>
            <Image source={Images.icon_setting} style={styles.settingImg} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={this.state.messages}
          renderItem={({item}) => (
            <SifirChatMsg data={item} onPlayMedia={this.onPlayMedia} />
          )}
          inverted
          style={styles.chatContent}
        />

        <View style={styles.bottomView}>
          <View style={styles.typeMsgView}>
            <TouchableOpacity
              onPressOut={() =>
                this.setState({selectEmoji: !this.state.selectEmoji})
              }>
              <Image source={Images.icon_emoji} style={styles.emojiImg} />
            </TouchableOpacity>
            <TextInput
              placeholder={C.STR_TYPE_MSG}
              placeholderTextColor="white"
              value={this.state.inputMsg}
              onChangeText={inputMsg => {
                this.setState({inputMsg});
              }}
              style={styles.msgTxtInput}
            />
            <TouchableOpacity>
              <Image style={styles.attachImg} source={Images.icon_attach} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image style={styles.micImg} source={Images.icon_mic} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPressOut={() => this.sendMsg()}
            onLongPress={() => {
              this.setState({txnFundsModal: true});
            }}>
            <Image
              source={Images.icon_msgSetting}
              style={styles.typeMsgSettingImg}
            />
          </TouchableOpacity>
        </View>

        <Overlay
          visible={this.state.mediaModal}
          onClose={this.onClose}
          closeOnTouchOutside
          animationType="zoomIn"
          containerStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
          childrenWrapperStyle={{
            marginTop: 110,
            backgroundColor: 'transparent',
          }}
          animationDuration={500}>
          {hideModal => (
            <View style={styles.mediaModalView}>
              <TouchableOpacity onPressOut={() => hideModal()}>
                <Image
                  source={Images.icon_closeMedia}
                  style={styles.mediaCloseImg}
                />
              </TouchableOpacity>
              <Image source={Images.img_media} style={styles.mediaContImg} />
              <TouchableOpacity style={styles.mediaPlayView}>
                <Image source={Images.icon_play} style={styles.mediaPlayImg} />
              </TouchableOpacity>
            </View>
          )}
        </Overlay>

        <Overlay
          visible={this.state.txnFundsModal}
          onClose={this.onClose}
          closeOnTouchOutside
          animationType="zoomIn"
          containerStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 15,
          }}
          childrenWrapperStyle={styles.dlgChild}
          animationDuration={500}>
          {hideModal => <SifirChatTxnFunds hideModal={hideModal} />}
        </Overlay>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainscreen: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
    shadowColor: 'black',
  },
  headerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    backgroundColor: '#122C3A',
  },
  headerImg: {
    width: 45,
    height: 45,
    marginTop: 5,
  },
  headerTxt: {
    fontSize: 20,
    color: AppStyle.mainColor,
    marginLeft: 15,
  },
  settingImg: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  headerImgView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 15,
  },
  itemBadge: {
    width: 10,
    height: 10,
  },
  itemBadgeCont: {
    marginLeft: -7,
  },
  bottomView: {
    height: 80,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  typeMsgView: {
    flexDirection: 'row',
    borderColor: AppStyle.mainColor,
    borderRadius: 23,
    height: 60,
    marginHorizontal: 20,
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeMsgSettingImg: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  micImg: {
    width: 20,
    height: 30,
    marginRight: 10,
  },
  attachImg: {
    width: 17,
    height: 30,
    marginRight: 10,
  },
  emojiImg: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  msgTxtInput: {
    flex: 1,
    color: 'white',
    marginLeft: 10,
  },
  chatContent: {
    marginVertical: 15,
  },
  mediaModalView: {
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
  },
  mediaContImg: {
    width: C.SCREEN_WIDTH,
    height: 200,
  },
  mediaCloseImg: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  mediaPlayView: {
    position: 'absolute',
    top: '50%',
    left: '53%',
  },
  mediaPlayImg: {
    width: 50,
    height: 50,
  },
  dlgChild: {
    marginTop: C.SCREEN_HEIGHT * 0.52,
    backgroundColor: 'transparent',
  },
});
