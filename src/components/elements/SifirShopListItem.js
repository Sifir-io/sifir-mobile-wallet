import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {Images, AppStyle, C} from '@common/index';
import {Badge, Icon} from 'react-native-elements';

export default class SifirChatListItem extends Component {
  state = {i: 0};
  swipeoutBtns = [
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

  render() {
    const {data, clickedItem} = this.props;
    const status = [
      {stat: 'Availalbe', color: 'green'},
      {stat: 'Busy', color: 'red'},
      {stat: 'Away', color: AppStyle.backgroundColor},
    ];

    return (
      <>
        <View style={styles.consultItem}>
          <View style={styles.chatItem}>
            <Image source={Images.img_face1} style={styles.itemImg} />
            <Badge
              status="success"
              badgeStyle={styles.itemBadge}
              containerStyle={styles.itemBadgeCont}
            />
            <View style={styles.txtItemView}>
              <View style={styles.headView}>
                <Text style={styles.nameItemTxt}>{data.title}</Text>
                <View style={styles.consultStar}>
                  <Icon name="star" type="rowing" color="black" size={19} />
                  <Text>{data.star}</Text>
                </View>
              </View>
              <Text style={styles.contItemTxt}>{data.type}</Text>
              <Text style={[styles.contItemTxt, {fontSize: 12}]}>
                {data.location}
              </Text>
            </View>
            <View style={styles.timeTxtView}>
              <Text style={styles.rateItem}>{`$${data.rate}/min`}</Text>
              <View
                style={[
                  styles.statusView,
                  {backgroundColor: status[data.status].color},
                ]}>
                <Text style={styles.statusTxt}>{status[data.status].stat}</Text>
              </View>
            </View>
          </View>
          <View>
            <Text style={{color: 'white'}}>{data.cont}</Text>
          </View>
          <TouchableOpacity onPress={() => clickedItem(data)}>
            <View style={styles.payContView}>
              <Text style={styles.payBtnTxt}>PAY TO CONTACT</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.infoView}>
            <Text style={styles.infoTxt}>
              You will only be chareged if Alice accpts your request
            </Text>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  swipeout: {backgroundColor: 'transparent'},
  chatItem: {
    flex: 1,
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    backgroundColor: '#122C3A',
    marginHorizontal: 5,
  },
  consultItem: {
    flex: 1,
    height: 220,
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
  rateItem: {
    fontSize: 15,
    color: 'white',
    marginBottom: 5,
  },
  timeTxtView: {
    flex: 0.5,
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
  consultStar: {
    flexDirection: 'row',
    backgroundColor: AppStyle.mainColor,
    borderRadius: 5,
    justifyContent: 'space-around',
    width: 55,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    marginLeft: 10,
  },
  payContView: {
    backgroundColor: AppStyle.backgroundColor,
    width: 80 * C.vw,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    borderRadius: 15,
    marginTop: 15,
  },
  statusView: {
    borderRadius: 5,
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 7,
    backgroundColor: 'green',
  },
  infoTxt: {color: 'white', fontStyle: 'italic'},
  payBtnTxt: {color: AppStyle.mainColor, fontSize: 18},
  headView: {flexDirection: 'row', marginTop: 5},
  statusTxt: {color: 'white', fontSize: 13},
  infoView: {marginTop: 10, flex: 0.3},
});
