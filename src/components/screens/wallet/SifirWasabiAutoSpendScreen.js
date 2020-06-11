/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import SifirAutoSpendHeader from '@elements/SifirHeaders/SifirAutoSpendHeader';
import AnimatedSlider from '@elements/AnimatedSlider';
import {AppStyle, C, Images} from '@common';
import SifirCard from '../../elements/SifirCard';
import AnimatedOverlay from '../../elements/AnimatedOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import Androw from 'react-native-androw';
import {scaleLinear} from 'd3-scale';
import {log} from '@io/events';
import * as path from 'svg-path-properties';
import * as shape from 'd3-shape';
import debounce from '../../../helpers/debounce';

const d3 = {
  shape,
};

const slider = React.createRef();
const label = React.createRef();
const SV = React.createRef();
const x = new Animated.Value(0);
const verticalPadding = 5;
const width = C.SCREEN_WIDTH - 20;
const height = 70;
const cursor = React.createRef();

const listItems = [
  {
    id: 1,
    leftIcon: Images.icon_light,
    heading: 'Gasshans Wallet',
    annonset: 0,
  },
  {
    id: 2,
    leftIcon: Images.icon_light,
    heading: 'Online Shopping',
    annonset: 25,
  },
  {
    id: 3,
    leftIcon: Images.icon_btcBtn,
    heading: 'Wallet B',
    annonset: 40,
  },
  {
    id: 4,
    leftIcon: Images.icon_light,
    heading: 'Gasshans Wallet',
    annonset: 0,
  },
];

