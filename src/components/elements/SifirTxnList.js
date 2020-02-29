import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import SifirBTCAmount from '@elements/SifirBTCAmount';
import moment from 'moment';
import {Images, AppStyle} from '@common/index';

const sortTxnData = txnData => {
  return txnData.sort((a, b) => {
    return moment(b.timereceived * 1000).diff(moment(a.timereceived * 1000));
  });
};

const SifirTxnEntry = ({txn, unit}) => {
  const makeRenderData = ({category, txid, amount, timereceived}) => {
    let txIDStr = `${txid.slice(0, 3)} .. ${txid.slice(-3)}`;
    let imgURL;
    if (category) {
      switch (category) {
        case 'send':
          txIDStr = 'Sent - #' + txIDStr;
          imgURL = Images.icon_send;
          break;
        case 'receive':
          txIDStr = 'Received - #' + txIDStr;
          imgURL = Images.icon_receive;
          break;
        default:
          txIDStr = 'Unknown - #' + txIDStr;
          imgURL = Images.icon_receive;
          break;
      }
    } else {
      txIDStr = 'Received - #' + txIDStr;
      imgURL = Images.icon_receive;
    }
    const timeStr = moment(timereceived * 1000).fromNow();
    return {imgURL, txIDStr, amount, timeStr};
  };

  const {imgURL, txIDStr, amount, timeStr} = makeRenderData(txn);

  return (
    <TouchableOpacity>
      <View style={styles.listItme}>
        <Image source={imgURL} style={{width: 30, height: 30}} />
        <View style={{flex: 5, marginLeft: 20}}>
          <Text style={{color: AppStyle.mainColor}}>{timeStr}</Text>
          <Text style={styles.txIDstr}>{txIDStr}</Text>
        </View>
        <Text style={styles.amount}>
          <SifirBTCAmount amount={amount} unit={unit} />
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const SifirInvEntry = ({inv, unit}) => {
  const {msatoshi, description, payment_hash} = inv;
  const paymentHashStr = `${payment_hash.slice(0, 9)} .... ${payment_hash.slice(
    -9,
  )}`;

  return (
    <TouchableOpacity>
      <View style={styles.listItme}>
        {/* <Image source={imgURL} style={{width: 30, height: 30}} /> */}
        <View style={{flex: 5}}>
          <Text style={{color: AppStyle.mainColor}}>{description}</Text>
          <Text style={styles.txIDstr}>{paymentHashStr}</Text>
        </View>
        <Text style={styles.amount}>
          <SifirBTCAmount amount={msatoshi} unit={unit} />
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const SifirTxnList = ({width, height, unit, txnData, invoices}) => {
  txnData = txnData ? sortTxnData(txnData) : null;
  return (
    <FlatList
      data={txnData || invoices}
      style={height}
      width={width}
      keyExtractor={(item, index) => item.label + item.txid + index}
      renderItem={({item}) => {
        if (txnData) {
          return <SifirTxnEntry txn={item} unit={unit} />;
        }
        return <SifirInvEntry inv={item} unit={unit} />;
      }}
    />
  );
};

export default SifirTxnList;

const styles = StyleSheet.create({
  listItme: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderBottomColor: AppStyle.listViewSep,
    borderBottomWidth: 2,
    alignItems: 'center',
  },
  txIDstr: {
    color: AppStyle.mainColor,
    fontWeight: 'bold',
  },
  amount: {
    flex: 2,
    color: AppStyle.mainColor,
  },
});
