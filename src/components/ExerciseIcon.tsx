import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface ExerciseIconProps {
  size?: number;
  color?: string;
}

export const ExerciseIcon: React.FC<ExerciseIconProps> = ({
  size = 24,
  color = '#FFFFFF',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 7H18V17H16V12.5H8V17H6V7H8V11.5H16V7ZM3 11.5V8.5H5V15.5H3V12.5H2V11.5H3ZM22 12.5H21V15.5H19V8.5H21V11.5H22V12.5Z"
        fill={color}
      />
    </Svg>
  );
};
