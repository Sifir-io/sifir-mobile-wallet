import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';

const SifirSwitch = ({isActive, style, width, setSwitchOn}) => {
  return (
    <View style={style}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setSwitchOn(!isActive)}
        style={[
          styles.container,
          {
            ...(isActive ? styles.activeContainer : styles.inactiveContainer),
            width: width,
            borderRadius: 30,
          },
        ]}>
        <View
          style={{
            width: width / 3,
            height: width / 3,
            borderRadius: width / 4,
            backgroundColor: isActive ? '#00EDE7' : '#74797B',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 5,
          }}>
          <View
            style={{
              width: isActive ? 3 : width / 5,
              height: isActive ? width / 5 : 3,
              backgroundColor: isActive ? '#FFFFFF' : '#C4C4C4',
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

SifirSwitch.defaultProps = {
  width: 80,
};

export default SifirSwitch;

const styles = StyleSheet.create({
  activeContainer: {
    borderWidth: 1.32,
    borderColor: 'rgba(83, 203, 200, 0.5)',
    backgroundColor: 'rgba(83, 203, 200, 0.5)',
    alignItems: 'flex-end',
  },
  inactiveContainer: {
    borderWidth: 1.32,
    borderColor: '#74797B',
    alignItems: 'flex-start',
  },
});
