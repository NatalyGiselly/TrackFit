import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {BackIcon} from '../components/BackIcon';

type LegalScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Legal'
>;

export const LegalScreen: React.FC = () => {
  const navigation = useNavigation<LegalScreenNavigationProp>();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const isDark = theme === 'dark';

  const backgroundColor = isDark ? '#000' : '#f8f9fa';
  const textColor = isDark ? '#fff' : '#1a1a1a';
  const sectionBg = isDark ? '#1a1a1a' : '#fff';
  const subtitleColor = isDark ? '#aaa' : '#666';

  return (
    <SafeAreaView style={[styles.container, {backgroundColor}]}>
      {/* Header */}
      <View style={[styles.header, {backgroundColor: sectionBg}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <BackIcon size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: textColor}]}>Legal</Text>
        <View style={styles.backButton} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Placeholder Section */}
        <View style={[styles.section, {backgroundColor: sectionBg}]}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>
            Termos de Uso
          </Text>
          <Text style={[styles.placeholderText, {color: subtitleColor}]}>
            Os Termos de Uso do TrackFit estarão disponíveis em breve.
          </Text>
        </View>

        <View style={[styles.section, {backgroundColor: sectionBg}]}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>
            Política de Privacidade
          </Text>
          <Text style={[styles.placeholderText, {color: subtitleColor}]}>
            A Política de Privacidade do TrackFit estará disponível em breve.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
