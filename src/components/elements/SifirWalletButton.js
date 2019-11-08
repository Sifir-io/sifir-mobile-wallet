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
    const {
      width,
      height,
      iconURL,
      iconClickedURL,
      str1,
      str2,
      navigate,
      navigatePage,
    } = this.props;
    const {isClicked} = this.state;

    return (
      <View
        onTouchStart={() => {
          this.setState({isClicked: true});
        }}
        onTouchEnd={() => {
          this.setState({isClicked: false});
          navigate(navigatePage);
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
              source={isClicked === false ? iconURL : iconClickedURL}
            />
            <Text
              style={
                isClicked === true
                  ? styles.activeCardTxtStyle
                  : styles.cardTxtStyle
              }>
              {str1}
            </Text>
            <Text
              style={
                isClicked === true
                  ? styles.activeCardTxtStyle
                  : styles.cardTxtStyle
              }>
              {str2}
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
