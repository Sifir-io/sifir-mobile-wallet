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
import {Images, AppStyle, C} from '@common/index';
import {useMemo, useState} from 'react';
const makeInvoiceRenderData = ({
  decodedBolt11,
  meta: {description: desc, status},
}) => {
  let amount, imgURL, description, timeStr;
  const {millisatoshis, timestamp} = decodedBolt11;
  amount = millisatoshis;
  description = desc;
  switch (status) {
    case 'unpaid':
      imgURL = Images.icon_yellowTxn;
      break;
    case 'paid':
      imgURL = Images.icon_thickGreenArrowTxn;
      break;
  }
  timeStr = moment(timestamp * 1000).fromNow();
  return {amount, description, imgURL, timeStr};
};

const makePaysRenderData = ({decodedBolt11, meta: {preimage}}) => {
  let amount, imgURL, description, timeStr;
  const {millisatoshis, complete, timestamp} = decodedBolt11;
  if (complete) {
    imgURL = Images.icon_send;
    // FIXME strings to constants...
    description = `Paid - ${preimage.slice(0, 3)} .. ${preimage.slice(-3)}`;
    amount = millisatoshis;
    timeStr = moment(timestamp * 1000).fromNow();
  }
  return {amount, description, imgURL, timeStr};
};

const makeTxnRenderData = ({category, txid, amount, timereceived}) => {
  let imgURL, timeStr, txIDStr;
  txIDStr = `${txid.slice(0, 3)} .. ${txid.slice(-3)}`;
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
  timeStr = moment(timereceived * 1000).fromNow();
  return {imgURL, txIDStr, amount, timeStr};
};

// FIXME this file is starting to get conjected , move these to elements
const SifirTxnEntry = ({txn, unit}) => {
  const {imgURL, txIDStr, amount, timeStr} = makeTxnRenderData(txn);
  return (
    <ListItem
      title={timeStr}
      description={txIDStr}
      amount={amount}
      unit={unit}
      imgURL={imgURL}
    />
  );
};

const ListItem = ({title, description, imgURL, amount, unit}) => {
  return (
    <TouchableOpacity>
      <View style={styles.listItme}>
        <Image source={imgURL} style={styles.arrowIcon} />
        <View style={styles.timeStrContainer}>
          <Text style={{color: AppStyle.mainColor}}>{title}</Text>
          <Text style={styles.txIDstr}>{description}</Text>
        </View>
        <Text style={styles.amount}>
          <SifirBTCAmount amount={amount} unit={unit} />
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const SifirInvEntry = React.memo(({inv, unit}) => {
  const {type} = inv;
  try {
    const {amount, imgURL, timeStr, description} =
      type === 'invoice' ? makeInvoiceRenderData(inv) : makePaysRenderData(inv);
    return (
      <ListItem
        title={timeStr}
        description={description}
        amount={amount}
        unit={unit}
        imgURL={imgURL}
      />
    );
  } catch (err) {
    return null;
  }
});

/**
 * Takes equal slices of invoices and payments decodes them and sorts them
 */
const processLnTxnList = (txnData, start = 0, length = 20) =>
  [...(txnData?.invoices || []), ...(txnData?.pays || [])]
    .filter(txn => txn && txn?.decodedBolt11?.timestamp > 1)
    .sort((a, b) => b.decodedBolt11.timestamp - a.decodedBolt11.timestamp)
    .slice(start, length);

const SifirTxnList = ({width, height, unit, txnData, type}) => {
  const [txnDataCached, setTxnDataCached] = useState([]);
  // FIXME proper array compare
  if (txnData.length !== txnDataCached.length) {
    setTxnDataCached(txnData);
  }
  const txnListToRender = React.useMemo(() => {
    if (type === C.STR_LN_WALLET_TYPE) {
      return processLnTxnList(txnData, 0, 20);
    } else {
      return txnData;
    }
  }, [txnDataCached]);
  return (
    <FlatList
      data={txnListToRender}
      style={height}
      width={width}
      keyExtractor={(item, index) => item?.bolt11 + item?.txid + index}
      renderItem={({item}) => {
        if (type === C.STR_LN_WALLET_TYPE) {
          return <SifirInvEntry inv={item} unit={unit} />;
        } else {
          return <SifirTxnEntry txn={item} unit={unit} />;
        }
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
  arrowIcon: {width: 30, height: 30},
  timeStrContainer: {flex: 5, marginLeft: 20},
});
