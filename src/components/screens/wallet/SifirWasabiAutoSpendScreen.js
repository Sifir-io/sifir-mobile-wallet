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
import SifirAnonimitySlider from '@elements/SifirAnonimitySlider';
import {AppStyle, C, Images} from '@common';
import SifirCard from '@elements/SifirCard';
import SifirAnimatedOverlay from '@elements/SifirAnimatedOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import Androw from 'react-native-androw';
import {scaleLinear} from 'd3-scale';
import {log, error} from '@io/events';
import * as path from 'svg-path-properties';
import * as shape from 'd3-shape';
import debounce from '@helpers/debounce';
// import makeUnspentCoinsChartData from '@helpers/makeUnspentCoinsChartData';
import SifirAutoSpendWalletCard from '@elements/SifirAutoSpendWalletCard';

const d3 = {
  shape,
};

const slider = React.createRef();
const label = React.createRef();
const SV = React.createRef();
const x = new Animated.Value(0);
const width = C.SCREEN_WIDTH - 20;
const cursor = React.createRef();

const SifirWasabiAutoSpendScreen = props => {
  const [isSwitchOn, setSwitchOn] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [listItemPositions, setListItemPositions] = useState({});
  const [listContainerPosition, setListContainerPosition] = useState(0);
  const [topTextPosition, setTopTextPosition] = useState(0);
  const [SVoffset, setSVoffset] = useState(0);
  const {minX = 2, maxX = 120} = props;
  const {
    onBackPress,
    onConfirm,
    walletList,
    autoSpendWalletMinAnonset,
    autoSpendWallet,
  } = props.route.params;
  useEffect(() => {
    StatusBar.setBackgroundColor(AppStyle.backgroundColor);
    console.log('auto spend scree', autoSpendWalletMinAnonset, autoSpendWallet);
    const autoSpendWalletObj = walletList.find(
      ({label: l}) => l === autoSpendWallet,
    );
    if (!autoSpendWalletObj) {
      error('Selected auto spend wallet is not part of walletList ignoring');
      return;
    }
    setSelectedWallet({
      ...autoSpendWalletObj,
      annonset: autoSpendWalletMinAnonset,
    });
    setSwitchOn(true);
  }, []);

  useEffect(() => {
    if (selectedWallet?.label) {
      _init();
    }
  }, [selectedWallet]);

  const handleSwitch = value => {
    if (!value) {
      setSelectedWallet(null);
    }
    setSwitchOn(value);
  };

  const onLayoutListItem = (event, itemLabel) => {
    const {width: itemWidth, height, x: itemX, y} = event.nativeEvent.layout;
    // atomic setState
    setListItemPositions(prevState => ({
      ...prevState,
      [itemLabel]: {width: itemWidth, height, x: itemX, y},
    }));
  };

  const {scaleX, properties, lineLength} = useMemo(() => {
    const scaleX = scaleLinear()
      .domain([minX, maxX])
      .range([20, width - 20]);
    const line = d3.shape
      .line()
      .x(anonset => scaleX(Number(anonset)))
      .y(() => 0)
      .curve(d3.shape.curveStepBefore)([minX, maxX]);
    const p = path.svgPathProperties(line);
    return {
      scaleX,
      properties: p,
      lineLength: p.getTotalLength(),
    };
  }, [minX, maxX]);

  const _init = () => {
    try {
      x.addListener(({value}) => moveCursor(value));
      let {x: X} = properties.getPointAtLength(lineLength);
      let left = X - 10;
      cursor?.current?.setNativeProps({
        left,
      });
      slider?.current.setNativeProps({
        left: left - 10,
      });
      moveCursor(lineLength / 2);
    } catch (err) {
      error(err);
    }
  };
  let anonSetValue;

  const moveCursor = value => {
    let {x} = properties.getPointAtLength(lineLength - value);
    let left = x - +10;
    cursor?.current?.setNativeProps({
      left,
    });
    slider?.current.setNativeProps({
      left: left - 10,
    });
    anonSetValue = Math.floor(scaleX.invert(x));
    const text = `${anonSetValue}`;
    label?.current?.setNativeProps({
      text,
      left: left + 3.5,
    });
    // setAnonset(anonSetValue);
  };

  const WalletList = useMemo(
    () =>
      walletList.map(item => {
        return (
          <SifirAutoSpendWalletCard
            item={item}
            onLayoutListItem={onLayoutListItem.bind(this)}
            setSelectedWallet={setSelectedWallet.bind(this)}
            selectedWallet={selectedWallet}
          />
        );
      }),
    [walletList, selectedWallet],
  );

  const WalletAnonSlider = useMemo(() => {
    return (
      <Androw style={styles.shadow}>
        <View style={styles.stickyContainer}>
          <View>
            <SifirAnonimitySlider
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
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => onConfirm({selectedWallet, anonset: anonSetValue})}>
            <Text style={styles.confirmLabel}>{C.STR_CONFIRM}</Text>
          </TouchableOpacity>
        </View>
      </Androw>
    );
  }, [minX, maxX, selectedWallet, label]);

  const DarkOverLay = useMemo(
    () => (
      <SifirAnimatedOverlay
        style={{
          top: headerHeight,
        }}
        onTouchEnd={
          selectedWallet?.label ? () => setSelectedWallet({}) : undefined
        }
        effectDeps={[isSwitchOn, selectedWallet]}
      />
    ),
    [headerHeight, selectedWallet, isSwitchOn],
  );
  return (
    <View style={styles.container}>
      <View
        onLayout={event => setHeaderHeight(event.nativeEvent.layout.height)}>
        <SifirAutoSpendHeader
          onBackPress={() => {
            onBackPress({isSwitchOn, selectedWallet, anonSetValue});
          }}
          headerText={'Auto Send'}
          isSwitchOn={isSwitchOn}
          setSwitchOn={handleSwitch}
          showOverlay={!isSwitchOn || selectedWallet?.label}
        />
      </View>
      <Text
        style={styles.description}
        onLayout={event => setTopTextPosition(event.nativeEvent.layout.y)}>
        {C.STR_Select_Account}
      </Text>
      <View style={styles.seperator} />
      <ScrollView
        onScroll={event => setSVoffset(event.nativeEvent.contentOffset.y)}
        onLayout={event =>
          setListContainerPosition(event.nativeEvent.layout.y)
        }>
        {WalletList}
      </ScrollView>
      {(!isSwitchOn || selectedWallet?.label) && DarkOverLay}
      {/* TODO this should reus SifirAutoSpendCard */}
      {selectedWallet?.label && listItemPositions[selectedWallet.label] && (
        <SifirCard
          style={[
            styles.cardContainer,
            {
              borderColor: AppStyle.mainColor,
              position: 'absolute',
              top:
                listItemPositions[selectedWallet.label].y +
                listContainerPosition -
                SVoffset,
            },
          ]}>
          <Image source={selectedWallet?.iconURL} style={styles.leftIcon} />
          <Text style={styles.listHeading}>{`${selectedWallet?.label} ${
            selectedWallet.desc
          }`}</Text>
          <View style={styles.rightContainer}>
            <Text style={styles.anonset}>{selectedWallet?.annonset}</Text>
            <Text style={styles.anonsetLabel}>{C.STR_Min_Anonset}</Text>
          </View>
        </SifirCard>
      )}
      {selectedWallet?.label && (
        <Text
          style={[
            styles.description,
            {
              position: 'absolute',
              top: topTextPosition,
              marginTop: 0,
            },
          ]}>
          {C.STR_Select_Account}
        </Text>
      )}
      {selectedWallet?.label && WalletAnonSlider}
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
    backgroundColor: '#091110',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    overflow: 'hidden',
  },
});
export default SifirWasabiAutoSpendScreen;
