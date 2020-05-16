import React, {Component, useRef} from 'react';
import {View, StyleSheet, PanResponder, Animated, Text} from 'react-native';

const SifirSlider = props => {
  const {onValueChangeScroll, sliderRef} = props;
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        onValueChangeScroll(gestureState.moveX);
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
        });
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x}], {}),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  return (
    <View>
      {/* <Slider
        step={1}
        value={props.left * 0.285}
        thumbTintColor="#5595a8"
        onValueChange={value => {
          // onValueChangeScroll(value);
        }}
        inverted={true}
        minimumValue={1}
        maximumValue={90}
        minimumTrackTintColor="#2B2B2B"
        maximumTrackTintColor="#2B2B2B"
        thumbStyle={styles.thumb}
        style={{height: 16}}
        trackStyle={{
          height: 16,
          borderRadius: 5,
        }}
      /> */}
      <View style={styles.container}>
        <View style={styles.sliderTrack}>
          <Animated.View
            ref={sliderRef}
            style={styles.thumb}
            {...panResponder.panHandlers}
          />
        </View>
      </View>
    </View>
  );
};
export default SifirSlider;
const styles = StyleSheet.create({
  thumb: {
    backgroundColor: '#00EDE7',
    width: 40,
    borderRadius: 5,
    elevation: 3,
    height: 16,
  },
  sliderTrack: {
    backgroundColor: '#2B2B2B',
    borderRadius: 5,
  },
});
