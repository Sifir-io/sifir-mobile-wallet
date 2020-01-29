import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {View, StyleSheet} from 'react-native';

import SifirHeader from '@elements/SifirHeader';
import {AppLandingScreen, ScanToPairScreen,UnlockORGenKeys} from '@screens/auth/index';
import WalletTab from './WalletStack';
import {AppStyle} from '@common/index';

const ContentNavigator = createSwitchNavigator(
    {
        WALLET: WalletTab,
    },
    {
        initialRouteName: 'WALLET',
    },
);

class Root extends React.Component {
    static router = ContentNavigator.router;

    render() {
        return (
            <View style={styles.mainView}>
                <SifirHeader
                    switchPage={page => this.props.navigation.navigate(page)}
                />
                <ContentNavigator navigation={this.props.navigation}/>
            </View>
        );
    }
}

export default createAppContainer(
    createSwitchNavigator(
        {
            AppLandingScreen,
            UnlockORGenKeys,
            Pair: ScanToPairScreen,
            App: Root,
        },
        {
            initialRouteName: 'AppLandingScreen',
        },
    ),
);

const styles = StyleSheet.create({
    mainView: {flex: 1, backgroundColor: AppStyle.backgroundColor},
});
