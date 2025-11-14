import React, {useEffect, useRef} from 'react';
import {Animated, Easing, View, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import LogoStatic from '../../assets/images/logo-static.svg';

interface AnimatedLogoProps {
  width?: number;
  height?: number;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  width = 220,
  height = 118,
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create smooth continuous rotation animation (spinner style)
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000, // 1 second per rotation - classic spinner speed
        easing: Easing.linear, // Linear for smooth constant rotation
        useNativeDriver: true, // Native driver for smooth 60fps animation
      }),
    ).start();
  }, [rotateAnim]);

  // Interpolate rotation value (0 to 360 degrees)
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Calculate the position of the "+" symbol in the logo
  // The "+" center is at approximately x=408.5, y=151 in viewBox 0 0 439 235
  const scaleX = width / 439;
  const scaleY = height / 235;

  // Position where the center of the "+" should be
  const plusCenterX = 408.5 * scaleX;
  const plusCenterY = 151 * scaleY;

  // Size of the "+" (approximate bounding box)
  const plusSize = 60 * Math.min(scaleX, scaleY);

  return (
    <View style={styles.container}>
      {/* Static logo without the green plus */}
      <View style={StyleSheet.absoluteFill}>
        <LogoStatic width={width} height={height} />
      </View>

      {/* Animated green plus - small container that rotates around its own center */}
      <Animated.View
        style={{
          position: 'absolute',
          left: plusCenterX - plusSize / 2,
          top: plusCenterY - plusSize / 2,
          width: plusSize,
          height: plusSize,
          transform: [{rotate: spin}],
        }}>
        <Svg
          width={plusSize}
          height={plusSize}
          viewBox="379 120 59 62"
          preserveAspectRatio="xMidYMid meet">
          <Path
            d="M404.068,120.942C412.751,120.848 412.984,120.279 413.895,121.355C415.047,122.715 412.99,143.65 415.278,144.799C417.592,145.961 438.132,142.818 438.288,147.111C438.453,151.66 439.171,157.246 436.159,157.305C415.754,157.702 414.18,156.435 414.109,159.132C413.576,179.427 414.489,179.417 414.199,181.154C413.885,183.036 405.436,182.274 404.115,182.227C402.439,180.799 403.475,180.323 403.003,160.132L402.942,157.27C397.569,154.68 383.001,158.461 379.789,155.284C379.825,152.174 379.861,149.064 379.897,145.954C380.297,145.591 380.698,145.227 381.098,144.864C382.699,144.877 400.992,145.02 401.116,144.971C403.374,144.084 402.819,143.54 402.982,141.141C403.239,136.094 403.123,136.167 402.963,131.119L402.983,130.136C403.284,125.114 403.216,123.701 403.19,123.142C403.126,121.81 403.136,121.804 404.067,120.941L404.068,120.942Z"
            fill="rgb(82,190,41)"
            fillOpacity={0.98}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 220,
    height: 118,
  },
});
