import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { AppStyle, Images } from "@common/index";
import { ProgressBar } from "@elements/ProgressBar";
import { SwipeUp } from "@elements/SwipeUp";

export default function LinksScreen(props) {
  const [rerenderSwipe, setRerenderSwipe] = useState(false);
  return (
    <View style={styles.container}>
      <View style={[styles.margin_30, styles.flex1]}>
        <View style={[styles.fuding_wrapper]}>
          <Text style={[styles.textBright, styles.text_normal]}>
            INVOICE AMOUNT
          </Text>
          <Text style={[styles.text_white, styles.teswipe_stylesxt_x_large]}>
            0.05 BTC
          </Text>
          <Text style={[styles.textBright, styles.text_normal]}>
            EXPIRES IN{' '}
            <Text style={[styles.text_white, styles.text_large]}>24 hours</Text>
          </Text>
        </View>

        <View style={[styles.margin_15, styles.margin_top_50]}>
          <View style={[styles.flex1, styles.justify_center]}>
            <ProgressBar loaded={0} />
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
        {rerenderSwipe === true && (
          <SwipeUp
            onShowFull={() => {
              props.navigation.navigate("Settings");
              setRerenderSwipe(false);
            }}
          />
        )}
        {rerenderSwipe === false && (
          <SwipeUp
            onShowFull={() => {
              props.navigation.navigate("Settings");
              setRerenderSwipe(true);
            }}
          />
        )}
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
  send_button: {
    backgroundColor: AppStyle.mainColor,
    padding: 30,
    borderRadius: 10,
    marginTop: 80,
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  space_between: {
    flexDirection: "row",
    justifyContent: "space-between"
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
  margin_top_15: { marginTop: 15 },
  fuding_wrapper: {
    alignItems: "center",
    marginTop: 50
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
