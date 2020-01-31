import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
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
  savedEncryptedAuthInfo,
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
    await this.props.deleteDevicePgpKeys();
    try {
      if (!this.state.passphrase.length || this.state.passphrase.length < 6) {
        throw 'Enter password first';
      }
      console.log('here', this.props.auth, this.state);
      let {pubkeyArmored, privkeyArmored} = this.props.auth.devicePgpKey;
      const {scannedToken, passphrase, encAuthInfo} = this.state;
      // paired state, decrypt data and go to app
      if (pubkeyArmored && privkeyArmored && encAuthInfo) {
        await initAndUnlockDeviceKeys({privkeyArmored, passphrase});
        const decryptedAuthInfo = await decryptMessage(encAuthInfo);
        const {token, key} = JSON.parse(decryptedAuthInfo);
        await this.props.setAuthInfoState({token, key});
        this.props.navigation.navigate('App');
        return;
        // Just scannedToken
      } else if (scannedToken) {
        const {token, key} = scannedToken;
        const {deviceId} = token;
        if (!pubkeyArmored || !privkeyArmored) {
          ({
            privkeyArmored,
            pubkeyArmored,
          } = await this.props.genAndSaveDevicePgpKeys({
            user: deviceId,
            email: `${deviceId}@sifir.io`,
            passphrase,
          }));
          console.log('GENERATED KEYSS', privkeyArmored, pubkeyArmored);
        } else {
          console.log('KEYSS DETECTED', privkeyArmored, pubkeyArmored);
        }
        await this.props.initAndUnlockDeviceKeys({
          privkeyArmored,
          passphrase,
        });
        const isPaired = await this.props.pairPhoneWithToken({token, key});
        if (isPaired !== true) throw 'Error pairing';
        await this.savedEncryptedAuthInfo({token, key});
        await this.setAuthInfoState({token, key});
        this.props.navigation.navigate('App');
        return;
      } else {
        //not paired on auth info , send back to Landing
        console.log('something funny', this.props.auth);
        this.props.navigation.navigate('AppLandingScreen');
      }
    } catch (err) {
      console.log('eee', err);
      // problem unlocking key
    }
  }

  render() {
    const {passphrase, scannedToken} = this.state;
    const {
      devicePgpKey: {pubkeyArmored, privkeyArmored} = {},
      pairing,
      paired,
      error,
    } = this.props.auth;
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
        <View style={styles.mainContent}>
          <Text style={styles.commentTxt}>{'Paired sucess!!'}</Text>
          <ActivityIndicator size="large" style={styles.progress} />
        </View>
      );
      return view;
    }
    if (error) {
      view = (
        <View style={styles.mainContent}>
          <Image source={Images.icon_failure} style={styles.checkImg} />
          <Text style={styles.resultTxt}>{C.STR_FAILED}</Text>
          <Text style={styles.resultTxt}>{error}</Text>
        </View>
      );
      return view;
    }
    const [welcomeText, ctaText, mainText] =
      pubkeyArmored && privkeyArmored
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
            `Will be pairiing ${scannedToken.token.eventType.toUpperCase()}`,
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
  savedEncryptedAuthInfo,
  loadDevicePgpKeys,
  deleteDevicePgpKeys,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnlockORGenKeys);
