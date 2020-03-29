import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Image} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import SifirBTCAmount from '@elements/SifirBTCAmount';
import LinearGradient from 'react-native-linear-gradient';
const BTN_WIDTH = C.SCREEN_WIDTH / 2;

const SifirAccountHeader = ({
  loading,
  loaded,
  type,
  balance,
  btcUnit,
  label,
}) => {
  const walletIcon =
    type === C.STR_LN_WALLET_TYPE ? Images.icon_light : Images.icon_bitcoin;
  return (
    <View style={styles.headerView}>
      <LinearGradient
        height={BTN_WIDTH - 50}
        width={BTN_WIDTH - 40}
        colors={['#52d4cd', '#54a5b1', '#57658c']}
        style={styles.gradient}>
        <View>
          <Image source={walletIcon} style={styles.boxImage} />
          {loading === true && (
            <ActivityIndicator size="large" color={AppStyle.mainColor} />
          )}
          {loaded === true && loading === false && (
            <>
              <Text style={styles.boxTxt} numberOfLines={1}>
                {label}
              </Text>
              {type === C.STR_WATCH_WALLET_TYPE && (
                <Text style={styles.boxTxt}>{C.STR_WATCHING}</Text>
              )}
            </>
          )}
        </View>
      </LinearGradient>
      <View
        height={BTN_WIDTH - 30}
        width={BTN_WIDTH - 30}
        style={styles.balanceView}>
        {loading === true && (
          <ActivityIndicator size="large" color={AppStyle.mainColor} />
        )}
        {loaded === true && loading === false && (
          <>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.balAmountTxt}>
                <SifirBTCAmount amount={balance} unit={btcUnit} />
              </Text>
            </View>
            <Text style={styles.balanceTxt}>{C.STR_Cur_Balance}</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerView: {
    flex: 3,
    marginTop: 0,
    marginLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gradient: {
    flex: 4.6,
    borderWidth: 1,
    borderRadius: 15,
  },
  boxImage: {
    marginBottom: 10,
    marginTop: 15,
    marginLeft: 13,
    width: 43,
    height: 43,
    opacity: 0.6,
  },
  boxTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 24,
    marginLeft: 13,
    marginBottom: -10,
    marginRight: 4,
  },
  balanceView: {
    flex: 5,
    flexDirection: 'column-reverse',
    marginLeft: 25,
    paddingBottom: 15,
  },
  balAmountTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: BTN_WIDTH / 4,
  },
  balanceTxt: {
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFont,
    fontSize: 16,
    textAlignVertical: 'bottom',
    marginBottom: -5,
    marginLeft: 5,
  },
});
export default SifirAccountHeader;
