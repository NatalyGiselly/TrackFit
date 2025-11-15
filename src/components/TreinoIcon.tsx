import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface TreinoIconProps {
  size?: number;
  color?: string;
}

export const TreinoIcon: React.FC<TreinoIconProps> = ({
  size = 20,
  color = '#000000',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.5 13C20.2735 12.496 18 10.5 14 13.5C12.9485 12.912 11 11.5 8 14C7.6495 12.572 7.5795 9.322 8 6.5C8.175 6.08 8.897 5.7825 11 8L13.5 5.5C13.325 4.408 12 3 8 3C6.5 3 5.131 4.2825 4.5 6.5C3.7115 8.7675 2.5 14 2.5 17C2.5 17.924 3.75 20 8.5 20C9.5 20 12.425 20.1125 16 18.5L19 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
