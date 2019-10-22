import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  FlatList,
  Animated,
} from 'react-native';
import {connect} from 'react-redux';

import Images from '../../../common/images';
import AppStyle from '../../../common/AppStyle';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../../../common/constants';

class SifirAccountScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }

  state = {
    btnStatus: 0,
    SlideInLeft: new Animated.Value(0),
  };

  render() {
    const backTitle = Constants.MY_WALLET;
    const {navigate} = this.props.navigation;
    const {transactions} = this.props;
    const {btnStatus} = this.state;
    const SCREEN_WIDTH = Constants.SCREEN_WIDTH / 2;

    return (
      <View style={styles.mainscreen}>
        <TouchableOpacity>
          <View
            style={styles.backNavStyle}
            onTouchEnd={() => navigate('AccountsList')}>
            <Image source={Images.icon_back} style={styles.image} />
            <Text style={styles.backTextStyle}>{backTitle}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.topContStyle}>
          <LinearGradient
            height={SCREEN_WIDTH - 50}
            width={SCREEN_WIDTH - 50}
            colors={['#52d4cd', '#54a5b1', '#57658c']}
            style={styles.linearGradient}>
            <View>
              <Image source={Images.icon_bitcoin} style={styles.btcStyle} />
              <Text style={styles.btcTxtStyle}>GHASSANS</Text>
              <Text style={styles.btcTxtStyle}>WALLET</Text>
            </View>
          </LinearGradient>
          <View
            height={SCREEN_WIDTH - 30}
            width={SCREEN_WIDTH - 30}
            style={{
              flex: 5,
              flexDirection: 'column-reverse',
              marginLeft: 25,
              paddingBottom: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: AppStyle.mainFont,
                  fontSize: 50,
                }}>
                14.51
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontSize: 26,
                  fontFamily: AppStyle.mainFont,
                  textAlignVertical: 'bottom',
                  marginBottom: 7,
                  marginLeft: 5,
                }}>
                SAT
              </Text>
            </View>
            <Text
              style={{
                color: AppStyle.mainColor,
                fontFamily: AppStyle.mainFont,
                fontSize: 16,
                textAlignVertical: 'bottom',
                marginBottom: -5,
                marginLeft: 5,
              }}>
              {Constants.CUR_BALANCE}
            </Text>
          </View>
        </View>

        <View style={styles.btnStyle}>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPressIn={() => this.setState({btnStatus: 1})}
            onPressOut={() => this.setState({btnStatus: 0})}>
            <View
              style={[
                styles.transBtnStyle,
                btnStatus === 1 ? {backgroundColor: 'black', opacity: 0.7} : {},
              ]}>
              <Text style={{color: 'white', fontSize: 15}}>
                {Constants.SEND}
              </Text>
              <Image
                source={Images.icon_up_arrow}
                style={{width: 11, height: 11, marginLeft: 10}}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            style={{flex: 1}}
            onPressIn={() => this.setState({btnStatus: 2})}
            onPressOut={() => this.setState({btnStatus: 0})}>
            <View
              style={[
                styles.transBtnStyle,
                {
                  borderRightColor: 'transparent',
                  borderTopRightRadius: 15,
                  borderBottomRightRadius: 15,
                  borderBottomLeftRadius: 0,
                  borderTopLeftRadius: 0,
                },
                btnStatus === 2 ? {backgroundColor: 'black', opacity: 0.7} : {},
              ]}>
              <Text style={[{color: 'white', fontSize: 15}]}>
                {Constants.RECEIVE}
              </Text>
              <Image
                source={Images.icon_down_arrow}
                style={{width: 11, height: 11, marginLeft: 10}}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginLeft: 26,
            marginTop: 30,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 23,
              fontWeight: 'bold',
            }}>
            {Constants.TRANSACTIONS}
          </Text>
          <TouchableOpacity>
            <Image
              source={Images.icon_setting}
              style={{width: 20, height: 20, marginLeft: 20, marginTop: 7}}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.listStyle}>
          <FlatList
            data={transactions}
            width={SCREEN_WIDTH * 2 - 50}
            height="100%"
            renderItem={({item}) => (
              <TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    width: '100%',
                    height: 50,
                    borderBottomColor: AppStyle.listViewSep,
                    borderBottomWidth: 2,
                    alignItems: 'center',
                  }}>
                  <Image source={item.imgURL} style={{width: 30, height: 30}} />
                  <View style={{flex: 5, marginLeft: 20}}>
                    <Text style={{color: AppStyle.mainColor}}>{item.s1}</Text>
                    <Text
                      style={{color: AppStyle.mainColor, fontWeight: 'bold'}}>
                      {item.s2}
                    </Text>
                  </View>
                  <Text
                    style={{
                      flex: 2,
                      color: AppStyle.mainColor,
                    }}>
                    {item.s3}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btcTxtStyle: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
    fontSize: 28,
    marginLeft: 13,
    marginBottom: -10,
  },
  btcStyle: {
    marginBottom: 10,
    marginTop: 15,
    marginLeft: 13,
    width: 43,
    height: 43,
    opacity: 0.6,
  },
  topContStyle: {
    marginTop: -50,
    marginLeft: 20,
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  backNavStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 0,
    marginLeft: 13,
    height: 100,
  },
  backTextStyle: {
    fontFamily: AppStyle.mainFontBold,
    fontSize: 15,
    color: 'white',
    marginLeft: 5,
  },
  empty: {
    flex: 1,
  },
  image: {
    width: 15,
    height: 15,
    marginLeft: 10,
    marginTop: 2,
  },
  mainscreen: {
    flex: 1,
    width: '100%',
    backgroundColor: AppStyle.backgroundColor,
  },
  linearGradient: {
    flex: 4,
    borderRadius: 5,
    borderWidth: 1,
    borderRadius: 15,
  },
  btnStyle: {
    flexDirection: 'row',
    borderColor: AppStyle.mainColor,
    borderWidth: 1,
    borderRadius: 7,
    height: 55,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 30,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'white',
  },
  listStyle: {
    flex: 3,
    height: '100%',
    marginBottom: 20,
    marginLeft: 25,
  },
  transBtnStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRightColor: AppStyle.mainColor,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    height: '100%',
    borderWidth: 1,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    alignItems: 'center',
  },
  activeBtnStyle: {
    backgroundColor: 'red',
  },
});

function mapStateToProps(state) {
  return {
    transactions: state.transactions.data,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirAccountScreen);
