import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import AppStyle from '../../../common/AppStyle';

export default class RoomsMainScreen extends Component {
  render() {
    return (
      <View style={styles.mainscreen}>
        <Text style={styles.tempStyle}>Comming Soon - Rooms</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainscreen: {
    flex: 1,
    display: 'flex',
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
  },
  tempStyle: {
    color: 'white',
    fontSize: 20,
  },
});
