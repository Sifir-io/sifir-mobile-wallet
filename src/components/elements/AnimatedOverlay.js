/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect} from 'react';
import {Animated, Text, View, StyleSheet} from 'react-native';

export default ({style = {}, children, ...rest}) => {
  const fadeAnim = new Animated.Value(0.2);
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0.8,
      duration: 150,
    }).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        backgroundColor: 'black',
        ...StyleSheet.absoluteFillObject,
        ...style,
        opacity: fadeAnim,
      }}
      {...rest}
    />
  );
};
