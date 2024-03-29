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
} from 'react-native';
import {validatedTokenHash} from '@helpers/validations';
import SifirQrCodeCamera from '@elements/SifirQrCodeCamera';
import {Images, AppStyle, C} from '@common/index';
// import {ErrorScreen} from '@screens/error';
class ScanToPairScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }

  state = {
    showModal: false,
    qrError: null,
    pairingError: null,
  };
  processQRCode = async qrdata => {
    this.setState({showModal: false});
    const {token, key} = validatedTokenHash(qrdata);
    if (!token || !key) {
      this.setState({qrError: C.STR_INVALID_TOKEN_ERR_MSG});
      return;
    }
    this.props.navigation.navigate('UnlockORGenKeys', {
      scannedToken: {token, key},
    });
  };

  continue = () => {
    throw 'INVALID_SCANTOPAIR_FLOW';
  };
  // TODO refactor this component to use error component rather than mess below
  // Note: UnlockGen component handles errors from pairing, this component should only handle token parsing errors etc..
  //static getDerivedStateFromProps(props, state) {
  //  if (props.error && !state.pairingError) {
  //    return {...state, pairingError: props.error};
  //  } else {
  //    return null;
  //  }
  //}
  render() {
    const {
      auth: {pairing, token, key},
    } = this.props;
    const {qrError} = this.state;
    // TODO refactor this component to use error component rather than mess below
    //if (qrError) {
    //  return (
    //    <ErrorScreen
    //      title={C.STR_FAILED}
    //      desc={qrError}
    //      error={this.state.pairingError}
    //      actions={[
    //        {
    //          text: C.STR_TRY_AGAIN,
    //          onPress: () => this.setState({pairingError: null}),
    //        },
    //      ]}
    //    />
    //  );
    //}
    return (
      <View style={styles.mainView}>
        {pairing && (
          <View style={styles.progressView}>
            <ActivityIndicator size="large" style={styles.progress} />
          </View>
        )}
        {!pairing && (
          <>
            <View style={styles.mainContent}>
              <Image
                source={
                  token
                    ? Images.icon_done
                    : qrError
                    ? Images.icon_failure
                    : Images.icon_header
                }
                style={styles.checkImg}
              />
              <Text style={styles.resultTxt}>
                {token ? C.STR_SUCCESS : qrError ? C.STR_FAILED : C.STR_WELCOME}
              </Text>
              <Text style={styles.descriptionTxt}>
                {token
                  ? C.STR_AUTH_SUCCESS
                  : qrError
                  ? qrError
                  : C.STR_WELCOME_DESC}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.doneTouch}
              onPressOut={() => {
                if (token && key) {
                  this.continue();
                } else {
                  this.setState({showModal: true});
                }
              }}>
              <View
                shadowColor="black"
                shadowOffset="30"
                style={styles.doneView}>
                <Text style={styles.doneTxt}>
                  {token
                    ? C.STR_CONTINUE
                    : qrError
                    ? C.STR_TRY_AGAIN
                    : C.STR_PAIR_NOW}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        <Modal
          visible={this.state.showModal}
          animationType="fade"
          presentationStyle="fullScreen">
          <SifirQrCodeCamera closeHandler={this.processQRCode} />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  mainContent: {alignItems: 'center', flex: 3, marginTop: 12 * C.vh},
  resultTxt: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 10 * C.vh,
    marginTop: 10,
  },
  descriptionTxt: {
    color: AppStyle.mainColor,
    fontSize: 16,
    marginTop: 20,
    fontFamily: AppStyle.mainFontBold,
  },
  doneTouch: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
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

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScanToPairScreen);
