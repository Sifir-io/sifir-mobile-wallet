import React from 'react';
import {connect} from 'react-redux';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {
  loadEncryptedAuthInfo,
  deleteDevicePgpKeys,
  clearAuthInfo,
} from '@actions/auth';
import {Images, AppStyle, C} from '@common/index';
import {log, error} from '@io/events/';

class AppLandingScreen extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    //await this.props.clearAuthInfo();
    //await this.props.deleteDevicePgpKeys();

    const encAuthInfo = await this.props.loadEncryptedAuthInfo();
    if (encAuthInfo) {
      this.props.navigation.navigate('UnlockORGenKeys', {
        encAuthInfo,
      });
    } else {
      this.props.navigation.navigate('Pair');
    }
  };

  render() {
    return (
      <View style={styles.mainView}>
        <ActivityIndicator size="large" style={styles.progress} />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  inputTxtStyle: {
    flex: 1,
    marginLeft: 10,
    color: 'white',
    textAlign: 'left',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  continueBtnView: {
    height: 90,
    marginTop: 30,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: AppStyle.mainColor,
    borderWidth: 2,
    borderRadius: 10,
    marginLeft: 43,
    marginRight: 43,
  },
  progress: {},
});

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};
const mapDispatchToProps = {
  loadEncryptedAuthInfo,
  deleteDevicePgpKeys,
  clearAuthInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppLandingScreen);
