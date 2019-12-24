import React, {Component} from 'react';

import {View, TouchableOpacity, Image} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as Animatable from 'react-native-animatable';
import {AppStyle, Images, C} from '@common/index';
import {RNCamera} from 'react-native-camera';

class SifirQrCodeCamera extends Component {
  onSuccess(e) {
    this.props.closeHandler(e.data);
  }

  state = {
    isFlashOn: false,
  };
  makeSlideOutTranslation(translationType, fromValue) {
    return {
      from: {
        [translationType]: C.SCREEN_WIDTH * -0.18,
      },
      to: {
        [translationType]: fromValue,
      },
    };
  }

  render() {
    return (
      <QRCodeScanner
        showMarker
        onRead={this.onSuccess.bind(this)}
        cameraStyle={{height: C.SCREEN_HEIGHT}}
        flashMode={
          this.state.isFlashOn
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        customMarker={
          <View style={styles.rectangleContainer}>
            <View style={styles.topOverlay}>
              <View style={styles.titleContainer}>
                <TouchableOpacity
                  onPress={() => this.props.closeHandler(null)}
                  style={styles.buttonBg}>
                  <Image
                    source={Images.icon_back_trans}
                    style={styles.actionBtn}
                  />
                </TouchableOpacity>
                <View style={{flex: 1}} />
                <TouchableOpacity
                  onPress={() => {
                    // Toast.show('Choose photo form library');
                  }}
                  style={styles.buttonBg}>
                  <Image
                    source={Images.icon_gallery}
                    style={styles.actionBtn}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({isFlashOn: !this.state.isFlashOn});
                  }}
                  style={[styles.buttonBg, {marginLeft: 16}]}>
                  <Image source={Images.icon_torch} style={styles.actionBtn} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View style={styles.leftAndRightOverlay} />

              <View style={styles.rectangle}>
                <Animatable.View
                  style={styles.scanBar}
                  direction="alternate-reverse"
                  iterationCount="infinite"
                  duration={1700}
                  easing="linear"
                  animation={this.makeSlideOutTranslation(
                    'translateY',
                    C.SCREEN_WIDTH * 0.2,
                  )}
                />
              </View>
              <View style={styles.leftAndRightOverlay} />
            </View>

            <View style={styles.bottomOverlay} />
          </View>
        }
      />
    );
  }
}

const styles = {
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: C.RECT_DIMENSIONS,
    width: C.RECT_DIMENSIONS,
    borderWidth: C.RECT_BORDER_WIDTH,
    borderColor: AppStyle.mainColor,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  topOverlay: {
    flex: 1.4,
    height: C.SCREEN_WIDTH,
    width: C.SCREEN_WIDTH,
    backgroundColor: C.OVERLAY_COLOR,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },

  bottomOverlay: {
    flex: 1,
    height: C.SCREEN_WIDTH,
    width: C.SCREEN_WIDTH,
    backgroundColor: C.OVERLAY_COLOR,
    paddingBottom: C.SCREEN_WIDTH * 0.25,
  },

  leftAndRightOverlay: {
    height: C.SCREEN_WIDTH * 0.65,
    width: C.SCREEN_WIDTH,
    backgroundColor: C.OVERLAY_COLOR,
  },

  scanBar: {
    width: C.SCAN_BAR_WIDTH,
    height: C.SCAN_BAR_HEIGHT,
    backgroundColor: C.SCAN_BAR_COLOR,
  },

  buttonBg: {
    backgroundColor: 'transparent',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
};

export default SifirQrCodeCamera;
