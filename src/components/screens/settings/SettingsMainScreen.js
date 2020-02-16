import React, {Component} from 'react';
import AppStyle from '@common/AppStyle';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {clearAuthInfo} from '@actions/auth';
import {connect} from 'react-redux';

class SettingsMainScreen extends Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <View style={styles.mainscreen}>
        <TouchableOpacity onPress={() => this.props.clearAuthInfo()}>
          <Text style={styles.tempStyle}> Delete Pairing Data</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = {clearAuthInfo};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsMainScreen);

const styles = StyleSheet.create({
  mainscreen: {
    flex: 1,
    display: 'flex',
    backgroundColor: AppStyle.backgroundColor,
    width: '100%',
  },
  tempStyle: {
    color: 'white',
    fontSize: 20,
  },
});
