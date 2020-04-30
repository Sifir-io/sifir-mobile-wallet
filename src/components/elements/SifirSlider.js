import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Slider from 'react-native-slider';
import {Images, AppStyle, C} from '@common/index';

export default class SifirSlider extends Component {
  state = {value: false};

  render() {
    return (
      <View style={styles.timeView}>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.clockImgView}>
            <Image source={Images.icon_clock} style={styles.clockImg} />
            <Text style={styles.setFeeTxt}>{C.STR_SET_FEES}</Text>
          </View>
          <View style={styles.feeTxtView}>
            <Text style={styles.feeTxt}>0.015 BTC</Text>
          </View>
        </View>
        <View style={{width: '100%'}}>
          <Slider
            animationType="spring"
            value={this.state.value}
            thumbTintColor="#5595a8"
            onValueChange={value => this.setState({value})}
            minimumTrackTintColor="#25b6fa"
            maximumTrackTintColor="#412160"
            thumbStyle={styles.thumb}
            trackStyle={{
              height: 10,
              borderRadius: 5,
            }}
          />
        </View>
        <View style={styles.waitView}>
          <Text style={{fontSize: 20}}>{C.STR_Wait}</Text>
          <Text style={{fontSize: 20, color: 'blue'}}>4 Hours</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  timeView: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 15,
  },
  clockImgView: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  clockImg: {width: 25, height: 25},
  setFeeTxt: {fontSize: 18, marginLeft: 5},
  feeTxt: {
    fontSize: 25,
    marginVertical: 10,
    marginHorizontal: 4,
  },
  waitView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
