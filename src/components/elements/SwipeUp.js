import React from "react";
import SwipeUpDown from "react-native-swipe-up-down/src";
import { View, Text, StyleSheet } from "react-native";
import { AppStyle } from "@common/index";

const SwipeUp = props => {
    const { onShowFull, onShowMini } = props;
    return (
        <SwipeUpDown
            itemMini={
                <View style={styles.relative}>
                    <View style={styles.up_triangle} />
                    <Text
                        style={[
                            styles.text_large,
                            styles.textBrightLight,
                            styles.text_center
                        ]}
                    >
                        OPEN CHANNEL
                    </Text>
                </View>
            }
            itemFull={<View style={styles.item_full} />}
            onShowFull={onShowFull}
            onShowMini={onShowMini}
            disablePressToShow={false}
            style={styles.swipe_styles}
            animation="easeInEaseOut"
        />
    );
};

const styles = StyleSheet.create({
    relative: {
        position: "relative"
    },
    item_full: { backgroundColor: "#ffa500", flex: 1 },
    swipe_styles: { backgroundColor: "#ffa500", borderRadius: 0 },
    up_triangle: {
        position: "absolute",
        top: -40,
        left: "45%",
        borderLeftWidth: 15,
        borderStyle: "solid",
        borderLeftColor: "transparent",
        borderBottomColor: "#ffa500"
    },
    text_center: {
        textAlign: "center"
    },
    text_large: {
        fontSize: 20
    },
    textBrightLight: {
        color: "rgb(30, 73, 95)",
        fontFamily: AppStyle.mainFont
    }
});

export { SwipeUp };