import React, {Component} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {Images, Constants} from '@common/index';
import Overlay from 'react-native-modal-overlay';

export default class SifirNotificationModal extends Component {
  render() {
    return (
      <>
        <Overlay
          visible={this.props.visible}
          closeOnTouchOutside
          onClose={this.props.onClose}
          animationType="zoomIn"
          containerStyle={styles.container}
          childrenWrapperStyle={{
            marginTop: this.props.marginTop,
            backgroundColor: 'transparent',
          }}
          animationDuration={500}>
          {hideModal => (
            <View style={styles.receivedModal}>
              <Text style={styles.titleTxt}>{this.props.title}</Text>
              <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold'}}>
                {this.props.content}
              </Text>
              <TouchableOpacity
                onPressOut={() => {
                  hideModal();
                  this.props.navigate(
                    this.props.nextScreen,
                    this.props.nextScreenData,
                  );
                }}>
                <Image source={Images.icon_arrow_white} style={styles.btnImg} />
              </TouchableOpacity>
            </View>
          )}
        </Overlay>
      </>
    );
  }
}

const styles = StyleSheet.create({
  receivedModal: {
    backgroundColor: '#39b54a',
    borderRadius: 10,
    flexDirection: 'row',
    width: Constants.SCREEN_WIDTH * 0.9,
    height: 70,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleTxt: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 25,
  },
  btnImg: {width: 40, height: 40, marginRight: 15},
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});
