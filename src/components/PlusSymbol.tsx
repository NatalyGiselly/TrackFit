import React, {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import Svg, {Path} from 'react-native-svg';

interface PlusSymbolProps {
  size?: number;
  color?: string;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export const PlusSymbol: React.FC<PlusSymbolProps> = ({
  size = 40,
  color = '#4CAF50',
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create smooth continuous rotation animation (spinner style)
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000, // 1 second per rotation - classic spinner speed
        easing: Easing.linear, // Linear for smooth constant rotation
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  // Interpolate rotation value (0 to 360 degrees)
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Create the plus symbol path with thicker lines for spinner effect
  const strokeWidth = size * 0.18; // 18% of size - thicker for better visibility
  const lineLength = size * 0.65; // 65% of size - slightly longer
  const center = size / 2;

  return (
    <AnimatedSvg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{transform: [{rotate: spin}]}}>
      {/* Vertical line */}
      <Path
        d={`M ${center} ${center - lineLength / 2} L ${center} ${
          center + lineLength / 2
        }`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Horizontal line */}
      <Path
        d={`M ${center - lineLength / 2} ${center} L ${
          center + lineLength / 2
        } ${center}`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </AnimatedSvg>
  );
};
