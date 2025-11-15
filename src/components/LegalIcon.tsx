import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface LegalIconProps {
  size?: number;
  color?: string;
}

export const LegalIcon: React.FC<LegalIconProps> = ({
  size = 24,
  color = '#52A0D8',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 3 16" fill="none">
      <Path
        d="M1.25 15.25V5.25H0.75M0.75 15.25H1.75M1.25 1.25V0.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
