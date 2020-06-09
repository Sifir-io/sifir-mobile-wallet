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

const {Back} = svg;

const SifirSwitch = ({containerStyle, headerText, setSwitchOn, isSwitchOn}) => {
  const onBackPress = () => {};

  return (
    <View style={[containerStyle, {backgroundColor: AppStyle.backgroundColor}]}>
      <View style={[styles.titleContainer]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{marginStart: 12, flex: 0.5}}
          onPress={onBackPress}>
          <Back />
        </TouchableOpacity>
        <Text style={styles.title}>{headerText}</Text>
        <SifirSwitch
          style={{paddingTop: 20}}
          isActive={isSwitchOn}
          setSwitchOn={active => setSwitchOn(active)}
        />
      </View>
    </View>
  );
};

export default SifirSwitch;

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 10,
    marginStart: 12,
    fontSize: 20,
    color: '#00EDE7',
    fontWeight: 'bold',
    fontFamily: AppStyle.mainFont,
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
