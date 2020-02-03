import React, {Component} from 'react';
import {PGP_KEYS_UNLOCK_FAILED} from '@utils/constants';
import {connect} from 'react-redux';
import {event, log, error} from '@io/events/';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import {
  pairPhoneWithToken,
  genAndSaveDevicePgpKeys,
  initAndUnlockDeviceKeys,
  setAuthInfoState,
  loadDevicePgpKeys,
  storeEncryptedAuthInfo,
  deleteDevicePgpKeys,
} from '@actions/auth';
import {decryptMessage} from '@io/pgp';
class UnlockORGenKeys extends Component {
  constructor(props, context) {
    super(props, context);
  }

  state = {
    scannedToken: this.props.navigation.getParam('scannedToken'),
    encAuthInfo: this.props.navigation.getParam('encAuthInfo') || null,
    passphrase: '',
    retryablePairingError: '',
  };

  async componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    await this.props.loadDevicePgpKeys();
  };

  passphraseUpdated(pass) {
    this.setState({passphrase: pass});
  }
  async passwordEntered() {
    try {
      if (!this.state.passphrase.length || this.state.passphrase.length < 6) {
        throw 'Enter password first';
      }
      let {pubkeyArmored, privkeyArmored} = this.props.auth.devicePgpKey;
      const {scannedToken, passphrase, encAuthInfo} = this.state;
      // paired state, decrypt data and go to app
      if (pubkeyArmored && privkeyArmored && encAuthInfo) {
        const unlockedKeys = await this.props.initAndUnlockDeviceKeys({
          privkeyArmored,
          passphrase,
        });
        if (!unlockedKeys) {
          throw PGP_KEYS_UNLOCK_FAILED;
        }
        const decryptedAuthInfo = await decryptMessage(encAuthInfo);
        const {token, key, nodePubkey} = JSON.parse(decryptedAuthInfo);
        if (!token || !key || !nodePubkey) {
          throw 'Pairing info is invalid or corrupted, please delete and repair';
        }
        await this.props.setAuthInfoState({token, key, nodePubkey});
        event('app.unlocked');
        this.props.navigation.navigate('App');
        return;
        // Just scannedToken
      } else if (scannedToken) {
        const {token, key} = scannedToken;
        const {deviceId} = token;
        if (!pubkeyArmored || !privkeyArmored) {
          const generatedKeys = await this.props.genAndSaveDevicePgpKeys({
            user: deviceId,
            email: `${deviceId}@sifir.io`,
            passphrase,
          });
          if (!generatedKeys) {
            throw 'Failed to generate keys for device, please retry';
          }
          ({privkeyArmored, pubkeyArmored} = generatedKeys);
          log('Device:Generated new keys', pubkeyArmored);
        } else {
          log('Device:keys already exists', pubkeyArmored);
        }
        const unlockedKeys = await this.props.initAndUnlockDeviceKeys({
          privkeyArmored,
          passphrase,
        });
        if (!unlockedKeys) {
          throw PGP_KEYS_UNLOCK_FAILED;
        }
        log('keys unlocked!');
        const pairingResult = await this.props.pairPhoneWithToken({token, key});
        if (!pairingResult) throw 'Error pairing with token';
        const {nodePubkey} = pairingResult;
        event('app.paired', {type: token.eventType});
        await this.props.storeEncryptedAuthInfo({token, key, nodePubkey});
        await this.props.setAuthInfoState({token, key, nodePubkey});
        log('pairing info stored, ready to app');
        this.props.navigation.navigate('App');
        return;
      } else {
        //not paired on auth info , send back to Landing
        error('unlockOrGenkeys.invalid.state');
        log('invalid state', this.props.auth);
        this.props.navigation.navigate('AppLandingScreen');
      }
    } catch (err) {
      switch (err) {
        case PGP_KEYS_UNLOCK_FAILED:
          this.setState({
            retryablePairingError: 'Error unlocking your keys, wrong password',
          });
          break;
        default:
          error('unlockOrGenkeys.pairingError', err);
          log('A non retryable error occured while pairing', err);
          //
          // something more serious so bug out
          break;
      }
      // problem unlocking key
    }
  }

  render() {
    const {
      passphrase,
      scannedToken,
      retryablePairingError,
      encAuthInfo,
    } = this.state;
    const {devicePgpKey, pairing, paired} = this.props.auth;
    const {pubkeyArmored} = devicePgpKey;
    let view;
    if (pairing) {
      view = (
        <View style={styles.mainContent}>
          <Text style={styles.commentTxt}>{'Pairing in progress'}</Text>
          <ActivityIndicator size="large" style={styles.progress} />
        </View>
      );
      return view;
    }
    if (paired) {
      view = (
        <>
          <View style={styles.mainContent}>
            <Text style={styles.commentTxt}>{'Paired sucess!!'}</Text>
            <ActivityIndicator size="large" style={styles.progress} />
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigator.navigate('App')}
            style={styles.doneTouch}>
            <View shadowColor="black" shadowOffset="30" style={styles.doneView}>
              <Text style={styles.doneTxt}>{C.STR_CONTINUE}</Text>
            </View>
          </TouchableOpacity>
        </>
      );
      return view;
    }
    // FIXME these shit views
    if (retryablePairingError) {
      view = (
        <View style={styles.mainContent}>
          <TouchableOpacity
            onPress={() => this.props.navigator.navigate('AppLandingScreen')}
            style={styles.doneTouch}>
            <Image source={Images.icon_failure} style={styles.checkImg} />
          </TouchableOpacity>
          <Text style={styles.resultTxt}>{C.STR_FAILED}</Text>
          <Text style={styles.resultTxt}>{retryablePairingError}</Text>
        </View>
      );
      return view;
    }
    const [welcomeText, ctaText, mainText] =
      pubkeyArmored && encAuthInfo
        ? [
            C.STR_WELCOME_BACK,
            C.STR_ENTER_PASS_TO_UNLOCK_WALLET,
            `Lorem ipsum dolor sit amet, te mei appetere pertinacia, idque mucius
          pri et. No nulla periculis persecuti mei, at pro iusto repudiare, cum
          at alia discere disputationi. Dicant mollis eum eu, facilisi convenire
          urbanitas ne vis`,
          ]
        : [
            C.STR_WELCOME_NEW,
            C.STR_ENTER_WORD,
            scannedToken
              ? `Will be pairiing ${scannedToken.token.eventType.toUpperCase()}`
              : '',
          ];
    view = (
      <>
        <Text style={styles.resultTxt}>{welcomeText}</Text>
        <Text style={styles.descriptionTxt}>{mainText}</Text>
        <View style={styles.inputView}>
          <TextInput
            placeholderTextColor="white"
            placeholder={ctaText}
            style={[styles.inputTxtStyle]}
            value={passphrase}
            onChangeText={pass => this.passphraseUpdated(pass)}
          />
        </View>
        <TouchableOpacity
          onPress={() => this.passwordEntered()}
          style={styles.doneTouch}>
          <View shadowColor="black" shadowOffset="30" style={styles.doneView}>
            <Text style={styles.doneTxt}>{C.STR_CONTINUE}</Text>
          </View>
        </TouchableOpacity>
      </>
    );
    return (
      <View style={styles.mainView}>
        <View style={styles.mainContent}>{view}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  doneTouch: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  descriptionTxt: {
    color: AppStyle.mainColor,
    fontSize: 12,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    fontFamily: AppStyle.mainFontBold,
  },
  resultTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 8 * C.vh,
    marginTop: 0,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
    width: C.SCREEN_WIDTH * 0.8,
    marginLeft: C.SCREEN_WIDTH * 0.1,
    height: 70,
    borderRadius: 10,
    borderColor: AppStyle.mainColor,
    borderWidth: 2,
  },
  mainView: {
    flex: 1,
    height: '100%',
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
  },
  doneView: {
    width: C.SCREEN_WIDTH * 0.5,
    flexDirection: 'row',
    height: 9.5 * C.vh,
    backgroundColor: '#53cbc8',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
  inputTxtStyle: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    textAlign: 'left',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  mainContent: {alignItems: 'center', flex: 3, marginTop: 12 * C.vh},
  doneTxt: {
    color: AppStyle.backgroundColor,
    fontWeight: 'bold',
    fontSize: 26,
    marginRight: 15,
  },
  checkImg: {width: 8 * C.vh, height: 8 * C.vh, marginTop: 2 * C.vh},
  progressView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = {
  pairPhoneWithToken,
  genAndSaveDevicePgpKeys,
  initAndUnlockDeviceKeys,
  setAuthInfoState,
  storeEncryptedAuthInfo,
  loadDevicePgpKeys,
  deleteDevicePgpKeys,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnlockORGenKeys);
