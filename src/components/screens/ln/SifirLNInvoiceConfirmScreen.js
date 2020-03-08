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
import {AppStyle, Images} from '@common/index';
import {SifirChannelProgress} from '@elements/SifirChannelProgress';
import SlidingPanel from 'react-native-sliding-up-down-panels';
import {getRoute, getPeers} from '@actions/lnWallet';
import {connect} from 'react-redux';
// FIXME this comes from styles vh not window
const {width, height} = Dimensions.get('window');
const SifirLNInvoiceConfirmScreen = props => {
  const [routes, setRoutes] = useState([]);
  const [peers, setPeers] = useState([]);
  const [progress, setProgress] = useState(10);
  useEffect(() => {
    (async () => {
      const {invoice} = props.route.params;
      const allroutes = await props.getRoute(invoice.payee, invoice.msatoshi);
      setRoutes(allroutes);
      const allPeers = await props.getPeers(allroutes[0].id);
      setPeers(allPeers);
    })();
  }, []);

  const handleSendButton = () => {
    const {bolt11, walletInfo} = props.route.params;
    props.navigation.navigate('LnInvoicePaymentConfirmed', {
      bolt11,
      walletInfo,
    });
  };

  useEffect(() => {
    const {loading} = props.lnWallet;
    // TODO replace it with Animated API.
    if (loading) {
      setTimeout(() => {
        progress === 100 ? setProgress(10) : setProgress(progress + 1);
      }, 100);
    }
  }, [props.lnWallet, progress]);

  const childRef = useRef();
  const {amount_msat, description, expiry} = props.route.params.invoice;
  const {loading, loaded} = props.lnWallet;
  const isLoaded = loaded && routes.length === 0;
  let openChannelLabel;
  if (peers.length) {
    const channel = peers[0].channels[0];
    openChannelLabel = `${channel.channel_id.slice(
      0,
      4,
    )}-${channel.channel_id.slice(-4)} - ${channel.spendable_msatoshi}`;
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
            <Text style={[styles.text_29, styles.text_white]}> BTC</Text>
          </View>
          <Text style={[styles.text_white, styles.text_18]}>{description}</Text>
          <Text style={[styles.textBright, styles.text_14, styles.text_bold]}>
            EXPIRES IN{'  '}
            <Text style={[styles.text_white, styles.text_18]}>{expiry}</Text>
          </Text>
        </View>
        <View style={[styles.margin_15, styles.margin_top_50]}>
          <View style={[styles.flex1, styles.justify_center]}>
            <SifirChannelProgress
              isGoldenColor={routes.length ? true : false}
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
      <View style={styles.justify_end}>
        <SlidingPanel
          ref={childRef}
          headerLayoutHeight={80}
          AnimationSpeed={50}
          onAnimationStop={() => {
            childRef.current && childRef.current.onRequestClose();
            props.navigation.navigate('LNChannelRoute');
          }}
          onDragStop={() => {
            childRef.current && childRef.current.onRequestClose();
            props.navigation.navigate('LNChannelRoute');
          }}
          headerLayout={() => (
            <View style={isLoaded ? styles.orange : styles.transparent}>
              {!loading && (
                <View
                  style={
                    isLoaded ? styles.inactiveTriangle : styles.activeTriangle
                  }
                />
              )}
              <Text
                style={[
                  styles.commonTextStyle,
                  isLoaded ? styles.darkColor : styles.orangeColor,
                  styles.text_large,
                ]}>
                {isLoaded ? 'OPEN CHANNEL' : openChannelLabel}
              </Text>
            </View>
          )}
          slidingPanelLayout={() => (
            <View style={styles.slidingPanelLayoutStyle} />
          )}
        />
      </View>
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
    top: -10,
    left: '45%',
    borderLeftWidth: 15,
    borderLeftColor: 'transparent',
    borderRightWidth: 15,
    borderRightColor: 'transparent',
    borderBottomWidth: 15,
    borderStyle: 'solid',
    borderBottomColor: 'orange',
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
