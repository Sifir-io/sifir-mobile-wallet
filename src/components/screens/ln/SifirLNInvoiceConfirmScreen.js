import React, {useState, createRef, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import {AppStyle, Images} from '@common/index';
import {SifirChannelProgress} from '@elements/SifirChannelProgress';
import SlidingPanel from 'react-native-sliding-up-down-panels';

// FIXME this comes from styles vh not window
const {width, height} = Dimensions.get('window');
export default function SifirLNInvoiceConfirmScreen(props) {
  const childRef = useRef();
  // FIXME get invoice details from route.params;

  return (
    <View style={styles.container}>
      <View style={[styles.margin_30, styles.flex1]}>
        <View style={[styles.funding_wrapper]}>
          <Text style={[styles.textBright, styles.text_11, styles.text_bold]}>
            INVOICE AMOUNT
          </Text>
          <View style={[styles.textRow]}>
            <Text style={[styles.text_white, styles.text_x_large]}>0.05</Text>
            <Text style={[styles.text_29, styles.text_white]}> BTC</Text>
          </View>
          <Text style={[styles.textBright, styles.text_14, styles.text_bold]}>
            EXPIRES IN{'    '}
            <Text style={[styles.text_white, styles.text_18]}>24 hours</Text>
          </Text>
        </View>
        <View style={[styles.margin_15, styles.margin_top_50]}>
          <View style={[styles.flex1, styles.justify_center]}>
            <SifirChannelProgress loaded={50} />
          </View>
        </View>
        <View style={styles.justify_center}>
          <TouchableOpacity style={styles.send_button}>
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
            props.navigation.navigate('Settings');
          }}
          onDragStop={() => {
            childRef.current && childRef.current.onRequestClose();
            props.navigation.navigate('Settings');
          }}
          headerLayout={() => (
            <View style={styles.headerLayoutStyle}>
              <View style={styles.up_triangle} />
              <Text
                style={[
                  styles.commonTextStyle,
                  styles.textBrightLight,
                  styles.text_large,
                ]}>
                OPEN CHANNEL
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
}

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
  up_triangle: {
    position: 'absolute',
    top: -15,
    left: '45%',
    borderLeftWidth: 15,
    borderLeftColor: 'transparent',
    borderRightWidth: 15,
    borderRightColor: 'transparent',
    borderBottomWidth: 15,
    borderStyle: 'solid',
    borderBottomColor: '#ffa500',
  },
  send_button: {
    backgroundColor: AppStyle.mainColor,
    padding: 30,
    borderRadius: 10,
    marginTop: 80,
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
  headerLayoutStyle: {
    width,
    height: 80,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
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
  textBrightLight: {
    color: 'rgb(30, 73, 95)',
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
    fontSize: 60,
  },
  outline_button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppStyle.mainColor,
  },
});
