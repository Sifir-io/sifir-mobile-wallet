import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {AppStyle, C} from '@common/index';

const Columns = ({columns}) => {
  return (
    <View style={styles.columnWrapper}>
      {columns.map((col, index) => (
        <View
          id={`${index}-${col.replace(' ', '')}`}
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
  const {secondCol, thirdCol, firstCol, bgIndicator} = props;
  const backgroundColor = bgIndicator % 2 === 0 ? '#102c3a' : '#1f4c5f';
  return (
    <View style={{backgroundColor}} key={firstCol}>
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
    </View>
  );
};

const SifirNodesTable = props => {
  const {nodes, routes, nodeInputRequired} = props;
  const tableData = nodeInputRequired ? nodes : routes;

  const renderRow = (item, rowIndex) => {
    if (nodeInputRequired) {
      const nodeId = `${item.id.slice(0, 4)} - ${item.id.slice(-4)}`;
      const channelStatus = item.channels[0]?.state || 'NA';
      const capacity = item.channels[0]?.spendable_msatoshi || 'NA';
      return (
        <Row
          key={item.id}
          firstCol={nodeId}
          secondCol={channelStatus}
          thirdCol={capacity}
          bgIndicator={rowIndex}
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
        />
      );
    }
  };

  return (
    <View style={[styles.table, props.style]}>
      <Columns
        columns={
          nodeInputRequired
            ? [
                C.STR_Channel_Node_Id,
                C.STR_Channel_Status,
                `${C.STR_Spendable} ${C.STR_MSAT}`,
              ]
            : [C.STR_Channel, C.STR_Node_Id, C.STR_Channel_Fees]
        }
      />
      <ScrollView>{tableData.map((item, i) => renderRow(item, i))}</ScrollView>
    </View>
  );
};
export default SifirNodesTable;

const styles = StyleSheet.create({
  table: {backgroundColor: 'black'},
  columnWrapper: {
    padding: 7,
    flexDirection: 'row',
  },
  rowWrapper: {
    padding: 10,
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
