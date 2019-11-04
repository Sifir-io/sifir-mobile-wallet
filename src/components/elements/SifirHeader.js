import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {Images, AppStyle, Constants} from '@common';

export default class SirFirHeader extends Component {
  state = {curMenu: 0};
  tabNavigae = index => {
    switch (index) {
      case 0:
      case 1:
      case 2:
    }
  };

  render() {
    const menus = [
      Constants.STR_WALLET,
      Constants.STR_CHAT,
      Constants.STR_SHOP,
    ];
    const {curMenu} = this.state;
    const {switchPage} = this.props;

    return (
      <>
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
                    switchPage(i);
                  }}
                  style={curMenu === i ? styles.activeMenuItem : {}}>
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
        <Image source={Images.img_shadow} style={{height: 30}} />
      </>
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
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: AppStyle.backgroundColor,
    justifyContent: 'center',
    shadowOpacity: 1.0,
  },
});
