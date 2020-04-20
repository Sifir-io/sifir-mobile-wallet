import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from 'react-native';
import {AppStyle, Images, C} from '@common/index';
import {SifirChannelProgress} from '@elements/SifirChannelProgress';
import SlidingPanel from 'react-native-sliding-up-down-panels';
import {getRoute, getPeers, payBolt} from '@actions/lnWallet';
import {ErrorScreen} from '@screens/error';
import {connect} from 'react-redux';
import moment from 'moment';
import SifirBTCAmount from '@elements/SifirBTCAmount';
import {ActivityIndicator} from 'react-native';

const SifirLNInvoiceConfirmScreen = props => {
  const [routes, setRoutes] = useState([]);
  const [peers, setPeers] = useState([]);
  const [routeFound, setRouteFound] = useState({});
  const [progress, setProgress] = useState(10);
  const [routeLabel, setRouteLabel] = useState(null);
  const [routeFees, setRouteFees] = useState(0);
  const childRef = useRef();
  const {loading, loaded, error: LnError, isPayingBolt} = props.lnWallet;
  const {walletInfo, bolt11} = props.route.params;
  useEffect(() => {
    (async () => {
      const {invoice} = props.route.params;
      console.log('processing invoice', invoice);
      const [routes, peers] = await Promise.all([
        props.getRoute(invoice.payee, invoice.msatoshi),
        props.getPeers(),
      ]);
      setRoutes(routes);
      setPeers(peers);
      if (peers?.length && routes?.length) {
        const foundRoute = peers.find(peer => peer.id === routes[0]?.id);
        setRouteFound(foundRoute);
        setRouteLabel(
          `${routes.length} ${C.STR_Hops_to_route}, ${C.STR_Fees}:  `,
        );
        // Generate total fees paid along route by subtracting msatoshi at index=0 from msatoshi of last entry in routes.
        setRouteFees(routes[0].msatoshi - routes[routes.length - 1].msatoshi);
      }
    })();
  }, [props.route.params.invoice]);

  const handleSendButton = async () => {
    const txnInfo = await props.payBolt(bolt11);
    if (txnInfo.status === 'complete') {
      props.navigation.navigate('LnInvoicePaymentConfirmed', {
        walletInfo,
        isSendTxn: true,
        txnInfo: {
          amount: txnInfo.msatoshi,
          address: txnInfo.payment_preimage,
          unit: C.STR_MSAT,
        },
      });
    }
  };

  const handleOpenChannelDrag = () => {
    childRef.current?.onRequestClose();
    props.navigation.navigate('LNChannelRoute', {
      screen: 'LnNodeSelect',
      params: {
        walletInfo,
        nodeInputRequired: isRouteFound ? false : true,
        routes,
      },
    });
  };

  useEffect(() => {
    // TODO replace it with Animated API.
    let progressBar;
    if (loading) {
      progressBar = setTimeout(() => {
        setProgress((progress % 100) + 2);
      }, 100);
    } else {
      clearTimeout(progressBar);
    }
  }, [loading, progress]);

  // TODO move to util
  const formatExpiryDate = expiry =>
    moment(Date.now() + expiry * 1000)
      .fromNow()
      .substr(3);

  if (LnError) {
    return (
      <ErrorScreen
        title={C.STR_ERROR_transaction}
        desc={C.STR_ERROR_btc_txn_error}
        error={LnError}
        actions={[
          {
            text: C.STR_GO_BACK,
            onPress: () => props.navigation.navigate('Account', {walletInfo}),
          },
        ]}
      />
    );
  }

  const isRouteFound = routeFound?.id ? true : false;
  const {amount_msat, description, expiry} = props.route.params.invoice;
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.sv}
        contentContainerStyle={styles.contentContainer}>
        <View style={[styles.margin_30, styles.flex1]}>
          <View style={[styles.funding_wrapper]}>
            <Text style={[styles.textBright, styles.text_11, styles.text_bold]}>
              {C.STR_INVOICE_AMOUNT}
            </Text>
            <View style={[styles.textRow]}>
              <Text style={[styles.text_white, styles.text_x_large]}>
                {amount_msat}
              </Text>
            </View>
            <Text style={[styles.text_white, styles.text_18]}>
              {description}
            </Text>
            <Text style={[styles.textBright, styles.text_14, styles.text_bold]}>
              {`${C.STR_EXPIRES_IN} `}
              <Text style={[styles.text_white, styles.text_18]}>
                {formatExpiryDate(expiry)} {C.STR_from_now}
              </Text>
            </Text>
          </View>
          <View style={[styles.margin_15, styles.margin_top_50]}>
            <View style={[styles.flex1, styles.justify_center]}>
              <SifirChannelProgress
                routes={routes}
                isRouteFound={isRouteFound}
                loaded={loading ? progress : loaded ? 100 : 0}
                loading={loading}
              />
            </View>
          </View>
          {isPayingBolt && <ActivityIndicator size="large" />}
          <View style={styles.justify_center}>
            <TouchableOpacity
              disabled={!loaded || loading || !isRouteFound}
              style={
                isRouteFound ? styles.send_button : styles.send_button_disabled
              }
              onLongPress={() => handleSendButton()}>
              <Text
                style={[
                  styles.sendLabel,
                  {
                    color: isRouteFound ? AppStyle.backgroundColor : '#21827D',
                    opacity: isRouteFound ? 1 : 0.7,
                  },
                ]}>
                {C.STR_SEND}
              </Text>
              <Image
                source={
                  isRouteFound ? Images.icon_up_dark : Images.icon_up_blue
                }
                style={[
                  styles.send_icon,
                  {
                    opacity: isRouteFound ? 1 : 0.5,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {loaded && !isPayingBolt && peers?.length > 0 && (
        <View style={styles.justify_end}>
          <SlidingPanel
            ref={childRef}
            headerLayoutHeight={80}
            AnimationSpeed={100}
            onAnimationStop={() => handleOpenChannelDrag()}
            onDragStop={() => handleOpenChannelDrag()}
            headerLayout={() => (
              <View style={isRouteFound ? styles.transparent : styles.orange}>
                <View
                  style={
                    isRouteFound
                      ? styles.activeTriangle
                      : styles.inactiveTriangle
                  }
                />
                <Text
                  style={[
                    styles.commonTextStyle,
                    isRouteFound ? styles.orangeColor : styles.darkColor,
                    styles.text_large,
                  ]}>
                  {!isRouteFound ? C.STR_OPEN_CHANNEL : routeLabel}
                  {isRouteFound && (
                    <SifirBTCAmount amount={routeFees} unit={C.STR_MSAT} />
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
    padding: 30,
    borderRadius: 10,
    marginTop: 52,
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#21827D',
  },
  space_between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orange: {
    width: C.SCREEN_WIDTH,
    height: 80,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transparent: {
    width: C.SCREEN_WIDTH,
    height: 80,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeColor: {
    color: 'orange',
  },
  slidingPanelLayoutStyle: {
    width: C.SCREEN_WIDTH,
    height: C.SCREEN_HEIGHT - 10,
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
  text_primary: {
    color: AppStyle.backgroundColor,
  },
  sendLabel: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: AppStyle.mainFont,
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
  sv: {
    marginBottom: 60,
  },
  contentContainer: {
    paddingBottom: 30,
  },
});
