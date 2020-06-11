/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import SifirAutoSpendHeader from '@elements/SifirHeaders/SifirAutoSpendHeader';
import {AppStyle, svg, Images} from '@common';
import SifirCard from '../../elements/SifirCard';
import AnimatedOverlay from '../../elements/AnimatedOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import Androw from 'react-native-androw';

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

const SifirWasabiAutoSpendScreen = props => {
  const [isSwitchOn, setSwitchOn] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [listItemPositions, setListItemPositions] = useState({});
  const [listContainerPosition, setListContainerPosition] = useState(0);
  const [topTextPosition, setTopTextPosition] = useState(0);
  const [SVoffset, setSVoffset] = useState(0);
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
        // contentContainerStyle={{paddingBottom:  '70%'}}
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
