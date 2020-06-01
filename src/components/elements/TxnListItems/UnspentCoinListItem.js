import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import SifirBTCAmount from '@elements/SifirBTCAmount';
import {Images, AppStyle, C} from '@common/index';

const UnspentCoinListItem = ({
  amount,
  anonSet,
  label,
  txid,
  confirmed,
  leftIcon,
  rightIcon,
  unit,
}) => {
  return (
    <TouchableOpacity>
      <View style={styles.listItem}>
        <Image source={leftIcon} resizeMode="contain" style={styles.listIcon} />
        <View style={styles.timeStrContainer}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.unspentAmount}>
              <SifirBTCAmount amount={amount} unit={unit} />
            </Text>
            <Text style={styles.annonSet}>
              {'  '} Anonset: {anonSet}
            </Text>
          </View>
          <Text style={styles.label}>{'label'}</Text>
          <Text
            style={[styles.txid, {width: '80%'}]}
            numberOfLines={1}
            ellipsizeMode="middle">
            TX ID <Text style={styles.bold}>{txid}</Text>
          </Text>
        </View>
        <Image
          source={rightIcon}
          resizeMode="contain"
          style={styles.listIcon}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 5,
    // height: 50,
    borderBottomColor: '#6B6B6B',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  listIcon: {width: 40, height: 40},
  timeStrContainer: {flex: 5, marginLeft: 20},
  annonSet: {
    color: '#82C9C6',
    fontWeight: 'bold',
    fontSize: 13,
  },
  unspentAmount: {
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    color: '#fff',
    fontSize: 13,
  },
  txid: {
    marginTop: 5,
    color: AppStyle.mainColor,
  },
  bold: {fontWeight: 'bold'},
});

export default UnspentCoinListItem;
