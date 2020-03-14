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
  return (
    <View style={styles.columnWrapper}>
      <View style={styles.columnBox}>
        <Text style={styles.columnText}>Alias</Text>
      </View>

      <View style={styles.columnBox}>
        <Text style={styles.columnText}>Status</Text>
      </View>

      <View style={styles.rowBox}>
        <Text style={styles.columnText}>Capacity</Text>
      </View>
    </View>
  );
};
const Row = props => {
  const {
    channelStatus,
    capacity,
    alias,
    bgIndicator,
    selected,
    onSelect,
  } = props;
  let backgroundColor = selected
    ? '#ffa500'
    : bgIndicator % 2 === 0
    ? '#102c3a'
    : '#1f4c5f';
  return (
    <TouchableOpacity style={{backgroundColor}} onPress={onSelect}>
      <View style={styles.rowWrapper}>
        <View style={styles.rowBox}>
          <Text style={styles.columnTextRow}>{alias}</Text>
        </View>

        <View style={styles.rowBox}>
          <Text style={styles.columnTextRow}>{channelStatus}</Text>
        </View>

        <View style={styles.rowBox}>
          <Text style={styles.columnTextRow}>{capacity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SifirNodesTable = props => {
  const {nodes, loading, loaded} = props;

  const renderRow = (item, i) => {
    const {selected, onSelect} = props;
    const alias = `${item.id.slice(0, 4)} - ${item.id.slice(-4)}`;
    const channelStatus = item.channels[0].state;
    // TODO replace with real data
    const capacity = 'capacity';
    return (
      <Row
        key={item.alias}
        alias={alias}
        channelStatus={channelStatus}
        capacity={capacity}
        bgIndicator={i}
        selected={selected && item.id === selected.id}
        onSelect={() => onSelect(item)}
      />
    );
  };

  return (
    <View style={[styles.table, props.style]}>
      <Columns />
      {loading && !loaded && <ActivityIndicator size="large" />}
      <ScrollView>{nodes.map((item, i) => renderRow(item, i))}</ScrollView>
    </View>
  );
};
export default SifirNodesTable;

const styles = StyleSheet.create({
  table: {flex: 1, backgroundColor: 'black'},
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
    width: '70%',
  },
});
