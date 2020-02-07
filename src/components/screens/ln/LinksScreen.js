import React, { useState, createRef, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions
} from "react-native";
import { AppStyle, Images } from "@common/index";
import { ProgressBar } from "@elements/ProgressBar";
import SlidingPanel from "react-native-sliding-up-down-panels";

const { width, height } = Dimensions.get("window");
export default function LinksScreen(props) {
  const childRef = useRef();
  return (
    <View style={styles.container}>
      <View style={[styles.margin_30, styles.flex1]}>
        <View style={[styles.fuding_wrapper]}>
          <Text style={[styles.textBright, styles.text_11, styles.text_bold]}>
            INVOICE AMOUNT
          </Text>
          <View style={[styles.textRow]}>
            <Text style={[styles.text_white, styles.text_x_large]}>0.05</Text>
            <Text style={[styles.text_29, styles.text_white]}> BTC</Text>
          </View>
          <Text style={[styles.textBright, styles.text_14, styles.text_bold]}>
            EXPIRES IN{"    "}
            <Text style={[styles.text_white, styles.text_18]}>24 hours</Text>
          </Text>
        </View>

        <View style={[styles.margin_15, styles.margin_top_45]}>
          <View style={[styles.flex1, styles.justify_center]}>
            <ProgressBar loaded={30} />
          </View>
        </View>
        <View style={styles.justify_center}>
          <TouchableOpacity style={styles.send_button_disabled}>
            <Text
              style={[
                styles.text_large,
                styles.text_center,
                styles.text_bold,
                styles.textBrightLow
              ]}
            >
              SEND
            </Text>
            <Image source={Images.icon_up_blue} style={styles.send_icon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.justify_end}>
        <SlidingPanel
          ref={childRef}
          headerLayoutHeight={100}
          AnimationSpeed={50}
          onAnimationStop={() => {
            childRef.current && childRef.current.onRequestClose();
            props.navigation.navigate("Settings");
          }}
          onDragStop={() => {
            childRef.current && childRef.current.onRequestClose();
            props.navigation.navigate("Settings");
          }}
          headerLayout={() => (
            <View style={styles.headerLayoutStyle}>
              <View style={styles.up_triangle} />
              <Text
                style={[
                  styles.commonTextStyle,
                  styles.textBrightLight,
                  styles.text_18
                ]}
              >
                OPEN CHANNEL
              </Text>
            </View>
          )}
          slidingPanelLayout={() => (
            <View style={styles.slidingPanelLayoutStyle}></View>
          )}
        />
      </View>
    </View>
  );
}

LinksScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor
  },
  justify_center: { flexDirection: "row", justifyContent: "center" },
  justify_end: {
    flex: 1,
    justifyContent: "flex-end"
  },
  send_icon: { width: 15, height: 15, marginLeft: 10 },
  up_triangle: {
    position: "absolute",

    top: -15,
    left: "45%",

    borderLeftWidth: 15,
    borderStyle: "solid",
    borderLeftColor: "transparent",

    borderRightWidth: 15,
    borderStyle: "solid",
    borderRightColor: "transparent",

    borderBottomWidth: 15,
    borderStyle: "solid",
    borderBottomColor: "#f6921e"
  },
  text_normal: {
    fontSize: 12
  },
  text_11: {
    fontSize: 11
  },
  text_29: {
    fontSize: 29
  },
  text_10: {
    fontSize: 10
  },
  text_14: {
    fontSize: 14
  },
  text_18: {
    fontSize: 18
  },
  send_button: {
    backgroundColor: AppStyle.mainColor,
    paddingVertical: 26,
    paddingHorizontal: 85,
    borderRadius: 10,
    marginTop: 52,
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  send_button_disabled: {
    backgroundColor: "transparent",
    paddingVertical: 26,
    paddingHorizontal: 85,
    borderRadius: 10,
    marginTop: 52,
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#53cbc8"
  },
  space_between: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  headerLayoutStyle: {
    width,
    height: 100,
    backgroundColor: "#f6921e",
    justifyContent: "center",
    alignItems: "center"
  },
  slidingPanelLayoutStyle: {
    width,
    height: height - 10,
    backgroundColor: "#f6921e",
    justifyContent: "center",
    alignItems: "center"
  },
  commonTextStyle: {
    color: "white",
    fontSize: 18
  },
  width_60: {
    width: "60%"
  },
  text_bold: {
    fontWeight: "bold"
  },
  text_normal: {
    fontSize: 13
  },
  text_center: {
    textAlign: "center"
  },
  text_small: {
    fontSize: 8
  },
  text_large: {
    fontSize: 20
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  text_white: {
    color: "white",
    fontFamily: AppStyle.mainFont
  },
  textBrightLight: {
    color: "#0c1d28",
    fontFamily: AppStyle.mainFont
  },
  textBrightLow: {
    color: "#53cbc8",
    fontFamily: AppStyle.mainFont
  },
  align_center: { alignItems: "center" },
  arrow_up: { transform: [{ rotateX: "120deg" }] },
  textBright: {
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFont
  },
  back: {
    marginRight: 8,
    width: 12,
    height: 12
  },
  margin_30: {
    margin: 30
  },
  margin_15: {
    margin: 15
  },
  margin_top_30: { marginTop: 30 },
  margin_top_50: { marginTop: 50 },
  margin_top_45: { marginTop: 45 },
  margin_top_15: { marginTop: 15 },
  fuding_wrapper: {
    alignItems: "center",
    marginTop: 47
  },
  text_x_large: {
    fontSize: 60
  },
  outline_button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppStyle.mainColor
  }
});
