import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import SifirTxnList from '@elements/SifirTxnList';

const SifirAccountHistory = ({
  loading,
  loadingLN,
  loaded,
  txnData,
  invoices,
  btcUnit,
}) => {
  const BTN_WIDTH = C.SCREEN_WIDTH / 2;

  return (
    <>
      <View style={styles.txnSetView}>
        <Text style={styles.txnLblTxt}>{C.TRANSACTIONS}</Text>
        <TouchableOpacity>
          <Image
            source={Images.icon_setting}
            style={{width: 20, height: 20, marginLeft: 20, marginTop: 7}}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.txnListView}>
        {(loading || loadingLN) && (
          <ActivityIndicator size="large" color={AppStyle.mainColor} />
        )}
        {loaded === true &&
          loading === false &&
          (txnData !== null || invoices !== null) && (
            <SifirTxnList
              txnData={txnData}
              invoices={invoices}
              unit={btcUnit}
              width={BTN_WIDTH * 2 - 50}
              height={200}
            />
          )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  txnSetView: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 26,
    marginTop: 30,
  },
  txnLblTxt: {
    color: 'white',
    fontSize: 23,
    fontWeight: 'bold',
  },
  txnListView: {
    flex: 3,
    height: '100%',
    marginBottom: 20,
    marginLeft: 25,
  },
});

export default SifirAccountHistory;
