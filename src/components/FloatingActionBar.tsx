import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface FloatingActionBarProps {
  onSave: () => void;
  onStart: () => void;
  theme: 'light' | 'dark';
  visible: boolean;
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  onSave,
  onStart,
  theme,
  visible,
}) => {
  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#1a1a1a' : '#fff';

  // Cor exata: RGB(82, 160, 216) = #52A0D8
  const babyBlue = '#52A0D8';
  const babyBlueText = '#52A0D8';

  console.log('🎨 FloatingActionBar - visible:', visible);

  if (!visible) {
    console.log('❌ FloatingActionBar - hidden (no exercises selected)');
    return null;
  }

  console.log('✅ FloatingActionBar - showing buttons');

  return (
    <View
      style={[
        styles.container,
        {backgroundColor, paddingBottom: insets.bottom + 16},
      ]}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.saveButton,
            {borderColor: babyBlue},
          ]}
          onPress={onSave}
          activeOpacity={0.7}>
          <Text style={[styles.saveButtonText, {color: babyBlueText}]}>
            Salvar treino
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.startButton,
            {backgroundColor: babyBlue},
          ]}
          onPress={onStart}
          activeOpacity={0.7}>
          <Text style={styles.startButtonText}>Começar treino</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  startButton: {},
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
