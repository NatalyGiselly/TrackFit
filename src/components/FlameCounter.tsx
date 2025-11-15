import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Easing} from 'react-native';

interface FlameCounterProps {
  count: number;
  theme: 'light' | 'dark';
}

export const FlameCounter: React.FC<FlameCounterProps> = ({count, theme}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(count > 0 ? 1 : 0.2)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const previousCount = useRef(count);

  useEffect(() => {
    const countIncreased = count > previousCount.current;
    previousCount.current = count;

    if (count > 0) {
      if (countIncreased) {
        // Simple fade in animation when count increases
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Just ensure it's lit (for initial render) - fade in
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else {
      // Flame is off/dim - fade out
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [count]);

  const textColor = theme === 'dark' ? '#fff' : '#1a1a1a';
  const glowColor = count > 0 ? '#FF6B35' : '#888';

  return (
    <View style={styles.container}>
      <Text style={[styles.count, {color: textColor}]}>{count} dias ativos</Text>
      <View style={styles.flameWrapper}>
        {/* Glow effect behind flame */}
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowAnim,
              transform: [{scale: Animated.add(scaleAnim, 0.3)}],
              backgroundColor: glowColor,
            },
          ]}
        />

        {/* Flame emoji */}
        <Animated.View
          style={[
            styles.flameContainer,
            {
              transform: [{scale: scaleAnim}],
              opacity: opacityAnim,
            },
          ]}>
          {count === 0 ? (
            <View style={styles.deadFlameContainer}>
              <View style={styles.deadFlameTop} />
              <View style={styles.deadFlameBottom} />
            </View>
          ) : (
            <Text style={styles.flame}>🔥</Text>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flameWrapper: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  flameContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flame: {
    fontSize: 18,
    lineHeight: 18,
  },
  deadFlameContainer: {
    width: 18,
    height: 20,
    alignItems: 'center',
  },
  deadFlameTop: {
    width: 9,
    height: 11,
    borderRadius: 9,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: '#888',
  },
  deadFlameBottom: {
    width: 14,
    height: 9,
    borderRadius: 7,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: '#888',
    marginTop: -2,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
});
