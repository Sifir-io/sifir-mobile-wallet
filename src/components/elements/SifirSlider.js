import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Slider from 'react-native-slider';
import {Images, AppStyle, C} from '@common/index';

export default class SifirSlider extends Component {
  state = {value: 20};
  render() {
    return (
      <View style={styles.timeView}>
        <View style={{width: '100%'}}>
          <Slider
            step={1}
            animationType="spring"
            value={this.state.value}
            thumbTintColor="#5595a8"
            onValueChange={value => this.setState({value})}
            minimumValue={1}
            maximumValue={90}
            minimumTrackTintColor="#25b6fa"
            maximumTrackTintColor="#412160"
            thumbStyle={styles.thumb}
            trackStyle={{
              height: 10,
              borderRadius: 5,
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  timeView: {
    flex: 1,
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
