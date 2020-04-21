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
  loaded,
  txnData,
  btcUnit,
  type,
  headerText,
}) => {
  const BTN_WIDTH = C.SCREEN_WIDTH / 2;
  return (
    <>
      <View style={styles.txnSetView}>
        <Text style={styles.txnLblTxt}>{headerText}</Text>
        <TouchableOpacity>
          <Image source={Images.icon_setting} style={styles.settingIcon} />
        </TouchableOpacity>
        {loading && (
          <ActivityIndicator
            style={styles.spinner}
            color={AppStyle.mainColor}
          />
        )}
      </View>
      <View style={styles.txnListView}>
        <SifirTxnList
          txnData={txnData}
          type={type}
          unit={btcUnit}
          width={BTN_WIDTH * 2 - 50}
          height={200}
        />
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
  settingIcon: {width: 20, height: 20, marginLeft: 20, marginTop: 7},
  spinner: {right: 30, position: 'absolute', alignSelf: 'center'},
});

export default SifirAccountHistory;
