import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import {Slider} from 'react-native-elements';
import {TextInput} from 'react-native-gesture-handler';
import {openAndFundPeerChannel} from '@actions/lnWallet';
import {connect} from 'react-redux';
import {ErrorScreen} from '@screens/error';

const SifirLNChannelFundingScreen = ({
  navigation,
  route,
  openAndFundPeerChannel,
  lnWallet,
}) => {
  const [ln_enable_set_fees, setFeesEnabled] = useState(false);
  const [fundingAmount, setFundingAmount] = useState(0);
  const {selectedNode, peers, nodeAddress, walletInfo} = route.params;
  console.log('peers---------', peers);
  // FIXME where to get nodeAlias? I didn't find it in above peers or selectedNode object.
  const {id: nodeId, nodeAlias} = selectedNode;
  const {loading, loaded, error} = lnWallet;
  const handleOpenChannelBtn = async () => {
    const fundingResponse = await openAndFundPeerChannel({
      peer: nodeId,
      msatoshi: fundingAmount,
    });
    // checking !== failed to handle timedout exception too
    if (fundingResponse.result !== 'failed') {
      navigation.navigate('LnChannelConfirmed', {fundingResponse, walletInfo});
    }
  };

  if (error) {
    return (
      <ErrorScreen
        title={C.STR_ERROR_channel_action}
        desc={C.STR_ERROR_txn_error}
        error={error}
        actions={[
          {
            text: C.STR_GO_BACK,
            onPress: () => navigation.navigate('Account', {walletInfo}),
          },
        ]}
      />
    );
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.margin_30}>
          <View style={styles.textRow}>
            <Image source={Images.icon_indicator} style={styles.back} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Links');
              }}>
              <Text
                style={[
                  styles.text_white,
                  styles.text_normal,
                  styles.text_bold,
                ]}>
                Open Channel
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.fuding_wrapper]}>
            <Text
              style={[styles.textBright, styles.text_normal, styles.text_bold]}>
              FUNDING AMOUNT
            </Text>
            <TextInput
              keyboardType="number-pad"
              style={styles.fundInputField}
              onChangeText={amount => setFundingAmount(amount)}
            />
          </View>

          <View style={[styles.margin_15, styles.margin_top_30]}>
            {nodeAlias && (
              <>
                <Text style={[styles.textBright]}>Alias</Text>
                <Text style={[styles.text_white, styles.text_large]}>
                  {nodeAlias}
                </Text>
              </>
            )}
            <Text style={[styles.textBright, styles.margin_top_15]}>
              Node Id
            </Text>
            <Text style={[styles.text_white, styles.text_large]}>{nodeId}</Text>

            <Text style={[styles.textBright, styles.margin_top_15]}>
              Node Address
            </Text>
            <Text style={[styles.text_white, styles.text_large]}>
              {nodeAddress}
            </Text>

            <Text style={[styles.textBright, styles.margin_top_15]}>Port</Text>
            <Text style={[styles.text_white, styles.text_large]}>Public</Text>

            <Text style={[styles.textBright, styles.margin_top_15]}>Fees</Text>
            <View style={[styles.space_between, styles.mt7]}>
              {ln_enable_set_fees && (
                <View style={styles.outline_button}>
                  <Text style={[styles.text_white, styles.text_large]}>
                    0.015 BTC
                  </Text>
                </View>
              )}
              <View
                style={[
                  styles.slider_wrapper,
                  {marginLeft: ln_enable_set_fees ? 20 : 0},
                ]}>
                <Slider
                  disabled={!ln_enable_set_fees}
                  value={0.6}
                  onValueChange={value => {}}
                  style={
                    ln_enable_set_fees ? styles.width_60 : styles.width_100
                  }
                  thumbTintColor="white"
                  maximumTrackTintColor="rgba(45, 171, 226,0.2)"
                  minimumTrackTintColor="rgb(45, 171, 226)"
                />
                {ln_enable_set_fees && (
                  <View style={styles.row}>
                    <Text style={styles.textBright}>Approximate wait</Text>
                    <Text style={[styles.text_white, {marginLeft: 40}]}>
                      4 hours
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          {loading && !loaded && <ActivityIndicator />}
          <TouchableOpacity
            style={styles.yellow_button}
            onPress={() => handleOpenChannelBtn()}>
            <Text
              style={[styles.text_26, styles.text_center, styles.text_bold]}>
              OPEN CHANNEL
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

SifirLNChannelFundingScreen.navigationOptions = {
  header: null,
};

const mapStateToProps = state => {
  return {
    lnWallet: state.lnWallet,
  };
};

const mapDispatchToProps = {
  openAndFundPeerChannel,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirLNChannelFundingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor,
  },
  text_26: {fontSize: 26},
  row: {
    flexDirection: 'row',
  },
  yellow_button: {
    backgroundColor: '#ffa500',
    padding: 25,
    borderRadius: 10,
    marginTop: 50,
  },
  space_between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  width_60: {
    width: '60%',
  },
  width_100: {
    width: '100%',
  },
  text_bold: {
    fontWeight: 'bold',
  },
  text_normal: {
    fontSize: 13,
  },
  text_center: {
    textAlign: 'center',
  },
  text_large: {
    fontSize: 20,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text_white: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
  },
  textBright: {
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFont,
  },
  mt7: {
    marginTop: 7,
  },
  slider_wrapper: {width: '100%', marginLeft: 20},
  back: {
    marginRight: 8,
    width: 12,
    height: 12,
  },
  margin_30: {
    margin: 30,
  },
  margin_15: {
    margin: 15,
  },
  margin_top_30: {marginTop: 30},
  margin_top_15: {marginTop: 15},
  fuding_wrapper: {
    alignItems: 'center',
    marginTop: 50,
  },
  text_x_large: {
    fontSize: 60,
  },
  outline_button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppStyle.mainColor,
    justifyContent: 'center',
  },
  fundInputField: {
    width: '90%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: AppStyle.mainColor,
    borderRadius: 4,
    color: 'white',
    fontSize: 18,
    padding: 10,
    fontFamily: AppStyle.mainFont,
  },
});