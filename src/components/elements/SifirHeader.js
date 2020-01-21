import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {Images, AppStyle, C} from '@common/index';
import {Badge} from 'react-native-elements';

export default class SirFirHeader extends Component {
  state = {
    curMenu: 0,
    showMsgNotify: false,
  };

  render() {
    const menus = [C.STR_WALLET, C.STR_ROOMS, C.STR_SHOP];
    const {curMenu} = this.state;
    const {switchPage} = this.props;

    return (
      <View style={styles.navbarStyle}>
        <View style={{flex: 1}}>
          <Image source={Images.icon_header} style={styles.logocontainer} />
        </View>
        <View style={styles.tabsStyle}>
          {menus.map((item, i) => (
            <TouchableOpacity key={i}>
              <View
                onTouchEnd={() => {
                  this.setState({curMenu: i});
                  switchPage(menus[i]);
                }}
                style={curMenu === i ? styles.activeMenuItem : {}}>
                {this.state.showMsgNotify && (
                  <Badge
                    status="error"
                    badgeStyle={styles.badge}
                    containerStyle={styles.badgeCont}
                  />
                )}
                <Text
                  style={
                    curMenu === i
                      ? styles.activeNavTextView
                      : styles.navTextView
                  }>
                  {item}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menuItem: {},
  activeMenuItem: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  tabsStyle: {
    flexDirection: 'row',
    flex: 3,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  activeNavTextView: {
    color: 'white',
    fontSize: 13,
    fontFamily: AppStyle.mainFont,
  },
  navTextView: {
    color: AppStyle.mainColor,
    fontSize: 13,
    fontFamily: AppStyle.mainFont,
  },
  logocontainer: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginLeft: 15,
    borderWidth: 0.5,
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1.0,
  },
  navbarStyle: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 0,
    marginBottom: 15,
    backgroundColor: AppStyle.backgroundColor,
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  badgeCont: {
    position: 'absolute',
    top: -9,
    right: -7,
  },
  badge: {
    width: 12,
    height: 12,
    borderWidth: 0,
    borderRadius: 6,
  },
});
