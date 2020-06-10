import React, {useCallback, useState, useEffect} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import SifirAutoSpendHeader from '@elements/SifirHeaders/SifirAutoSpendHeader';
import {AppStyle, svg} from '@common';

const SifirWasabiAutoSpendScreen = props => {
  const [isSwitchOn, setSwitchOn] = useState(false);
  const {navigation} = props;
  useEffect(() => {
    StatusBar.setBackgroundColor(AppStyle.backgroundColor);
  }, []);

  return (
    <View style={styles.container}>
      <SifirAutoSpendHeader
        containerStyle={{paddingTop: 20}}
        headerText="Set Minimum Anonset"
        handleBackPress={() => navigation.goBack()}
        isSwitchOn={isSwitchOn}
        setSwitchOn={setSwitchOn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: AppStyle.backgroundColor},
});
export default SifirWasabiAutoSpendScreen;
