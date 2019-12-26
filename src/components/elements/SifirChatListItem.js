import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {Images, AppStyle} from '@common/index';
import {Badge} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Swipeout from 'react-native-swipeout';

export default class SifirChatListItem extends Component {
  state = {i: 0};
  render() {
    const {data, clickedItem, gColors} = this.props;
    var swipeoutBtns = [
      {
        backgroundColor: 'black',
        component: (
          <TouchableOpacity style={{flex: 1}}>
            <View style={styles.delImgView}>
              <Image source={Images.icon_recycle} style={styles.delImg} />
            </View>
          </TouchableOpacity>
        ),
      },
    ];
    return (
      <Swipeout
        right={swipeoutBtns}
        style={{backgroundColor: 'transparent'}}
        buttonWidth={70}>
        <TouchableOpacity onPress={() => clickedItem(data)}>
          <LinearGradient
            colors={data.selected === false ? gColors[0] : gColors[1]}
            style={styles.chatItem}>
            <Image source={Images.img_face1} style={styles.itemImg} />
            <Badge
              status="success"
              badgeStyle={styles.itemBadge}
              containerStyle={styles.itemBadgeCont}
            />
            <View style={styles.txtItemView}>
              <Text style={styles.nameItemTxt}>{data.title}</Text>
              <Text style={styles.contItemTxt}>{data.cont}</Text>
            </View>
            <View style={styles.timeTxtView}>
              <Text style={styles.timeItem}>{data.timeTxt}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Swipeout>
    );
  }
}

const styles = StyleSheet.create({
  chatItem: {
    flex: 1,
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    backgroundColor: '#122C3A',
    marginHorizontal: 5,
  },
  itemImg: {
    width: 75,
    height: 75,
    marginTop: 10,
    marginLeft: 10,
  },
  timeItem: {
    fontSize: 10,
    color: 'white',
  },
  timeTxtView: {
    flex: 0.3,
    height: 50,
    alignItems: 'flex-end',
    marginRight: 5,
  },
  txtItemView: {
    flex: 1,
    marginLeft: 10,
  },
  nameItemTxt: {
    color: AppStyle.mainColor,
    fontSize: 15,
  },
  contItemTxt: {
    color: 'white',
  },
  itemBadge: {
    width: 10,
    height: 10,
  },
  itemBadgeCont: {
    marginLeft: -9,
  },
  delImg: {
    width: 25,
    height: 25,
  },
  delImgView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
