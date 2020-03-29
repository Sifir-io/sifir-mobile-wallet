import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {AppStyle} from '@common/index';

const Columns = props => {
  let columns = [];
  const {boltInputRequired} = props;
  if (boltInputRequired) {
    columns = ['Alias', 'Status', 'Capacity'];
  } else {
    columns = ['Channel', 'ID', 'Fees'];
  }

  return (
    <View style={styles.columnWrapper}>
      {columns.map((col, index) => (
        <View
          style={
            index === columns.length - 1 ? styles.rowBox : styles.columnBox
          }>
          <Text style={styles.columnText}>{col}</Text>
        </View>
      ))}
    </View>
  );
};

const Row = props => {
  const {
    secondCol,
    thirdCol,
    firstCol,
    bgIndicator,
    selected,
    onSelect,
  } = props;
  const backgroundColor = selected
    ? '#ffa500'
    : bgIndicator % 2 === 0
    ? '#102c3a'
    : '#1f4c5f';
  return (
    <TouchableOpacity
      style={{backgroundColor}}
      onPress={onSelect}
      key={firstCol}>
      <View style={styles.rowWrapper}>
        <View style={styles.rowBox}>
          <Text style={styles.columnTextRow}>{firstCol}</Text>
        </View>

        <View style={styles.rowBox}>
          <Text style={styles.columnTextRow}>{secondCol}</Text>
        </View>

        <View style={styles.rowBox}>
          <Text style={styles.columnTextRow}>{thirdCol}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SifirNodesTable = props => {
  const {nodes, routes, loading, loaded, boltInputRequired} = props;
  const tableData = boltInputRequired ? nodes : routes;

  const renderRow = (item, rowIndex) => {
    const {selected, onSelect} = props;
    if (boltInputRequired) {
      const alias = `${item.id.slice(0, 4)} - ${item.id.slice(-4)}`;
      const channelStatus = item.channels[0]?.state;
      const capacity = item.channels[0]?.spendable_msat;
      return (
        <Row
          key={item.id}
          firstCol={alias}
          secondCol={channelStatus}
          thirdCol={capacity}
          bgIndicator={rowIndex}
          selected={selected && item.id === selected.id}
          onSelect={() => onSelect(item)}
        />
      );
    } else {
      const {channel, id, msatoshi} = item;
      const formattedID = `${id.slice(0, 4)} - ${id.slice(-4)}`;
      let hopFee = 0;
      if (rowIndex > 0) {
        hopFee = msatoshi - routes[rowIndex - 1]?.msatoshi;
      }
      return (
        <Row
          key={item.id}
          firstCol={channel}
          secondCol={formattedID}
          thirdCol={hopFee}
          bgIndicator={rowIndex}
          selected={selected && item.id === selected.id}
          onSelect={() => onSelect(item)}
        />
      );
    }
  };

  return (
    <View style={[styles.table, props.style]}>
      <Columns boltInputRequired={boltInputRequired} />
      {loading && !loaded && <ActivityIndicator size="large" />}
      <ScrollView>{tableData.map((item, i) => renderRow(item, i))}</ScrollView>
    </View>
  );
};
export default SifirNodesTable;

const styles = StyleSheet.create({
  table: {backgroundColor: 'black'},
  columnWrapper: {
    padding: 10,
    flexDirection: 'row',
  },
  rowWrapper: {
    padding: 20,
    flexDirection: 'row',
  },
  rowBox: {
    flex: 1,
    alignItems: 'center',
  },
  columnBox: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: AppStyle.mainColor,
    alignItems: 'center',
  },
  columnText: {color: 'white', textAlign: 'center', width: '70%'},
  columnTextRow: {
    color: AppStyle.mainColor,
    textAlign: 'center',
    width: '80%',
  },
});
