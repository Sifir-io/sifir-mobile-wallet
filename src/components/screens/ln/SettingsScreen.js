import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Platform
} from "react-native";
import { AppStyle, Images } from "@common/index";
import Table from "@elements/Table";

export default function SettingsScreen() {
  const [selected, setSelected] = useState(undefined);
  return (
    <View style={styles.container}>
      <View style={[styles.margin_wrapper, styles.flex1]}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter Node URL"
            placeholderTextColor="white"
            style={[styles.input]}
            selectionColor="white"
          />
          <View style={[styles.justifyCenter]}>
            <Image source={Images.img_camera_blue} style={styles.camera_icon} />
            <Image source={Images.icon_setting} style={styles.burger_icon} />
          </View>
        </View>
        <Text
          style={[
            styles.text_18,
            styles.text_white,
            styles.text_bold,
            styles.margin_top_25,
            styles.mb_15
          ]}
        >
          Browse Nodes
        </Text>
        <Table selected={selected} onSelect={setSelected} />

        <TouchableOpacity
          disabled={selected ? !selected.id : true}
          // Adding inline style as condition is needed to be evaluated
          style={{
            backgroundColor: selected && selected.id ? "#ffa500" : "lightgrey",
            paddingVertical: 16,
            paddingHorizontal: 81,
            borderRadius: 10,
            marginTop: 28
          }}
        >
          <Text
            style={[styles.text_large, styles.text_center, styles.text_bold]}
          >
            CONTINUE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

SettingsScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },
  text_18: {
    fontSize: 18
  },
  inputWrapper: {
    flexDirection: "row",
    borderColor: AppStyle.mainColor,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    height: 52
  },
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor
  },
  camera_icon: { width: 19, height: 16, marginRight: 10 },
  burger_icon: { width: 19, height: 16 },
  justifyCenter: { flexDirection: "row", flex: 1, justifyContent: "flex-end" },
  space_between: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  mb_15: { marginBottom: 15 },
  input: {
    width: "70%",
    color: "white",
    height: Platform.OS === "android" ? 30 : 25,
    fontSize: 13
  },
  text_bold: {
    fontWeight: "bold"
  },
  text_center: {
    textAlign: "center"
  },
  text_large: {
    fontSize: 17
  },
  text_white: {
    color: "white",
    fontFamily: AppStyle.mainFont
  },
  back: {
    marginRight: 8,
    width: 12,
    height: 12
  },
  margin_wrapper: {
    marginTop: 42,
    marginBottom: 36,
    marginHorizontal: 26
  },
  margin_top_25: { marginTop: 25 }
});