// @flow
import React, {useEffect, useState} from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import Androw from 'react-native-androw';

const d3 = {
  shape,
};
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

const height = 60;
const {width} = Dimensions.get('window');
const verticalPadding = 5;
const cursorRadius = 10;
const cursor = React.createRef();
const slider = React.createRef();
const label = React.createRef();
const SV = React.createRef();
const x = new Animated.Value(0);

const SifirAccountChart = props => {
  useEffect(() => {
    _init();
  }, []);

  const _init = () => {
    x.addListener(({value}) => moveCursor(value));
  };

  const makeChartData = unspentcoins => {
    // group balances by anonset
    const data = unspentCoins.reduce((g, t) => {
      g[Math.floor(t.anonymitySet)] =
        (g[Math.floor(t.anonymitySet)] || 0) + t.amount;
      return g;
    }, {});
    // -- series
    // Sort by anon set descending
    const sortedAnonsetTotalPairs = Object.entries(data).sort(
      ([anonset1], [anonset2]) => anonset1 - anonset2,
    );
    const chartStats = sortedAnonsetTotalPairs.reduce(
      (stats, [anonset, total], i) => {
        // data sorted descending, so anything after current index is a balance avalible below that anon set
        const cumTotal = sortedAnonsetTotalPairs
          .slice(i)
          .reduce((totalToIndex, [, t1]) => totalToIndex + t1, 0);
        stats.series.push([Number(anonset), cumTotal]);
        stats.maxY =
          cumTotal > stats.maxY || stats.maxY === null ? cumTotal : stats.maxY;
        stats.maxX =
          anonset > stats.maxX || stats.maxX === null ? anonset : stats.maxX;
        stats.minY =
          cumTotal < stats.minY || stats.minY === null ? cumTotal : stats.minY;
        stats.minX =
          anonset < stats.minX || stats.minX === null ? anonset : stats.minX;
        return stats;
      },
      {series: [], minX: null, maxX: null, minY: null, maxY: null},
    );
    console.log(chartStats);
    return chartStats;
    // calculate max y axis value
    //const [[, maxY]] = cumSum[0];
    //// const maxY = Math.max(...Object.values(data));
    ////
    //// calculate max x-axis value
    //const anonSet = unspentCoins.map(({anonymitySet}) => anonymitySet);
    //const maxX = Math.max(...anonSet);
    //return {cumSum, maxX, maxY};
  };
  //FIXME here flipping x,y for slider ?
  const {series, minX, maxX, minY, maxY} = makeChartData(unspentCoins);
  const scaleX = scaleLinear()
    .domain([0, maxX])
    .range([0, width - 25]);
  const scaleY = scaleLinear()
    .domain([minY, maxY])
    .range([height - verticalPadding, verticalPadding]);

  const line = d3.shape
    .line()
    .x(([anonset]) => scaleX(Number(anonset)))
    .y(([, balance]) => scaleY(balance))
    .curve(d3.shape.curveStep)(series);
  const properties = path.svgPathProperties(line);
  const lineLength = properties.getTotalLength();

  const moveCursor = value => {
    let {x, y} = properties.getPointAtLength(lineLength - value);
    let top = y - cursorRadius - 2;
    let left = x - (cursorRadius + 10);
    cursor?.current?.setNativeProps({
      top,
      left,
    });
    slider.current.setNativeProps({
      left: left - 10,
    });
    const anonSetValue = scaleX.invert(x);
    const cumSumBalanceValue = scaleY.invert(y);
    const text = `${Math.floor(anonSetValue)}`;
    label?.current?.setNativeProps({
      text,
      top,
      left,
    });
    props.handleChartSlider({
      anonset: anonSetValue,
      value: cumSumBalanceValue,
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Androw style={styles.shadow}>
          <Svg {...{width, height}}>
            <Path
              d={line}
              fill="transparent"
              stroke="#00EDE7"
              strokeWidth={5}
            />

            <Path d={`${line} L ${width} ${height} L 0 ${height}`} />
          </Svg>
        </Androw>
        <View style={styles.cursorParent}>
          <View ref={cursor}>
            <LinearGradient
              colors={['white', 'black', 'black', 'black', 'black']}
              style={styles.verticalGradient}
            />
            <View style={styles.cursorContainer}>
              <View style={styles.cursor} />
            </View>
          </View>
        </View>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <Animated.View ref={slider} style={styles.thumb} />
          </View>
        </View>
        <Animated.View style={[styles.label]}>
          <TextInput ref={label} style={styles.bubbleText} />
        </Animated.View>
        <Animated.ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerStyle={{
            width: lineLength * 2,
          }}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          bounces={false}
          horizontal
          ref={SV}
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
      </View>
      <View style={styles.sliderLabelContainer}>
        <Text style={styles.sliderLabel}>0</Text>
        <Text style={styles.sliderLabel}>Anonimity Level</Text>
        <Text style={styles.sliderLabel}>90</Text>
      </View>
    </>
  );
};

export default SifirAccountChart;

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
  shadow: {
    shadowColor: '#00EDE7',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cursorParent: {
    width,
    height: height,
    position: 'absolute',
    top: height - height * 0.33,
  },
});
