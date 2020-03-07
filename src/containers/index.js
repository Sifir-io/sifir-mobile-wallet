import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ActivityIndicator, StatusBar, StyleSheet, View} from 'react-native';
import {C, AppStyle} from '@common/index';
import SifirHeader from '@elements/SifirHeader';
import {ScanToPairScreen, UnlockORGenKeys} from '@screens/auth/index';
import WalletTab from './WalletStack';
import {connect} from 'react-redux';
import {event} from '@io/events';
import {ErrorScreen} from '@screens/error';
import {
  loadEncryptedAuthInfo,
  loadDevicePgpKeys,
  deleteDevicePgpKeys,
  clearAuthInfo,
} from '@actions/auth';
import {createStackNavigator} from '@react-navigation/stack';
import {error} from '@io/events';
const RootStack = createStackNavigator();
const ContentStack = createStackNavigator();
/**
 * App tabs
 */
function ContentNav(props) {
  return (
    <ContentStack.Navigator
      initialRouteName={C.STR_WALLET}
      headerMode="float"
      screenOptions={{
        gestureEnabled: false,
        header: ({scene, previous, navigation}) => {
          return <SifirHeader switchPage={page => navigation.navigate(page)} />;
        },
      }}
      options={
        {
          //headerStyle: {
          //  height: 50, // Specify the height of your custom header
          //},
        }
      }>
      <ContentStack.Screen name={C.STR_WALLET} component={WalletTab} />
    </ContentStack.Navigator>
  );
}

/** Root Auth, App etc.. */
function AuthNav(props) {
  const {encAuthInfo} = props;
  return (
    <RootStack.Navigator
      headerMode="none"
      screenOptions={{
        gestureEnabled: false,
      }}>
      {encAuthInfo ? (
        <RootStack.Screen
          name="UnlockORGenKeys"
          component={UnlockORGenKeys}
          initialParams={{encAuthInfo}}
        />
      ) : (
        <>
          <RootStack.Screen
            name="ScanToPairScreen"
            component={ScanToPairScreen}
          />
          <RootStack.Screen
            name="UnlockORGenKeys"
            component={UnlockORGenKeys}
          />
        </>
      )}
    </RootStack.Navigator>
  );
}
class Root extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  state = {
    initLoading: true,
    encAuthInfo: null,
    devicePgpKeys: null,
    caughtError: false,
  };
  _bootstrapAsync = async () => {
    const [encAuthInfo, devicePgpKeys] = await Promise.all([
      this.props.loadEncryptedAuthInfo(),
      this.props.loadDevicePgpKeys(),
    ]);
    this.setState({initLoading: false, encAuthInfo, devicePgpKeys});
  };
  componentDidMount() {
    this._bootstrapAsync();
  }
  static getDerivedStateFromError(err) {
    // Update state so the next render will show the fallback UI.
    return {caughtError: true, initLoading: false, caughtErrorObj: err};
  }

  componentDidCatch(errorThrown, info) {
    error('containerIndex:componentDidCatch', errorThrown, info);
    event('error.componentDidCatch', {
      component: 'containerIndex',
      errorThrown,
      info,
    });
  }
  render() {
    const {
      auth: {token, key, nodePubkey},
    } = this.props;
    const {initLoading, encAuthInfo, caughtError, caughtErrorObj} = this.state;
    const authStateReady = token && key && nodePubkey;
    if (caughtError) {
      return (
        <ErrorScreen
          title={C.STR_ERROR_app}
          desc={C.STR_ERROR_app_unhandled}
          error={caughtErrorObj}
          actions={[
            {
              //TODO Reset state gracfully and retry
              text: `${C.STR_PLEASE} ${C.STR_RELOAD_APP}`,
              // onPress: () => this.props.getBtcWalletList(),
            },
          ]}
        />
      );
    }
    return (
      <NavigationContainer>
        {initLoading ? (
          <View style={styles.mainViewLoading}>
            <ActivityIndicator size="large" style={styles.progress} />
            <StatusBar barStyle="default" />
          </View>
        ) : (
          <View style={styles.mainView}>
            {authStateReady ? (
              <ContentNav />
            ) : (
              <AuthNav encAuthInfo={encAuthInfo} />
            )}
          </View>
        )}
      </NavigationContainer>
    );
  }
}
const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};
const mapDispatchToProps = {
  loadEncryptedAuthInfo,
  deleteDevicePgpKeys,
  loadDevicePgpKeys,
  clearAuthInfo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Root);
const styles = StyleSheet.create({
  mainViewLoading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mainView: {flex: 1, backgroundColor: AppStyle.backgroundColor},
  inputTxtStyle: {
    flex: 1,
    marginTop: 5,
    marginLeft: 10,
    color: 'white',
    textAlign: 'left',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
