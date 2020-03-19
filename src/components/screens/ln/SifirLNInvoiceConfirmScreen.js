import React, {useState, useEffect, createRef, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {AppStyle, Images, C} from '@common/index';
import {SifirChannelProgress} from '@elements/SifirChannelProgress';
import SlidingPanel from 'react-native-sliding-up-down-panels';
import {getRoute, getPeers, payBolt} from '@actions/lnWallet';
import {ErrorScreen} from '@screens/error';
import {connect} from 'react-redux';
import moment from 'moment';
import SifirBTCAmount from '@elements/SifirBTCAmount';

// FIXME this comes from styles vh not window
const {width, height} = Dimensions.get('window');
const SifirLNInvoiceConfirmScreen = props => {
  const [routes, setRoutes] = useState([]);
  const [peers, setPeers] = useState([]);
  const [routeFound, setRouteFound] = useState({});
  const [progress, setProgress] = useState(10);
  useEffect(() => {
    (async () => {
      const {invoice} = props.route.params;
      const [allroutes, allPeers] = await Promise.all([
        props.getRoute(invoice.payee, invoice.msatoshi),
        props.getPeers(),
      ]);
      const foundRoute = allPeers.find(peer => peer.id === allroutes[0]?.id);
      setRoutes(allroutes);
      setPeers(allPeers);
      setRouteFound(foundRoute);
    })();
  }, []);

  const handleSendButton = async () => {
    const {bolt11, walletInfo} = props.route.params;
    props.payBolt(bolt11);
    props.navigation.navigate('LnInvoicePaymentConfirmed', {
      bolt11,
      walletInfo,
      displayUnit: 'MSAT',
      isSendTxn: true,
    });
  };

  const handleOpenChannelDrag = () => {
    childRef.current?.onRequestClose();
    props.navigation.navigate('LNChannelRoute', {
      screen: 'LnNodeSelect',
      params: {walletInfo},
    });
  };

  useEffect(() => {
    const {loading} = props.lnWallet;
    // TODO replace it with Animated API.
    let progressBar;
    if (loading) {
      progressBar = setTimeout(() => {
        progress === 100 ? setProgress(10) : setProgress(progress + 2);
      }, 100);
    } else {
      clearTimeout(progressBar);
    }
  }, [props.lnWallet, progress]);

  const childRef = useRef();
  const {amount_msat, description, expiry} = props.route.params.invoice;
  const {loading, loaded, error} = props.lnWallet;
  const {walletInfo} = props.route.params;
  let openChannelLabel;
  let channel;
  if (routeFound?.id) {
    channel = routeFound.channels[0];
    openChannelLabel = `${channel.channel_id.slice(
      0,
      4,
    )}-${channel.channel_id.slice(-4)} - `;
  }
  if (error) {
    return (
      <ErrorScreen
        title={C.STR_ERROR_btc_action}
        desc={C.STR_ERROR_txn_error}
        error={error}
        actions={[
          {
            text: C.STR_GO_BACK,
            onPress: () => this.backToAccount(),
          },
        ]}
      />
    );
  }
  return (
    <View style={styles.container}>
      <View style={[styles.margin_30, styles.flex1]}>
        <View style={[styles.funding_wrapper]}>
          <Text style={[styles.textBright, styles.text_11, styles.text_bold]}>
            INVOICE AMOUNT
          </Text>
          <View style={[styles.textRow]}>
            <Text style={[styles.text_white, styles.text_x_large]}>
              {amount_msat}
            </Text>
          </View>
          <Text style={[styles.text_white, styles.text_18]}>{description}</Text>
          <Text style={[styles.textBright, styles.text_14, styles.text_bold]}>
            EXPIRES IN{'  '}
            <Text style={[styles.text_white, styles.text_18]}>
              {moment(Date.now() + expiry)
                .fromNow()
                .substr(3)}{' '}
              from now
            </Text>
          </Text>
        </View>
        <View style={[styles.margin_15, styles.margin_top_50]}>
          <View style={[styles.flex1, styles.justify_center]}>
            <SifirChannelProgress
              routes={routes}
              loaded={loading ? progress : loaded ? 100 : 0}
            />
          </View>
        </View>
        <View style={styles.justify_center}>
          <TouchableOpacity
            disabled={!loaded || loading || routes.length === 0}
            style={styles.send_button}
            onLongPress={() => handleSendButton()}>
            <Text
              style={[styles.text_large, styles.text_center, styles.text_bold]}>
              SEND
            </Text>
            <Image source={Images.icon_up_dark} style={styles.send_icon} />
          </TouchableOpacity>
        </View>
      </View>
      {loaded && peers.length > 0 && (
        <View style={styles.justify_end}>
          <SlidingPanel
            ref={childRef}
            headerLayoutHeight={80}
            AnimationSpeed={50}
            onAnimationStop={() => handleOpenChannelDrag()}
            onDragStop={() => handleOpenChannelDrag()}
            headerLayout={() => (
              <View style={routeFound?.id ? styles.transparent : styles.orange}>
                <View
                  style={
                    routeFound?.id
                      ? styles.activeTriangle
                      : styles.inactiveTriangle
                  }
                />
                <Text
                  style={[
                    styles.commonTextStyle,
                    routeFound?.id ? styles.orangeColor : styles.darkColor,
                    styles.text_large,
                  ]}>
                  {!routeFound?.id ? 'OPEN CHANNEL' : openChannelLabel}
                  {routeFound?.id && (
                    <SifirBTCAmount
                      amount={channel.spendable_msatoshi}
                      unit="MSAT"
                    />
                  )}
                </Text>
              </View>
            )}
            slidingPanelLayout={() => (
              <View style={styles.slidingPanelLayoutStyle} />
            )}
          />
        </View>
      )}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    lnWallet: state.lnWallet,
  };
};

const mapDispatchToProps = {
  getRoute,
  getPeers,
  payBolt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirLNInvoiceConfirmScreen);

SifirLNInvoiceConfirmScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor,
  },
  justify_center: {flexDirection: 'row', justifyContent: 'center'},
  justify_end: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  send_icon: {width: 15, height: 15, marginLeft: 10},
  inactiveTriangle: {
    position: 'absolute',
    top: -10,
    left: '45%',
    borderLeftWidth: 15,
    borderLeftColor: 'transparent',
    borderRightWidth: 15,
    borderRightColor: 'transparent',
    borderBottomWidth: 15,
    borderStyle: 'solid',
    borderBottomColor: '#ffa500',
  },
  activeTriangle: {
    position: 'absolute',
    top: -4,
    left: '45%',
    height: 20,
    width: 20,
    borderLeftWidth: 4,
    borderLeftColor: 'orange',
    borderTopWidth: 4,
    borderTopColor: 'orange',
    borderStyle: 'solid',
    transform: [{rotate: '45deg'}],
  },
  send_button: {
    backgroundColor: AppStyle.mainColor,
    padding: 30,
    borderRadius: 10,
    marginTop: 40,
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  send_button_disabled: {
    backgroundColor: 'transparent',
    paddingVertical: 26,
    paddingHorizontal: 85,
    borderRadius: 10,
    marginTop: 52,
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#53cbc8',
  },
  space_between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orange: {
    width,
    height: 80,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparent: {
    width,
    height: 80,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeColor: {
    color: 'orange',
  },
  slidingPanelLayoutStyle: {
    width,
    height: height - 10,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commonTextStyle: {
    color: 'white',
    fontSize: 18,
  },
  width_60: {
    width: '60%',
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
  text_small: {
    fontSize: 8,
  },
  text_large: {
    fontSize: 20,
  },
  text_29: {
    fontSize: 29,
  },
  text_18: {
    fontSize: 18,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text_white: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
  },
  darkColor: {
    color: AppStyle.backgroundColor,
    fontFamily: AppStyle.mainFont,
  },
  align_center: {alignItems: 'center'},
  arrow_up: {transform: [{rotateX: '120deg'}]},
  textBright: {
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFont,
  },
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
  margin_top_50: {marginTop: 50},
  margin_top_15: {marginTop: 15},
  funding_wrapper: {
    alignItems: 'center',
    marginTop: 50,
  },
  text_x_large: {
    fontSize: 40,
  },
  outline_button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppStyle.mainColor,
  },
});
