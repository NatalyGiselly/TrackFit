import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface MuscleSearchIconProps {
  size?: number;
  color?: string;
}

export const MuscleSearchIcon: React.FC<MuscleSearchIconProps> = ({
  size = 24,
  color = '#000000',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Músculo */}
      <Path
        d="M16 7H18V17H16V12.5H8V17H6V7H8V11.5H16V7ZM3 11.5V8.5H5V15.5H3V12.5H2V11.5H3ZM22 12.5H21V15.5H19V8.5H21V11.5H22V12.5Z"
        fill={color}
      />
      {/* Lupa */}
      <Path
        d="M20.71 19.29L17.31 15.89C18.07 14.92 18.5 13.71 18.5 12.4C18.5 9.42 16.08 7 13.1 7C10.12 7 7.7 9.42 7.7 12.4C7.7 15.38 10.12 17.8 13.1 17.8C14.41 17.8 15.62 17.37 16.59 16.61L19.99 20.01C20.14 20.16 20.33 20.23 20.52 20.23C20.71 20.23 20.9 20.16 21.05 20.01C21.34 19.72 21.34 19.24 21.05 18.95L20.71 19.29ZM13.1 16.3C11.02 16.3 9.3 14.58 9.3 12.5C9.3 10.42 11.02 8.7 13.1 8.7C15.18 8.7 16.9 10.42 16.9 12.5C16.9 14.58 15.18 16.3 13.1 16.3Z"
        fill={color}
      />
    </Svg>
  );
};
