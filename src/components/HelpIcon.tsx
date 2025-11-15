import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface HelpIconProps {
  size?: number;
  color?: string;
}

export const HelpIcon: React.FC<HelpIconProps> = ({
  size = 24,
  color = '#52A0D8',
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6.66667 12.6666H8.66667V14.6666H6.66667V12.6666ZM8 1.33325C11.5667 1.47992 13.12 5.07992 11 7.77992C10.4467 8.44658 9.55333 8.88658 9.11333 9.44658C8.66667 9.99992 8.66667 10.6666 8.66667 11.3333H6.66667C6.66667 10.2199 6.66667 9.27992 7.11333 8.61325C7.55333 7.94658 8.44667 7.55325 9 7.11325C10.6133 5.61992 10.2133 3.50659 8 3.33325C7.46957 3.33325 6.96086 3.54397 6.58579 3.91904C6.21071 4.29411 6 4.80282 6 5.33325H4C4 4.27239 4.42143 3.25497 5.17157 2.50482C5.92172 1.75468 6.93913 1.33325 8 1.33325Z"
        fill={color}
      />
    </Svg>
  );
};
