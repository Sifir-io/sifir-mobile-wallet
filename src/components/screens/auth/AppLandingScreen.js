import React from 'react';
import {connect} from 'react-redux';
import {ActivityIndicator, Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {loadEncryptedAuthInfo} from '@actions/auth';
import {PGP_KEYS_NOT_FOUND} from '@utils/constants';
import {Images, AppStyle, C} from '@common/index';

class AppLandingScreen extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        await this.props.loadEncryptedAuthInfo();
        const {
            auth: {encAuthInfo}
        } = this.props;
        if (encAuthInfo) {
            this.props.navigation.navigate('UnlockORGenKeys', { encAuthInfo, paired: true, scanned: false});
        } else {
            this.props.navigation.navigate('Pair');
        }
    };

    render() {
        return (<View style={styles.mainView}>
            <ActivityIndicator size="large" style={styles.progress}/>
            <StatusBar barStyle="default"/>
        </View>)

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
const mapDispatchToProps = {loadAuthInfo, loadDevicePgpKeys};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AppLandingScreen);
