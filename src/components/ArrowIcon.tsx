import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface ArrowIconProps {
  size?: number;
  color?: string;
}

export const ArrowIcon: React.FC<ArrowIconProps> = ({
  size = 13,
  color = '#000000',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 8 13" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.071 7.071L1.414 12.728L0 11.314L4.95 6.364L0 1.414L1.414 0L7.071 5.657C7.25847 5.84453 7.36379 6.09884 7.36379 6.364C7.36379 6.62916 7.25847 6.88347 7.071 7.071Z"
        fill={color}
      />
    </Svg>
  );
};