const sampleData = {
  instanceId: null,
  unspentcoins: [
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
  ],
};
const SifirWasabiAutoSpendScreen = props => {
  const [isSwitchOn, setSwitchOn] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [listItemPositions, setListItemPositions] = useState({});
  const [listContainerPosition, setListContainerPosition] = useState(0);
  const [topTextPosition, setTopTextPosition] = useState(0);
  const [SVoffset, setSVoffset] = useState(0);
  const [anonset, setanonset] = useState(0);
  const {navigation} = props;

  useEffect(() => {
    StatusBar.setBackgroundColor(AppStyle.backgroundColor);
  }, []);

  const handleSwitch = value => {
    if (!value) {
      setSelectedWallet(null);
    }
    setSwitchOn(value);
  };

  const onLayoutListItem = (event, id) => {
    const {width, height, x, y} = event.nativeEvent.layout;
    setListItemPositions({...listItemPositions, [id]: {width, height, x, y}});
  };

  const makeUnspentCoinsChartData = chartData => {
    const data = chartData.reduce((g, t) => {
      g[Math.floor(t.anonymitySet)] =
        (g[Math.floor(t.anonymitySet)] || 0) + t.amount;
      return g;
    }, {});
    const sortedAnonsetTotalPairs = Object.entries(data).sort(
      ([anonset1], [anonset2]) => anonset1 - anonset2,
    );
    if (sortedAnonsetTotalPairs.length < 2) {
      sortedAnonsetTotalPairs.unshift(sortedAnonsetTotalPairs[0]);
    }
    const chartStats = sortedAnonsetTotalPairs.reduce(
      (stats, [anonset, total], i) => {
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

  const plotData = sampleData.unspentcoins;

  useEffect(() => {
    if (selectedWallet?.id) {
      _init();
    }
  }, [selectedWallet]);

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
      let left = X - 10;
      cursor?.current?.setNativeProps({
        left,
      });
      slider?.current.setNativeProps({
        left: left - 10,
      });
      moveCursor(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChartSlider = data =>
    debounce(({anonset, value}) => setanonset(Math.floor(anonset)), 1);

  const moveCursor = value => {
    let {x, y} = properties.getPointAtLength(lineLength - value);
    let left = x - +10;
    cursor?.current?.setNativeProps({
      left,
    });
    slider?.current.setNativeProps({
      left: left - 10,
    });
    const anonSetValue = scaleX.invert(x);
    const [, cumSumBalanceValue] = series.find(
      ([anonset]) => anonSetValue <= anonset,
    );
    const text = `${Math.floor(anonSetValue)}`;
    label?.current?.setNativeProps({
      text,
      left: left + 3.5,
    });
    handleChartSlider({
      anonset: anonSetValue,
      value: cumSumBalanceValue,
    });
  };

  return (
    <View style={styles.container}>
      <View
        onLayout={event => setHeaderHeight(event.nativeEvent.layout.height)}>
        <SifirAutoSpendHeader
          headerText="Set Minimum Anonset"
          handleBackPress={() => navigation.goBack()}
          isSwitchOn={isSwitchOn}
          setSwitchOn={handleSwitch}
          showOverlay={!isSwitchOn || selectedWallet?.id}
        />
      </View>
      <Text
        style={styles.description}
        onLayout={event => setTopTextPosition(event.nativeEvent.layout.y)}>
        Select one account to which the Wasabi wallet will autosend funds to.
      </Text>
      <View style={styles.seperator} />
      <ScrollView
        onScroll={event => setSVoffset(event.nativeEvent.contentOffset.y)}
        onLayout={event =>
          setListContainerPosition(event.nativeEvent.layout.y)
        }>
        {listItems.map(item => {
          const {id, leftIcon, heading, annonset} = item;
          return (
            <TouchableOpacity
              onPress={() => setSelectedWallet(item)}
              onLayout={event => onLayoutListItem(event, id)}>
              <SifirCard
                style={[
                  styles.cardContainer,
                  {
                    borderColor:
                      selectedWallet?.id === id
                        ? AppStyle.mainColor
                        : '#19282f',
                  },
                ]}>
                <Image source={leftIcon} style={styles.leftIcon} />
                <Text style={styles.listHeading}>{heading}</Text>
                <View style={styles.rightContainer}>
                  <Text style={styles.anonset}>{annonset}</Text>
                  <Text style={styles.anonsetLabel}>Min Anonset</Text>
                </View>
              </SifirCard>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {!isSwitchOn && (
        <AnimatedOverlay
          style={{
            top: headerHeight,
          }}
        />
      )}
      {selectedWallet?.id && (
        <AnimatedOverlay
          style={{top: headerHeight}}
          onTouchEnd={() => setSelectedWallet({})}
        />
      )}
      {selectedWallet?.id && (
        <SifirCard
          style={[
            styles.cardContainer,
            {
              borderColor: AppStyle.mainColor,
              position: 'absolute',
              top:
                listItemPositions[(selectedWallet?.id)].y +
                listContainerPosition -
                SVoffset,
            },
          ]}>
          <Image source={selectedWallet?.leftIcon} style={styles.leftIcon} />
          <Text style={styles.listHeading}>{selectedWallet?.heading}</Text>
          <View style={styles.rightContainer}>
            <Text style={styles.anonset}>{selectedWallet?.annonset}</Text>
            <Text style={styles.anonsetLabel}>Min Anonset</Text>
          </View>
        </SifirCard>
      )}
      {selectedWallet?.id && (
        <Text
          style={[
            styles.description,
            {
              position: 'absolute',
              top: topTextPosition,
              marginTop: 0,
            },
          ]}>
          Select one account to which the Wasabi wallet will autosend funds to.
        </Text>
      )}
      {selectedWallet?.id && (
        <Androw style={styles.shadow}>
          <View style={styles.stickyContainer}>
            <View>
              <AnimatedSlider
                SV={SV}
                lineLength={lineLength}
                slider={slider}
                label={label}
                x={x}
                cursor={cursor}
                minX={minX}
                maxX={maxX}
              />
            </View>
            <TouchableOpacity style={styles.confirmBtn}>
              <Text style={styles.confirmLabel}>CONFIRM</Text>
            </TouchableOpacity>
          </View>
        </Androw>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: AppStyle.backgroundColor},
  description: {color: 'white', textAlign: 'center', marginTop: 20},
  seperator: {
    backgroundColor: 'lightgray',
    height: 2,
    opacity: 0.1,
    marginHorizontal: 20,
    marginVertical: 30,
  },
  cardContainer: {
    marginStart: 20,
    marginEnd: 20,
    marginBottom: 24,
    backgroundColor: '#19282f',
    borderWidth: 2,
    borderColor: '#19282f',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  listHeading: {
    color: 'white',
    flex: 1,
    paddingLeft: 20,
  },
  anonset: {
    color: 'white',
    fontSize: 18,
  },
  anonsetLabel: {
    color: 'gray',
    fontSize: 12,
  },
  rightContainer: {
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  stickyContainer: {
    backgroundColor: '#091110',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
  },
  confirmBtn: {
    backgroundColor: AppStyle.mainColor,
    padding: 20,
    alignItems: 'center',
    margin: 20,
    borderRadius: 25,
  },
  confirmLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  shadow: {
    shadowColor: '#00EDE7',
    shadowOffset: {width: 0, height: -10},
    shadowOpacity: 0.4,
    shadowRadius: 5,
    height: '30%',
    backgroundColor: '#091110',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    overflow: 'hidden',
  },
});
export default SifirWasabiAutoSpendScreen;
