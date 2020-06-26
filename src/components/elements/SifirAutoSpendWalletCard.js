import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import SifirCard from '@elements/SifirCard';
import {AppStyle, C} from '@common';

const SifirAutoSpendWalletCard = ({
  item,
  setSelectedWallet,
  onLayoutListItem,
  selectedWallet,
}) => {
  const {label, desc, iconURL, meta} = item;
  // const {id, leftIcon, heading, annonset} = item;

  return (
    <TouchableOpacity
      onPress={() => setSelectedWallet(item)}
      onLayout={event => onLayoutListItem(event, label)}>
      <SifirCard
        style={[
          styles.cardContainer,
          {
            borderColor:
              selectedWallet?.label === label ? AppStyle.mainColor : '#19282f',
          },
        ]}>
        <Image source={iconURL} style={styles.leftIcon} />
        <Text style={styles.listHeading}>{`${label} - ${desc}`}</Text>
        <View style={styles.rightContainer}>
          <Text style={styles.anonset}>{0}</Text>
          <Text style={styles.anonsetLabel}>{C.STR_Min_Anonset}</Text>
        </View>
      </SifirCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginStart: 20,
    marginEnd: 20,
    marginBottom: 24,
    backgroundColor: '#19282f',
    borderWidth: 2,
    borderColor: '#19282f',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  listHeading: {
    color: 'white',
    flex: 1,
    paddingLeft: 20,
  },
  anonset: {
    color: 'white',
    fontSize: 18,
  },
  anonsetLabel: {
    color: 'gray',
    fontSize: 12,
  },
  rightContainer: {
    textAlign: 'right',
    alignItems: 'flex-end',
  },
});
export default SifirAutoSpendWalletCard;
