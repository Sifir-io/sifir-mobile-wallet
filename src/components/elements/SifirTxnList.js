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
  let amount, imgURL, description, timeStr, isSentTxn;
  const {millisatoshis, timestamp} = decodedBolt11;
  amount = millisatoshis;
  description = desc;
  switch (status) {
    case 'unpaid':
      imgURL = Images.icon_yellowTxn;
      isSentTxn = false;
      break;
    case 'paid':
      imgURL = Images.icon_thickGreenArrowTxn;
      isSentTxn = true;
      break;
  }
  timeStr = moment(timestamp * 1000).fromNow();
  return {amount, description, imgURL, timeStr, isSentTxn};
};

const makePaysRenderData = ({decodedBolt11, meta: {preimage}}) => {
  let amount, imgURL, description, timeStr;
  const isSentTxn = true;
  const {millisatoshis, complete, timestamp} = decodedBolt11;
  if (complete) {
    imgURL = Images.icon_send;
    // FIXME strings to constants...
    description = `Paid - ${preimage.slice(0, 3)} .. ${preimage.slice(-3)}`;
    amount = millisatoshis;
    timeStr = moment(timestamp * 1000).fromNow();
  }
  return {amount, description, imgURL, timeStr, isSentTxn};
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

const ListItem = ({title, description, imgURL, amount, unit, isSentTxn}) => {
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
      <View style={styles.listItme}>
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
const SifirInvEntry = React.memo(({inv, unit}) => {
  const {type} = inv;
  try {
    const {amount, imgURL, timeStr, description, isSentTxn} =
      type === 'invoice' ? makeInvoiceRenderData(inv) : makePaysRenderData(inv);
    return (
      <ListItem
        title={timeStr}
        description={description}
        amount={amount}
        unit={unit}
        imgURL={imgURL}
        isSentTxn={isSentTxn}
      />
    );
  } catch (err) {
    return null;
  }
});
const SifirWasabiTxn = ({txn, unit}) => {
  try {
    const {amount, datetime, label} = txn;
    const imgURL = amount > 0 ? Images.icon_yellowTxn : Images.icon_send;
    const isSentTxn = amount > 0 ? false : true;
    return (
      <ListItem
        title={label}
        description={datetime}
        amount={amount}
        unit={unit}
        imgURL={imgURL}
        isSentTxn={isSentTxn}
      />
    );
  } catch (err) {
    return null;
  }
};
const SifirUnspentCoin = ({txn, unit}) => {
  try {
    const {amount, address, confirmed, label, anonymitySet, txid} = txn;
    // TODO add multiSelect list and use following icon
    const imgURL = confirmed ? Images.icon_confirmed : Images.icon_unconfirmed;
    return (
      <UnspentCoinListItem
        amount={amount}
        anonSet={anonymitySet}
        label={label}
        txid={txid}
        confirmed={confirmed}
        leftIcon={Images.icon_bitcoinWhiteOutlined}
        rightIcon={imgURL}
        address={address}
        unit={unit}
      />
    );
  } catch (err) {
    return null;
  }
};

/**
 * Takes equal slices of invoices and payments decodes them and sorts them
 */
const processLnTxnList = (txnData, start = 0, length = 20) =>
  [...(txnData?.invoices || []), ...(txnData?.pays || [])]
    .filter(txn => txn && txn?.decodedBolt11?.timestamp > 1)
    .sort((a, b) => b.decodedBolt11.timestamp - a.decodedBolt11.timestamp)
    .slice(start, length);

const processWasabiTxnList = (txnData, start = 0, length = 20) =>
  [...(txnData?.transactions || [])]
    .filter(txn => txn.label !== '')
    .sort((a, b) => b.datetime - a.datetime)
    .slice(start, length);

const processUnspentCoinsList = (txnData, start = 0, length = 20) =>
  [...(txnData?.unspentCoins || [])].slice(start, length);

const SifirTxnList = ({unit, txnData, type}) => {
  const [txnDataCached, setTxnDataCached] = useState([]);
  // FIXME proper array compare
  if (txnData.length !== txnDataCached.length) {
    setTxnDataCached(txnData);
  }
  const txnListToRender = React.useMemo(() => {
    if (type === C.STR_UNSPENT_COINS) {
      return processUnspentCoinsList(txnData, 0, 20);
    } else if (type === C.STR_WASABI_WALLET_TYPE) {
      return processWasabiTxnList(txnData, 0, 20);
    } else if (type === C.STR_LN_WALLET_TYPE) {
      return processLnTxnList(txnData, 0, 20);
    } else {
      return txnData;
    }
  }, [txnDataCached]);
  return (
    <FlatList
      data={txnListToRender}
      extraData={txnListToRender}
      contentContainerStyle={styles.listContentContainer}
      keyExtractor={(item, index) =>
        item?.bolt11 + item?.txid + index + item.tx
      }
      renderItem={({item}) => {
        if (type === C.STR_UNSPENT_COINS) {
          return <SifirUnspentCoin txn={item} unit={unit} />;
        } else if (type === C.STR_WASABI_WALLET_TYPE) {
          return <SifirWasabiTxn txn={item} unit={unit} />;
        } else if (type === C.STR_LN_WALLET_TYPE) {
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
  listContentContainer: {
    paddingHorizontal: 20,
  },
});
