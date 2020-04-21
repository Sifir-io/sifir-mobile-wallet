import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AppStyle, Images, C} from '@common/index';
import SifirNodesTable from '@elements/SifirNodesTable';
import {getPeers} from '@actions/lnWallet';
import {connect} from 'react-redux';
import SifirQrCodeCamera from '@elements/SifirQrCodeCamera';
import {isValidLnNodeId} from '@helpers/validations';
import {error} from '@io/events';

function SifirLNNodeSelectScreen(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const {nodeInputRequired, routes} = props.route.params;
  const [QRdataORuserInput, setQRorUserInput] = useState('');
  const {loading, loaded} = props.lnWallet;

  useFocusEffect(
    useCallback(() => {
      const [{id}] = props.lnWallet.nodeInfo;
      props.getPeers(id);
      return () => {};
    }, []),
    [],
  );

  const closeModal = data => {
    if (data === null) {
      return setModalVisible(false);
    }
    setQRorUserInput(data);
    setModalVisible(false);
  };

  const isContinueButtonDisabled = () => {
    if (nodeInputRequired) {
      const nodeId = QRdataORuserInput.split('@')[0];
      return isValidLnNodeId(nodeId) ? false : true;
    }
    return false;
  };
  const handleContinueBtn = () => {
    if (nodeInputRequired) {
      const {walletInfo} = props.route.params;
      props.navigation.navigate('LnChannelFunding', {
        nodeAddress: QRdataORuserInput,
        walletInfo,
      });
    } else {
      props.navigation.goBack();
    }
  };

  const isButtonDisabled = isContinueButtonDisabled();
  return (
    <View style={styles.container}>
      <View style={[styles.margin_30, styles.flex1]}>
        {nodeInputRequired && (
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder={C.STR_Enter_Node_URL}
              placeholderTextColor="white"
              style={[styles.input]}
              selectionColor="white"
              value={QRdataORuserInput}
              onChangeText={txt => setQRorUserInput(txt)}
            />
            <View style={[styles.space_around]}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={Images.camera_blue} style={styles.camera_icon} />
              </TouchableOpacity>
              <Image source={Images.icon_setting} style={styles.burger_icon} />
            </View>
          </View>
        )}
        <View style={styles.headingAndSpinnerRow}>
          <Text
            style={[
              styles.text_large,
              styles.text_white,
              styles.text_bold,
              styles.margin_top_30,
              styles.mb_20,
            ]}>
            {nodeInputRequired ? C.STR_Browse_Channels : C.STR_Path_to_Node}
          </Text>
          {loading && !loaded && <ActivityIndicator />}
        </View>
        <View style={styles.nodesTblContainer}>
          <SifirNodesTable
            nodes={props.lnWallet.peers}
            routes={routes}
            nodeInputRequired={nodeInputRequired}
          />
        </View>
      </View>
      <TouchableOpacity
        disabled={isButtonDisabled}
        onPress={() => handleContinueBtn()}
        style={[
          styles.continueBtn,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            backgroundColor: !isButtonDisabled ? '#ffa500' : 'lightgrey',
          },
        ]}>
        <Text style={[styles.text_large, styles.text_center, styles.text_bold]}>
          {C.STR_CONTINUE}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
        presentationStyle="fullScreen">
        <SifirQrCodeCamera closeHandler={closeModal} />
      </Modal>
    </View>
  );
}
const mapStateToProps = state => {
  return {
    lnWallet: state.lnWallet,
  };
};

const mapDispatchToProps = {
  getPeers,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SifirLNNodeSelectScreen);

SifirLNNodeSelectScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    overflow: 'hidden',
  },
  inputWrapper: {
    flexDirection: 'row',
    borderColor: AppStyle.mainColor,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  container: {
    flex: 1,
    backgroundColor: AppStyle.backgroundColor,
  },
  camera_icon: {width: 25, height: 20},
  burger_icon: {width: 25, height: 20},
  space_around: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    marginLeft: 10,
  },
  space_between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mb_20: {marginBottom: 20},
  input: {
    width: '70%',
    color: 'white',
    // height: Platform.OS === 'android' ? 30 : 25,
    fontSize: 12,
  },
  text_bold: {
    fontWeight: 'bold',
  },
  text_center: {
    textAlign: 'center',
  },
  text_large: {
    fontSize: 17,
  },
  text_white: {
    color: 'white',
    fontFamily: AppStyle.mainFont,
  },
  back: {
    marginRight: 8,
    width: 12,
    height: 12,
  },
  margin_30: {
    margin: 30,
  },
  margin_top_30: {marginTop: 30},
  continueBtn: {
    padding: 20,
    borderRadius: 10,
    bottom: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 30,
  },
  headingAndSpinnerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  nodesTblContainer: {flex: 1, paddingBottom: 120},
});
