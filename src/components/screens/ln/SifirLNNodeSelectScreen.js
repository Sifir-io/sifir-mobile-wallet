import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Platform,
  Modal,
} from 'react-native';
import {AppStyle, Images} from '@common/index';
import SifirNodesTable from '@elements/SifirNodesTable';
import {getPeers} from '@actions/lnWallet';
import {connect} from 'react-redux';
import SifirQrCodeCamera from '@elements/SifirQrCodeCamera';

function SifirLNNodeSelectScreen(props) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [QRdataORuserInput, setQRorUserInput] = useState(undefined);
  const [selected, setSelected] = useState(undefined);
  useEffect(() => {
    (async () => {
      const nodeId = props.lnWallet.nodeInfo[0].id;
      props.getPeers(nodeId);
    })();
  }, []);

  const closeModal = data => {
    if (data === null) {
      return this.setState({showModal: false});
    }
    setQRorUserInput(data);
    setModalVisible(false);
  };

  useEffect(() => {
    QRdataORuserInput;
  }, [QRdataORuserInput]);
  return (
    <View style={styles.container}>
      <View style={[styles.margin_30, styles.flex1]}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter Node URL"
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
        <Text
          style={[
            styles.text_large,
            styles.text_white,
            styles.text_bold,
            styles.margin_top_30,
            styles.mb_20,
          ]}>
          Browse Nodes
        </Text>
        <SifirNodesTable
          nodes={props.lnWallet.peers}
          selected={selected}
          onSelect={setSelected}
          loading={props.lnWallet.loading}
          loaded={props.lnWallet.loaded}
        />

        <TouchableOpacity
          disabled={selected ? !selected.id : true}
          // Adding inline style as condition is needed to be evaluated
          style={{
            backgroundColor: selected && selected.id ? '#ffa500' : 'lightgrey',
            padding: 20,
            borderRadius: 10,
            marginTop: 50,
          }}>
          <Text
            style={[styles.text_large, styles.text_center, styles.text_bold]}>
            CONTINUE
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
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
    height: Platform.OS === 'android' ? 30 : 25,
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
});
