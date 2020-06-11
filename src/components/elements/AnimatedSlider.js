import React from 'react';
import {C} from '@common/index';
import {StyleSheet, View, Animated, TextInput, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const height = 60;
const width = C.SCREEN_WIDTH;

const AnimatedSlider = ({
  minX,
  maxX,
  SV,
  slider,
  label,
  lineLength,
  cursor,
  x,
}) => {
  return (
    <>
      <View style={styles.container}>
        <View>
          <View style={styles.cursorParent}>
            <View ref={cursor}>
              <LinearGradient
                colors={['white', 'black', 'black', 'black', 'black']}
                style={styles.verticalGradient}
              />
            </View>
          </View>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack}>
              <Animated.View ref={slider} style={styles.thumb} />
            </View>
          </View>
          <Animated.View style={styles.label}>
            <TextInput ref={label} style={styles.bubbleText} />
          </Animated.View>
          <Animated.ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={{
              width: lineLength * 2 + 50,
            }}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            bounces={false}
            horizontal
            ref={SV}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {x},
                  },
                },
              ],
              {useNativeDriver: true},
            )}
          />
        </View>
      </View>
      <View style={styles.sliderLabelContainer}>
        <Text style={styles.sliderLabel}>{minX}</Text>
        <Text style={styles.sliderLabel}>Anonimity Level</Text>
        <Text style={styles.sliderLabel}>{maxX}</Text>
      </View>
    </>
  );
};

export default AnimatedSlider;
const styles = StyleSheet.create({
  root: {
    height,
  },
  container: {
    overflow: 'hidden',
    paddingTop: '20%',
    width,
  },

  label: {
    position: 'absolute',
    color: 'white',
    top: -30,
  },
  verticalGradient: {
    height: 130,
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.5)',
    opacity: 0.5,
    borderRadius: 10,
    top: -40,
  },
  sliderContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  bubbleText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    top: -15,
  },
  thumb: {
    backgroundColor: '#00EDE7',
    width: 40,
    borderRadius: 5,
    elevation: 3,
    height: 16,
  },
  sliderTrack: {
    backgroundColor: '#2B2B2B',
    borderRadius: 5,
  },
  shadow: {
    shadowColor: '#00EDE7',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  cursorParent: {
    width,
    height: height,
    position: 'absolute',
    top: 0,
  },
  sliderLabel: {
    color: 'gray',
  },
  sliderLabelContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
