import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import {AppStyle} from '@common/index';

export default class SifirWalletButton extends Component {
  state = {isClicked: false};

  render() {
    const {width, height, navigate} = this.props;
    const {
      iconURL,
      iconClickedURL,
      label,
      desc,
      pageURL,
    } = this.props.walletInfo;
    const {isClicked} = this.state;
    return (
      <View
        onTouchStart={() => {
          this.setState({isClicked: true});
        }}
        onTouchEnd={() => {
          this.setState({isClicked: false});
          navigate(pageURL, {walletInfo: this.props.walletInfo});
        }}>
        <TouchableWithoutFeedback
          onPressIn={() => this.setState({isClicked: true})}
          onPressOut={() => this.setState({isClicked: false})}>
          <View
            style={isClicked === true ? styles.activeCard : styles.card}
            width={width}
            height={height}>
            <Image
              style={styles.cardImgStyle}
              resizeMode="contain"
              source={isClicked === false ? iconURL : iconClickedURL}
            />
            <Text
              style={
                isClicked === true
                  ? styles.activeCardTxtStyle
                  : styles.cardTxtStyle
              }>
              {label}
            </Text>
            <Text
              style={
                isClicked === true
                  ? styles.activeCardTxtStyle
                  : styles.cardTxtStyle
              }>
              {desc}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: AppStyle.mainColor,
    justifyContent: 'center',
    marginBottom: 20,
    paddingTop: 5,
    paddingBottom: 15,
  },
  activeCard: {
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    marginBottom: 20,
    paddingTop: 5,
    paddingBottom: 15,
  },
  cardTxtStyle: {
    fontSize: 20,
    color: AppStyle.mainColor,
    marginLeft: 17,
    marginBottom: -7,
  },
  activeCardTxtStyle: {
    fontSize: 20,
    color: 'white',
    marginBottom: -7,
    marginLeft: 17,
  },
  cardImgStyle: {
    width: 45,
    height: 45,
    borderRadius: 4,
    marginLeft: 15,
    borderWidth: 0.5,
    marginBottom: 10,
  },
});
