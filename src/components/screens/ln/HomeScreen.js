import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import {Slider} from 'react-native-elements';
const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.margin_26}>
        <View style={styles.textRow}>
          <Image source={Images.icon_indicator} style={styles.back} />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Links');
            }}>
            <Text style={[styles.text_white, styles.text_normal, styles.text_bold]}>
              Open Channel{' '}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.fuding_wrapper]}>
          <Text style={[styles.textBright, styles.text_11, styles.text_bold]}>
            FUDING AMOUNT
          </Text>
          <View style={[styles.textRow]}>
            <Text style={[styles.text_white, styles.text_x_large]}>0.05</Text>
            <Text style={[styles.text_29, styles.text_white]}> BTC</Text>
          </View>
        </View>

        <View style={[styles.margin_15, styles.margin_top_33]}>
          <Text style={[styles.textBright, styles.text_10]}>Alias</Text>
          <Text style={[styles.text_white, styles.text_14]}>EMEA#1</Text>

          <Text
            style={[styles.textBright, styles.margin_top_10, styles.text_10]}
          >
            Node Address
          </Text>
          <Text style={[styles.text_white, styles.text_14]}>ema.node.co</Text>

          <Text
            style={[styles.textBright, styles.margin_top_10, styles.text_10]}
          >
            Port
          </Text>
          <Text style={[styles.text_white, styles.text_14]}>124</Text>

          <Text
            style={[styles.textBright, styles.margin_top_15, styles.text_10]}
          >
            Fees
          </Text>
          <View style={styles.space_between}>
            <View style={styles.outline_button}>
              <Text style={[styles.text_white, styles.text_normal]}>
                0.015 BTC
              </Text>
            </View>
            <View style={styles.slider_wrapper}>
              <Slider
                value={30}
                onValueChange={value => {}}
                style={styles.width_60}
                thumbTintColor="white"
                maximumTrackTintColor="rgb(45, 171, 226)"
                minimumTrackTintColor="rgb(45, 171, 226)"
              />
              <View style={styles.row}>
                <Text style={[styles.textBright, styles.text_10]}>
                  Approximate wait
                </Text>
                <Text
                  style={[
                    styles.text_white,
                    styles.text_10,
                    { marginLeft: "25%" }
                  ]}
                >
                  4 hours
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.yellow_button}>
          <Text style={[styles.text_17, styles.text_center, styles.text_bold]}>
            OPEN CHANNEL
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor
  },
  row: {
    flexDirection: 'row',
  },
  yellow_button: {
    backgroundColor: "#ffa500",
    paddingHorizontal: 56,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 50
  },
  space_between: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4
  },
  width_60: {
    width: "60%"
  },
  text_bold: {
    fontWeight: "bold"
  },
  text_normal: {
    fontSize: 12
  },
  text_11: {
    fontSize: 11
  },
  text_10: {
    fontSize: 10
  },
  text_14: {
    fontSize: 14
  },
  text_17: {
    fontSize: 17
  },
  text_center: {
    textAlign: "center"
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
  textBright: {
    color: AppStyle.mainColor,
    fontFamily: AppStyle.mainFont
  },
  slider_wrapper: { width: "100%" },
  back: {
    marginRight: 8,
    width: 13,
    height: 14
  },
  margin_26: {
    margin: 26
  },
  margin_15: {
    margin: 15
  },
  margin_top_30: { marginTop: 30 },
  margin_top_33: { marginTop: 33 },
  margin_top_15: { marginTop: 15 },
  margin_top_10: { marginTop: 10 },
  fuding_wrapper: {
    alignItems: "center",
    marginTop: 31
  },
  text_x_large: {
    fontSize: 68
  },
  text_29: {
    fontSize: 29
  },
  outline_button: {
    padding: 7,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppStyle.mainColor,
    justifyContent: "center",
    marginRight: "20%"
  }
});

export default HomeScreen;
