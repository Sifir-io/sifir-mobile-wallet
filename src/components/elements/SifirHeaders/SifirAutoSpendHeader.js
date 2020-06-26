/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {AppStyle, svg} from '@common';
import SifirSwitch from '@elements/SifirSwitch';
import SifirAnimatedOverlay from '@elements/SifirAnimatedOverlay';

const {Back} = svg;

const SifirAutoSpendHeader = ({
  headerText,
  setSwitchOn,
  isSwitchOn,
  showOverlay,
  onBackPress,
}) => {
  return (
    <View style={styles.titleContainer}>
      {showOverlay && <SifirAnimatedOverlay />}
      <TouchableOpacity
        activeOpacity={0.9}
        style={{marginStart: 12, flex: 0.2}}
        onPress={onBackPress}>
        <Back />
      </TouchableOpacity>
      <TouchableOpacity onPress={onBackPress} style={{flex: 0.7}}>
        <Text style={styles.title} numberOfLines={1}>
          {headerText}
        </Text>
      </TouchableOpacity>
      <SifirSwitch
        isActive={isSwitchOn}
        setSwitchOn={active => setSwitchOn(active)}
      />
    </View>
  );
};

export default SifirAutoSpendHeader;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  title: {
    // marginLeft: 12,
    fontSize: 20,
    color: '#00EDE7',
    fontWeight: 'bold',
    fontFamily: AppStyle.mainFont,
    width: '60%',
  },
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
    // marginBottom: 15,
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
