import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface TimelineItemData {
  label: string;
  value: string | number;
  icon: string;
}

interface ProgressTimelineProps {
  items: TimelineItemData[];
  theme: 'light' | 'dark';
}

export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  items,
  theme,
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#fff' : '#1a1a1a';
  const labelColor = isDark ? '#aaa' : '#666';
  const lineColor = isDark ? '#333' : '#e0e0e0';
  const dotColor = isDark ? '#52BE29' : '#007AFF';

  return (
    <View style={styles.container}>
      {/* Content Row (Values, Labels) */}
      <View style={styles.contentRow}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={[styles.value, {color: textColor}]}>{item.value}</Text>
            <Text style={[styles.label, {color: labelColor}]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    minHeight: 40,
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    marginBottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  timelineItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    height: 2,
    flex: 1,
  },
});
