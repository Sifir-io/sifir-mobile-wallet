import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Images, C} from '@common/index';

export default class SifirSearchBox extends Component {
  state = {
    srchTxt: '',
    isSrchStarted: false,
  };

  onCloseSrch = () => {
    this.setState({
      srchTxt: '',
      isSrchStarted: false,
    });
  };

  onSrchTxtChange = txt => {
    this.setState({srchTxt: txt});
    if (txt !== '') {
      this.setState({isSrchStarted: true});
    }
  };

  render() {
    return (
      <View style={styles.searchView}>
        <Image source={Images.icon_search} style={styles.srchImg} />
        <TextInput
          style={styles.srchInput}
          onChangeText={text => this.onSrchTxtChange(text)}
          value={this.state.srchTxt}
        />
        {this.state.isSrchStarted && (
          <TouchableOpacity onPressOut={() => this.onCloseSrch()}>
            <Image source={Images.icon_close1} style={styles.srchCloseImg} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchView: {
    borderRadius: 17,
    backgroundColor: '#122C3A',
    marginHorizontal: 15,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  srchImg: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  srchInput: {
    paddingVertical: 0,
    color: 'white',
    marginLeft: 10,
    fontSize: 17,
    width: C.SCREEN_WIDTH * 0.75,
  },
  srchCloseImg: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
});
