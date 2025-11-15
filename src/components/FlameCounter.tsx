import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { G, Rect, Path, Circle, Defs, RadialGradient, Stop, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from 'react-native-svg';

interface FlameCounterProps {
  count: number;
  theme: 'light' | 'dark';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ICON_SIZE = Math.min(SCREEN_WIDTH * 0.06, 24);

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const FogueiraIcon = ({ dias, size = ICON_SIZE, startAnimation }: { dias: number; size?: number; startAnimation: boolean }) => {
  const isOff = dias === 0;
  const gradientId0 = `paint0_radial_${isOff ? 'off' : 'active'}`;
  const gradientId1 = `paint1_radial_${isOff ? 'off' : 'active'}`;

  const flickerAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isOff && startAnimation) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(flickerAnim, {
            toValue: 0.7,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 0.7,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 0.7,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 0.7,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 0.7,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(flickerAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isOff, startAnimation, flickerAnim, scaleAnim]);

  return (
    <AnimatedSvg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{
        opacity: flickerAnim,
        transform: [{ scale: scaleAnim }],
      }}>
      <Defs>
        <RadialGradient id={gradientId0} cx="0" cy="0" r="1" gradientTransform="matrix(-8.82338 -0.0382934 -0.0629107 14.4774 7.77697 15.5376)" gradientUnits="userSpaceOnUse">
          <Stop offset="0.314" stopColor={isOff ? '#4A4A4A' : '#FF9800'}/>
          <Stop offset="0.662" stopColor={isOff ? '#4A4A4A' : '#FF6D00'}/>
          <Stop offset="0.972" stopColor={isOff ? '#808080' : '#F44336'}/>
        </RadialGradient>
        <RadialGradient id={gradientId1} cx="0" cy="0" r="1" gradientTransform="matrix(-0.0932482 9.23158 6.94746 0.070167 8.2725 6.7573)" gradientUnits="userSpaceOnUse">
          <Stop offset="0.214" stopColor={isOff ? '#B0B0B0' : '#FFF176'}/>
          <Stop offset="0.328" stopColor={isOff ? '#B0B0B0' : '#FFF27D'}/>
          <Stop offset="0.487" stopColor={isOff ? '#B0B0B0' : '#FFF48F'}/>
          <Stop offset="0.672" stopColor={isOff ? '#B0B0B0' : '#FFF7AD'}/>
          <Stop offset="0.793" stopColor={isOff ? '#B0B0B0' : '#FFF9C4'}/>
          <Stop offset="0.822" stopColor={isOff ? '#B0B0B0' : '#FFF8BD'} stopOpacity={isOff ? 1 : 0.804}/>
          <Stop offset="0.863" stopColor={isOff ? '#B0B0B0' : '#FFF6AB'} stopOpacity={isOff ? 1 : 0.529}/>
          <Stop offset="0.91" stopColor={isOff ? '#B0B0B0' : '#FFF38D'} stopOpacity={isOff ? 1 : 0.209}/>
          <Stop offset="0.941" stopColor={isOff ? '#B0B0B0' : '#FFF176'} stopOpacity="0"/>
        </RadialGradient>
      </Defs>
      <Path d="M4.445 5.09125C4.37375 5.85125 4.32375 7.19625 4.7725 7.76875C4.7725 7.76875 4.56125 6.29125 6.455 4.4375C7.2175 3.69125 7.39375 2.67625 7.1275 1.915C6.97625 1.48375 6.7 1.1275 6.46 0.878751C6.32 0.732501 6.4275 0.491251 6.63125 0.500001C7.86375 0.555001 9.86125 0.897501 10.71 3.0275C11.0825 3.9625 11.11 4.92875 10.9325 5.91125C10.82 6.53875 10.42 7.93375 11.3325 8.105C11.9838 8.2275 12.2987 7.71 12.44 7.3375C12.4987 7.1825 12.7025 7.14375 12.8125 7.2675C13.9125 8.51875 14.0063 9.9925 13.7788 11.2613C13.3388 13.7138 10.855 15.4988 8.3875 15.4988C5.305 15.4988 2.85125 13.735 2.215 10.5425C1.95875 9.25375 2.08875 6.70375 4.07625 4.90375C4.22375 4.76875 4.465 4.88875 4.445 5.09125Z" fill={`url(#${gradientId0})`}/>
      <Path d="M9.51375 9.6775C8.3775 8.215 8.88625 6.54625 9.165 5.88125C9.2025 5.79375 9.1025 5.71125 9.02375 5.765C8.535 6.0975 7.53375 6.88 7.0675 7.98125C6.43625 9.47 6.48125 10.1987 6.855 11.0887C7.08 11.625 6.81875 11.7387 6.6875 11.7587C6.56 11.7787 6.4425 11.6937 6.34875 11.605C6.0791 11.346 5.88692 11.0171 5.79375 10.655C5.77375 10.5775 5.6725 10.5562 5.62625 10.62C5.27625 11.1037 5.095 11.88 5.08625 12.4287C5.05875 14.125 6.46 15.5 8.155 15.5C10.2913 15.5 11.8475 13.1375 10.62 11.1625C10.2638 10.5875 9.92875 10.2112 9.51375 9.6775Z" fill={`url(#${gradientId1})`}/>
    </AnimatedSvg>
  );

  // ========== CÓDIGO ANTERIOR COMENTADO ==========
  // const configs = {
  //   0: { cor: '#9CA3AF', opacity: 0.4, height: 0 },
  //   1: { cor: '#FB923C', opacity: 0.6, height: 0.3 },
  //   2: { cor: '#F97316', opacity: 0.75, height: 0.5 },
  //   3: { cor: '#EA580C', opacity: 0.85, height: 0.7 },
  //   4: { cor: '#F59E0B', opacity: 0.95, height: 0.85 },
  //   5: { cor: '#EAB308', opacity: 1, height: 1 },
  // };

  // const normalizedDias = Math.min(Math.max(dias, 0), 5);
  // const config = configs[normalizedDias as keyof typeof configs] || configs[0];
  // const isOff = normalizedDias === 0;

  // return (
  //   <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
  //     {/* Lenha/Base */}
  //     <G opacity={isOff ? 0.5 : 1}>
  //       <Rect
  //         x="6"
  //         y="18"
  //         width="5"
  //         height="2"
  //         rx="1"
  //         fill="#8B4513"
  //         transform="rotate(-10 8.5 19)"
  //       />
  //       <Rect
  //         x="13"
  //         y="18"
  //         width="5"
  //         height="2"
  //         rx="1"
  //         fill="#654321"
  //         transform="rotate(10 15.5 19)"
  //       />
  //       <Rect x="9" y="19" width="6" height="1.5" rx="0.75" fill="#A0522D" />
  //     </G>

  //     {/* Chama - só aparece se dias > 0 */}
  //     {!isOff && (
  //       <G opacity={config.opacity}>
  //         {/* Chama principal */}
  //         <Path
  //           d={`M12 ${18 - config.height * 10}
  //               C10 ${16 - config.height * 8} 9 ${14 - config.height * 6} 10 ${12 - config.height * 5}
  //               C10.5 ${10 - config.height * 4} 11 ${9 - config.height * 3} 12 ${8 - config.height * 3}
  //               C13 ${9 - config.height * 3} 13.5 ${10 - config.height * 4} 14 ${12 - config.height * 5}
  //               C15 ${14 - config.height * 6} 14 ${16 - config.height * 8} 12 ${18 - config.height * 10} Z`}
  //           fill={config.cor}
  //         />

  //         {/* Núcleo interno mais claro */}
  //         <Path
  //           d={`M12 ${16 - config.height * 6}
  //               C11 ${15 - config.height * 5} 10.5 ${13 - config.height * 4} 11 ${12 - config.height * 3}
  //               C11.5 ${11 - config.height * 2} 12 ${10 - config.height * 2} 12 ${10 - config.height * 2}
  //               C12 ${10 - config.height * 2} 12.5 ${11 - config.height * 2} 13 ${12 - config.height * 3}
  //               C13.5 ${13 - config.height * 4} 13 ${15 - config.height * 5} 12 ${16 - config.height * 6} Z`}
  //           fill="#FCD34D"
  //           opacity="0.8"
  //         />

  //         {/* Faísca - só em dias >= 4 */}
  //         {normalizedDias >= 4 && (
  //           <>
  //             <Circle
  //               cx="10"
  //               cy={7 - config.height * 2}
  //               r="0.8"
  //               fill="#FDE047"
  //               opacity="0.9"
  //             />
  //             <Circle
  //               cx="14"
  //               cy={6 - config.height * 2}
  //               r="0.8"
  //               fill="#FDE047"
  //               opacity="0.9"
  //             />
  //           </>
  //         )}

  //         {/* Chamas laterais - a partir do dia 3 */}
  //         {normalizedDias >= 3 && (
  //           <>
  //             <Path
  //               d={`M9 ${17 - config.height * 6}
  //                   C8 ${16 - config.height * 5} 7.5 ${15 - config.height * 4} 8 ${14 - config.height * 3}
  //                   C8.5 ${13 - config.height * 2} 9 ${13 - config.height * 2} 9 ${17 - config.height * 6} Z`}
  //               fill={config.cor}
  //               opacity="0.7"
  //             />
  //             <Path
  //               d={`M15 ${17 - config.height * 6}
  //                   C16 ${16 - config.height * 5} 16.5 ${15 - config.height * 4} 16 ${14 - config.height * 3}
  //                   C15.5 ${13 - config.height * 2} 15 ${13 - config.height * 2} 15 ${17 - config.height * 6} Z`}
  //               fill={config.cor}
  //               opacity="0.7"
  //             />
  //           </>
  //         )}
  //       </G>
  //     )}

  //     {/* Fumaça quando apagado */}
  //     {isOff && (
  //       <G opacity="0.3">
  //         <Circle cx="11" cy="15" r="1.5" fill="#9CA3AF" />
  //         <Circle cx="13" cy="13" r="1.2" fill="#9CA3AF" />
  //         <Circle cx="12" cy="11" r="1" fill="#9CA3AF" />
  //       </G>
  //     )}
  //   </Svg>
  // );
};

export const FlameCounter: React.FC<FlameCounterProps> = ({ count, theme }) => {
  const textColor = theme === 'dark' ? '#fff' : '#1a1a1a';
  const fontSize = Math.min(SCREEN_WIDTH * 0.04, 16);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimationStarted(true);
    });
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={[styles.count, { color: textColor, fontSize }]}>
        {count} {count === 1 ? 'dia ativo' : 'dias ativos'}
      </Text>
      <View style={[styles.flameWrapper, { width: ICON_SIZE, height: ICON_SIZE }]}>
        <FogueiraIcon dias={count} size={ICON_SIZE} startAnimation={animationStarted} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flameWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontWeight: '600',
  },
});
