// @flow
import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  TextInput,
  Text,
} from 'react-native';
import Svg, {Path, Defs, Stop} from 'react-native-svg';
import * as path from 'svg-path-properties';
import * as shape from 'd3-shape';
import {scaleLinear} from 'd3-scale';
import SifirSlider from './SifirSlider';
import LinearGradient from 'react-native-linear-gradient';
import Slider from 'react-native-slider';

const d3 = {
  shape,
};

const height = 60;
const {width} = Dimensions.get('window');
const verticalPadding = 5;
const cursorRadius = 10;
const unspentCoins = [
  {
    txid: '1473967d81f9032ea8421bf6fa45688ae7772246ff4a37c0892f75ab7bb36e99',
    index: 1,
    amount: 10872,
    anonymitySet: 42,
    confirmed: true,
    label: '',
    keyPath: "84'/0'/0'/1/13420",
    address: 'tb1qul3w3n9p87a683z759l5tsllpkazlskz7wmdwm',
  },
  {
    txid: '1473967d81f9032ea8421bf6fa4dasdasdasdasdasd92f75ab7bb36e99',
    index: 1,
    amount: 10872,
    anonymitySet: 3,
    confirmed: true,
    label: '',
    keyPath: "84'/0'/0'/1/13420",
    address: 'tb1qul3w3n9asdsadasdadasdzlskz7wmdwm',
  },
  {
    txid: '1473967d81f9032ea8421bf6fa45688ae7772246ff4a37c0892f75ab7bb36e99',
    index: 1,
    amount: 10872,
    anonymitySet: 42,
    confirmed: true,
    label: '',
    keyPath: "84'/0'/0'/1/13420",
    address: 'tb1qul3w3n9p87a683z759l5tsllpkazlskz7wmdwm',
  },
  {
    txid: '1473967d81f9032ea8421bf6fa4dasdasdasdasdasd92f75ab7bb36e99',
    index: 1,
    amount: 10872,
    anonymitySet: 3,
    confirmed: true,
    label: '',
    keyPath: "84'/0'/0'/1/13420",
    address: 'tb1qul3w3n9asdsadasdadasdzlskz7wmdwm',
  },
  {
    txid: '1473967d81f9032ea8421bf6fa4dasdasdasdasdasd92f75ab7bb36e99',
    index: 1,
    amount: 10872,
    anonymitySet: 3,
    confirmed: true,
    label: '',
    keyPath: "84'/0'/0'/1/13420",
    address: 'tb1qul3w3n9asdsadasdadasdzlskz7wmdwm',
  },
  {
    txid: '1473967d81f9032ea8421bf6fa4dasdasdasdasdasd92f75ab7bb36e99',
    index: 1,
    amount: 10872,
    anonymitySet: 30,
    confirmed: true,
    label: '',
    keyPath: "84'/0'/0'/1/13420",
    address: 'tb1qul3w3n9asdsadasdadasdzlskz7wmdwm',
  },
  {
    txid: '1473967d81f9032ea8421bf6fa4dasdasdasdasdasd92f75ab7bb36e99',
    index: 1,
    amount: 10872,
    anonymitySet: 3,
    confirmed: true,
    label: '',
    keyPath: "84'/0'/0'/1/13420",
    address: 'tb1qul3w3n9asdsadasdadasdzlskz7wmdwm',
  },
];

const anonSet = unspentCoins.map(({anonymitySet}) => anonymitySet);
// const minAnonset = Math.min(...anonSet);
const maxAnonset = Math.max(...anonSet);
const data = unspentCoins.reduce((g, t) => {
  g[Math.floor(t.anonymitySet)] =
    (g[Math.floor(t.anonymitySet)] || 0) + t.amount;
  return g;
}, {});
const maxBalance = Math.max(...Object.values(data));
const scaleX = scaleLinear()
  .domain([0, maxAnonset])
  .range([0, width - 25]);
const scaleY = scaleLinear()
  .domain([0, maxBalance])
  .range([height - verticalPadding, verticalPadding]);

const line = d3.shape
  .line()
  .x(([anonset]) => scaleX(Number(anonset)))
  .y(([, balance]) => scaleY(balance))
  // TODO current data is more of a distrution than culative function
  // maybe will add cumaltive curve later ?
  .curve(d3.shape.curveStep)(Object.entries(data));
const properties = path.svgPathProperties(line);
const lineLength = properties.getTotalLength();
export default class SifirAccountChart extends React.Component {
  cursor = React.createRef();
  slider = React.createRef();
  label = React.createRef();
  SV = React.createRef();
  x = new Animated.Value(0);

  moveCursor(value) {
    let {x, y} = properties.getPointAtLength(lineLength - value);
    let top = y - cursorRadius - 2;
    let left = x - (cursorRadius + 10);
    this.cursor.current.setNativeProps({
      top,
      left,
    });
    this.slider.current.setNativeProps({
      transform: [{translateX: left - 10}],
    });
    this.label.current.setNativeProps({
      text: `${Math.ceil(scaleY.invert(y))} SATS`,
      top,
      left,
    });
  }

  componentDidMount() {
    this.x.addListener(({value}) => this.moveCursor(value));
  }

  render() {
    const {x} = this;
    return (
      <View style={styles.container}>
        <Svg {...{width, height}}>
          <Path d={line} fill="transparent" stroke="#00EDE7" strokeWidth={5} />
          <Path d={`${line} L ${width} ${height} L 0 ${height}`} />
          <View ref={this.cursor}>
            <LinearGradient
              colors={['white', 'black', 'black', 'black', 'black']}
              style={styles.verticalGradient}
            />
            <View style={styles.cursorContainer}>
              <View style={styles.cursor} />
            </View>
          </View>
        </Svg>
        <Animated.View style={[styles.label]}>
          <TextInput ref={this.label} style={styles.bubbleText} />
        </Animated.View>
        <Animated.ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerStyle={{width: lineLength * 2}}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={false}
          horizontal
          ref={this.SV}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {x},
                },
              },
            ],
            {useNativeDriver: true},
          )}
        />
        <View style={styles.sliderContainer}>
          <SifirSlider
            left={this.leftProp}
            sliderRef={this.slider}
            onValueChangeScroll={val => this.moveCursor(val)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    height,
  },
  container: {
    marginTop: 10,
    paddingTop: 40,
    width,
    overflow: 'hidden',
  },
  cursor: {
    width: cursorRadius * 1.4,
    height: cursorRadius * 1.4,
    borderRadius: cursorRadius,
    borderColor: '#fff',
    borderWidth: 2,
    backgroundColor: '#00EDE7',
  },
  cursorContainer: {
    width: cursorRadius * 2.3,
    height: cursorRadius * 2.3,
    borderRadius: cursorRadius + 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    color: 'white',
  },
  verticalGradient: {
    height: 250,
    width: 40,
    backgroundColor: 'lightgray',
    opacity: 0.5,
    borderRadius: 10,
    top: -30,
  },
  sliderContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  bubbleText: {color: 'white'},
});
