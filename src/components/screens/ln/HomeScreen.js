import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import {Slider} from 'react-native-elements';
const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.margin_30}>
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
          <Text style={[styles.textBright, styles.text_normal, styles.text_bold]}>
            FUNDING AMOUNT
          </Text>
          <Text style={[styles.text_white, styles.text_x_large]}>0.05 BTC</Text>
        </View>

        <View style={[styles.margin_15, styles.margin_top_30]}>
          <Text style={[styles.textBright]}>Alias</Text>
          <Text style={[styles.text_white, styles.text_large]}>EMEA#1</Text>

          <Text style={[styles.textBright, styles.margin_top_15]}>
            Node Address
          </Text>
          <Text style={[styles.text_white, styles.text_large]}>
            ema.node.co
          </Text>

          <Text style={[styles.textBright, styles.margin_top_15]}>Port</Text>
          <Text style={[styles.text_white, styles.text_large]}>124</Text>

          <Text style={[styles.textBright, styles.margin_top_15]}>Fees</Text>
          <View style={[styles.space_between, styles.mt7]}>
            <View style={styles.outline_button}>
              <Text style={[styles.text_white, styles.text_large]}>
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
                <Text style={styles.textBright}>Approximate wait</Text>
                <Text style={[styles.text_white, { marginLeft: 40 }]}>
                  4 hours
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.yellow_button}>
          <Text style={[styles.text_26, styles.text_center, styles.text_bold]}>
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
  text_26: { fontSize: 26 },
  row: {
    flexDirection: 'row',
  },
  yellow_button: {
    backgroundColor: "#ffa500",
    padding: 25,
    borderRadius: 10,
    marginTop: 50
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
  mt7: {
    marginTop: 7
  },
  slider_wrapper: { width: "100%", marginLeft: 20 },
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
    borderColor: AppStyle.mainColor,
    justifyContent: "center"
  }
});

export default HomeScreen;
