import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import SifirBTCAmount from '@elements/SifirBTCAmount';
import {Images, AppStyle, C} from '@common/index';

const BtcTxnListItem = ({
  title,
  description,
  imgURL,
  amount,
  unit,
  isSentTxn,
}) => {
  return (
    <TouchableOpacity>
      <View style={styles.listItme}>
        <Image source={imgURL} style={styles.listIcon} />
        <View style={styles.timeStrContainer}>
          <Text style={{color: AppStyle.mainColor}}>{title}</Text>
          <Text style={styles.txIDstr}>{description}</Text>
        </View>
        <Text
          style={[styles.amount, {color: isSentTxn ? '#6FB253' : '#DD9030'}]}>
          <SifirBTCAmount amount={amount} unit={unit} />
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItme: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 5,
    // height: 50,
    borderBottomColor: '#6B6B6B',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  txIDstr: {
    color: AppStyle.mainColor,
    fontWeight: 'bold',
  },
  amount: {
    flex: 2,
    color: AppStyle.mainColor,
    textAlign: 'right',
  },
  listIcon: {width: 40, height: 40},
  timeStrContainer: {flex: 5, marginLeft: 20},
});
export default BtcTxnListItem;
