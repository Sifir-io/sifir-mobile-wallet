// @flow
import React, {useMemo, useEffect} from 'react';
import {Images, AppStyle, C} from '@common/index';
import {StyleSheet, View, Animated, TextInput, Text} from 'react-native';
import Svg, {Path, Defs, Stop} from 'react-native-svg';
import * as path from 'svg-path-properties';
import * as shape from 'd3-shape';
import {scaleLinear} from 'd3-scale';
import LinearGradient from 'react-native-linear-gradient';
import Androw from 'react-native-androw';
import {log} from '@io/events';

const d3 = {
  shape,
};

const height = 60;
const width = C.SCREEN_WIDTH;
const verticalPadding = 5;
const cursorRadius = 10;
const cursor = React.createRef();
const slider = React.createRef();
const label = React.createRef();
const SV = React.createRef();
const x = new Animated.Value(0);
const makeUnspentCoinsChartData = chartData => {
  // group balances by anonset
  const data = chartData.reduce((g, t) => {
    g[Math.floor(t.anonymitySet)] =
      (g[Math.floor(t.anonymitySet)] || 0) + t.amount;
    return g;
  }, {});
  // -- series
  // Sort by anon set descending
  const sortedAnonsetTotalPairs = Object.entries(data).sort(
    ([anonset1], [anonset2]) => anonset1 - anonset2,
  );
  // FIXME brute stuff here, 1 point of data breaks chart because of line length =0 in _init() so add one to render a straight line from anonset 1 to current max in sex. Kosher ?
  if (sortedAnonsetTotalPairs.length < 2) {
    sortedAnonsetTotalPairs.unshift(sortedAnonsetTotalPairs[0]);
  }
  const chartStats = sortedAnonsetTotalPairs.reduce(
    (stats, [anonset, total], i) => {
      // data sorted descending, so anything after current index is a balance avalible below that anon set
      const cumTotal = sortedAnonsetTotalPairs
        .slice(i)
        .reduce((totalToIndex, [, t1]) => totalToIndex + t1, 0);
      stats.series.push([Number(anonset), cumTotal]);
      stats.maxY = Math.max(cumTotal, stats.maxY);
      stats.maxX = Math.max(anonset, stats.maxX);
      stats.minY = Math.min(cumTotal, stats.minY);
      stats.minX = Math.min(anonset, stats.minX);
      return stats;
    },
    {series: [], minX: 99999, maxX: null, minY: null, maxY: null},
  );
  return chartStats;
};
const SifirAccountChart = props => {
  const plotData = props.chartData;
  useEffect(() => {
    _init();
  }, []);
  const {series, minX, maxX, minY, maxY} = useMemo(
    () => makeUnspentCoinsChartData(plotData),
    [plotData],
  );
  const {scaleX, scaleY, line, properties, lineLength} = useMemo(() => {
    const scaleX = scaleLinear()
      .domain([minX, maxX])
      .range([20, width - 20]);
    const scaleY = scaleLinear()
      .domain([minY, maxY])
      .range([height - verticalPadding, verticalPadding]);
    const line = d3.shape
      .line()
      .x(([anonset]) => scaleX(Number(anonset)))
      .y(([, balance]) => scaleY(balance))
      .curve(d3.shape.curveStepBefore)(series);
    const p = path.svgPathProperties(line);
    return {
      scaleX,
      scaleY,
      line,
      properties: p,
      lineLength: p.getTotalLength(),
    };
  }, [series]);
  const _init = () => {
    try {
      x.addListener(({value}) => moveCursor(value));
      log('Chart data lineLength', lineLength);
      let {x: X, y} = properties.getPointAtLength(lineLength);
      let top = y - cursorRadius - 2;
      let left = X - (cursorRadius + 10);
      cursor?.current?.setNativeProps({
        top,
        left,
      });
      slider.current.setNativeProps({
        left: left - 10,
      });
      // Initialize with intial balance to show in account header
      moveCursor(0);
    } catch (err) {
      console.error(err);
    }
  };

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
    // const cumSumBalanceValue = scaleY.invert(y);
    // find first anonset pair in acending array where value < array
    const [, cumSumBalanceValue] = series.find(
      ([anonset]) => anonSetValue <= anonset,
    );
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
        <View style={styles.chartContainer}>
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
        </View>
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
            width: lineLength * 2 + 50,
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
        <Text style={styles.sliderLabel}>{minX}</Text>
        <Text style={styles.sliderLabel}>Anonimity Level</Text>
        <Text style={styles.sliderLabel}>{maxX}</Text>
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
  sliderLabel: {
    color: 'gray',
  },
  sliderLabelContainer: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
