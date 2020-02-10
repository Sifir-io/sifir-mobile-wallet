import React from "react";
import { View, StyleSheet } from "react-native";
import { AppStyle } from "@common/index";

export const ProgressBar = props => {
  let { loaded } = props;
  let completed = loaded;
  let remaining = 100 - loaded;
  let startDotColor = loaded === 0 ? "rgb(30, 73, 95)" : AppStyle.mainColor;
  let firstViewColor = AppStyle.mainColor;
  let endDotColor = loaded === 100 ? AppStyle.mainColor : "rgb(30, 73, 95)";
  let secondViewColor = "rgb(30, 73, 95)";

  const styles = StyleSheet.create({
    progress_wrapper: {
      flexDirection: "row",
      flex: 0.7,
      position: "relative",
      alignItems: "center"
    },
    completed: {
      width: `${completed}%`,
      borderWidth: 1,
      borderStyle: loaded === 100 ? "solid" : "dashed",
      borderColor: firstViewColor
    },
    remaining: {
      width: `${remaining}%`,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: secondViewColor
    },
    startDot: {
      position: "absolute",
      left: 0,
      backgroundColor: startDotColor,
      width: 20,
      height: 20,
      borderRadius: 10
    },
    endDot: {
      position: "absolute",
      right: 0,
      backgroundColor: endDotColor,
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center"
    },
    endDotInner: {
      width: 15,
      height: 15,
      borderRadius: 8,
      backgroundColor: AppStyle.backgroundColor
    }
  });

  return (
    <View style={styles.progress_wrapper}>
      <View style={styles.completed}></View>
      <View style={styles.remaining}></View>
      <View style={styles.startDot}></View>
      <View style={styles.endDot}>
        {loaded !== 100 && loaded !== 0 && (
          <View style={styles.endDotInner}></View>
        )}
      </View>
    </View>
  );
};