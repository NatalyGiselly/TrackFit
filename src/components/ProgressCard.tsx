import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface ProgressCardProps {
  label: string;
  value: string | number;
  icon: string;
  theme: 'light' | 'dark';
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  label,
  value,
  icon,
  theme,
}) => {
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#2a2a2a' : '#fff';
  const textColor = isDark ? '#fff' : '#1a1a1a';
  const labelColor = isDark ? '#aaa' : '#666';

  return (
    <View style={[styles.card, {backgroundColor}]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, {color: textColor}]}>{value}</Text>
      <Text style={[styles.label, {color: labelColor}]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 28,
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
