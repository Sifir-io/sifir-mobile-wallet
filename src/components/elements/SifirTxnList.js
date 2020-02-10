import React, {Component, PureComponent} from 'react';
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

class SifirTxnEntry extends PureComponent {
  makeRenderData = ({category, txid, amount, timereceived, unit}) => {
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

  render() {
    const {txn, unit} = this.props;
    const {imgURL, txIDStr, amount, timeStr} = this.makeRenderData(txn);

    return (
      <TouchableOpacity>
        <View style={styles.listItme}>
          <Image source={imgURL} style={{width: 30, height: 30}} />
          <View style={{flex: 5, marginLeft: 20}}>
            <Text style={{color: AppStyle.mainColor}}>{timeStr}</Text>
            <Text style={{color: AppStyle.mainColor, fontWeight: 'bold'}}>
              {txIDStr}
            </Text>
          </View>
          <Text
            style={{
              flex: 2,
              color: AppStyle.mainColor,
            }}>
            <SifirBTCAmount amount={amount} unit={unit} />
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class SifirTxnList extends Component {
  state = {
    txnData: {},
  };

  sortTxnData = txnData => {
    return txnData.sort((a, b) => {
      return moment(b.timereceived * 1000).diff(moment(a.timereceived * 1000));
    });
  };

  componentDidMount() {
    this.setState({txnData: this.sortTxnData(this.props.txnData)});
  }

  render() {
    const {width, height, unit} = this.props;
    return (
      <FlatList
        data={this.state.txnData}
        style={height}
        width={width}
        keyExtractor={(item, index) => item.category + item.txid}
        renderItem={({item}) => <SifirTxnEntry txn={item} unit={unit} />}
      />
    );
  }
}

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
});
