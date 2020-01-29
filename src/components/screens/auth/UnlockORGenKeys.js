import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Text,
    ActivityIndicator, TextInput,
} from 'react-native';
import {Images, AppStyle, C} from '@common/index';
import {pairPhoneWithToken, genAndSaveDevicePgpKeys, initAndUnlockDeviceKeys, setAuthInfoState} from '@actions/auth';
import {encryptMessage, decryptMessage} from '@io/pgp';

class UnlockORGenKeys extends Component {
    constructor(props, context) {
        super(props, context);
    }

    state = {
        scanned: this.props.navigation.getParam('scanned'),
        paired: this.props.navigation.getParam('paired'),
        encAuthInfo: this.props.navigation.getParam('encAuthInfo'),
        passphrase: ''
    };

    async componentDidMount() {
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        await this.props.loadDevicePgpKeys();
    };

    async passwordEntered() {
        try {
            if (!this.state.passphrase.length) {
                throw 'Enter password first'
            }
            const {paired, scanned, passphrase} = this.state;
            let {pubKeyArmored, privKeyArmored} = this.props;

            // No keys, gen them
            if (!pubKeyArmored || !privKeyArmored) {
                ({privKeyArmored, pubKeyArmored} = await this.genAndSaveDevicePgpKeys({
                    user: deviceId,
                    email: user,
                    passphrase
                }));
            }
            // unlock keys
            await initAndUnlockDeviceKeys({privKeyArmored, passphrase});

            // paired
            if (paired && encAuthInfo) {
                const decryptedAuthInfo = await decryptMessage(encAuthInfo);
                const authInfo = JSON.parse(decryptedAuthInfo);
                setAuthInfoState(authInfo);
                this.props.navigation.navigate('App')
                return;
            } else if (scanned) {
                this.props.pairPhoneWithToken({token, key});
                //
            }


        } catch (err) {
            // problem unlocking key
        }


    }

    render() {
        const {passphrase} = this.state;
        const {pubKeyArmored, privKeyArmored} = this.props;
        let view;

        if (pubKeyArmored && privKeyArmored) {
            view =
                <>
                    <Text style={styles.commentTxt}>{C.STR_WELCOME_NEW}</Text>
                    <TextInput
                        placeholder={C.STR_ENTER_PASS_TO_UNLOCK_WALLET}
                        placeholderTextColor="white"
                        style={[styles.inputTxtStyle]}
                        // style={[styles.inputTxtStyle, {fontSize: addrFontSize}]}
                        value={passphrase}
                    />
                </>
        } else {
            view =
                <>
                    <Text style={styles.commentTxt}>{C.STR_WELCOME_BACK}</Text>
                    <Text style={styles.commentTxt}>Lorem ipsum dolor sit amet, te mei appetere pertinacia, idque mucius
                        pri et. No nulla periculis persecuti mei, at pro iusto repudiare, cum at alia discere
                        disputationi. Dicant mollis eum eu, facilisi convenire urbanitas ne vis,

                    </Text>
                    <TextInput
                        placeholder={C.STR_ENTER_PASSWORD}
                        placeholderTextColor="white"
                        style={[styles.inputTxtStyle]}
                        // style={[styles.inputTxtStyle, {fontSize: addrFontSize}]}
                        value={passphrase}
                    />
                </>
        }

        return (
            <View style={styles.inputView}>
                {view}
                <TouchableOpacity>
                    <View
                        style={styles.continueBtnView}
                        onTouchEnd={() => this.passwordEntered()}>
                        <Text style={styles.continueTxt}>{C.STR_CONTINUE}</Text>
                        <Image
                            source={Images.icon_up_blue}
                            style={{width: 20, height: 20, marginLeft: 20}}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        height: '100%',
        backgroundColor: AppStyle.backgroundColor,
        width: '100%',
    },
    doneView: {
        width: C.SCREEN_WIDTH * 0.5,
        flexDirection: 'row',
        height: 9.5 * C.vh,
        backgroundColor: '#53cbc8',
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        marginTop: 10,
    },
    mainContent: {alignItems: 'center', flex: 3, marginTop: 12 * C.vh},
    resultTxt: {
        color: 'white',
        fontFamily: AppStyle.mainFont,
        fontSize: 10 * C.vh,
        marginTop: 10,
    },
    descriptionTxt: {
        color: AppStyle.mainColor,
        fontSize: 16,
        marginTop: 20,
        fontFamily: AppStyle.mainFontBold,
    },
    doneTouch: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    doneTxt: {
        color: AppStyle.backgroundColor,
        fontWeight: 'bold',
        fontSize: 26,
        marginRight: 15,
    },
    checkImg: {width: 8 * C.vh, height: 8 * C.vh, marginTop: 2 * C.vh},
    progressView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

const mapStateToProps = state => {
    return {
        auth: state.auth,
    };
};

const mapDispatchToProps = {pairPhoneWithToken, genAndSaveDevicePgpKeys, setAuthInfoState};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UnlockORGenKeys);
