import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {useAuth} from '../hooks/use-auth';
import {BackIcon} from '../components/BackIcon';
import {DeleteIcon} from '../components/DeleteIcon';
import {SettingsIcon} from '../components/SettingsIcon';
import {LegalIcon} from '../components/LegalIcon';
import {HelpIcon} from '../components/HelpIcon';
import {AccountIcon} from '../components/AccountIcon';

type AccountScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Account'
>;

export const AccountScreen: React.FC = () => {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const {user} = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';
  const isDark = theme === 'dark';

  const backgroundColor = isDark ? '#000' : '#f8f9fa';
  const textColor = isDark ? '#fff' : '#1a1a1a';
  const sectionBg = isDark ? '#1a1a1a' : '#fff';
  const subtitleColor = isDark ? '#aaa' : '#666';
  const inputBg = isDark ? '#2a2a2a' : '#f5f5f5';
  const borderColor = isDark ? '#333' : '#e0e0e0';

  // Help and Report states
  const [showHelpOptions, setShowHelpOptions] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [problemDescription, setProblemDescription] = useState('');

  const handleDeleteAccount = () => {
    Alert.alert(
      'Deletar Conta',
      'Esta ação é permanente. Tem certeza que deseja deletar sua conta?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert('Em desenvolvimento', 'Funcionalidade em breve!');
          },
        },
      ],
    );
  };

  const handleSubmitProblem = () => {
    if (!problemDescription.trim()) {
      Alert.alert('Atenção', 'Por favor, descreva o problema.');
      return;
    }

    // TODO: Implement problem submission (send to backend, email, etc.)
    Alert.alert(
      'Obrigado!',
      'Seu problema foi reportado. Entraremos em contato em breve.',
      [
        {
          text: 'OK',
          onPress: () => {
            setProblemDescription('');
            setShowReportForm(false);
            setShowHelpOptions(false);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor}]}>
      {/* Header */}
      <View style={[styles.header, {backgroundColor: sectionBg}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <BackIcon size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: textColor}]}>Conta</Text>
        <View style={styles.backButton} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* User Info Section */}
        <View style={[styles.section, {backgroundColor: sectionBg}]}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>
            Informações da Conta
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, {color: subtitleColor}]}>
              Email
            </Text>
            <Text style={[styles.infoValue, {color: textColor}]}>
              {user?.email || 'Não disponível'}
            </Text>
          </View>
        </View>

        {/* Settings Button */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}>
          <SettingsIcon size={20} color="#52A0D8" />
          <Text style={styles.settingsButtonText}>
            Configurações
          </Text>
        </TouchableOpacity>

        {/* Legal Button */}
        <TouchableOpacity
          style={styles.legalButton}
          onPress={() => navigation.navigate('Legal')}
          activeOpacity={0.7}>
          <LegalIcon size={20} color="#52A0D8" />
          <Text style={styles.legalButtonText}>Legal</Text>
        </TouchableOpacity>

        {/* Manage Account Button */}
        <TouchableOpacity
          style={styles.manageAccountButton}
          onPress={() => navigation.navigate('ManageAccount')}
          activeOpacity={0.7}>
          <AccountIcon size={20} color="#52A0D8" />
          <Text style={styles.manageAccountButtonText}>Gerenciar conta</Text>
        </TouchableOpacity>

        {/* Help Button */}
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowHelpOptions(!showHelpOptions)}
          activeOpacity={0.7}>
          <HelpIcon size={20} color="#52A0D8" />
          <Text style={styles.helpButtonText}>Ajuda</Text>
        </TouchableOpacity>

        {/* Report Problem Section (conditional) */}
        {showHelpOptions && (
          <View style={styles.reportSection}>
            {/* Report Problem Button */}
            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => setShowReportForm(!showReportForm)}
              activeOpacity={0.7}>
              <Text style={styles.reportButtonText}>Reportar problema</Text>
            </TouchableOpacity>

            {/* Report Form (conditional) */}
            {showReportForm && (
              <>
                {/* Input Container with Overlay Text */}
                <View style={styles.inputContainer}>
                  {/* Problem Description Input */}
                  <TextInput
                    style={[
                      styles.problemInput,
                      {
                        backgroundColor: inputBg,
                        color: textColor,
                        borderColor: borderColor,
                      },
                    ]}
                    value={problemDescription}
                    onChangeText={setProblemDescription}
                    placeholder=""
                    placeholderTextColor={subtitleColor}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />

                  {/* Overlay Prompt Text */}
                  <Text style={[styles.problemPrompt, {color: subtitleColor}]}>
                    O que está acontecendo?
                  </Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitProblem}
                  activeOpacity={0.7}>
                  <Text style={styles.submitButtonText}>Enviar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Spacer to push delete button to bottom */}
        <View style={styles.spacer} />

        {/* Delete Account Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          activeOpacity={0.7}>
          <DeleteIcon size={20} color="#FF3B30" />
          <Text style={styles.deleteButtonText}>Deletar minha conta</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(82, 160, 216, 0.1)',
    gap: 8,
    marginBottom: 0,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52A0D8',
  },
  legalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(82, 160, 216, 0.1)',
    gap: 8,
    marginBottom: 0,
  },
  legalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52A0D8',
  },
  manageAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(82, 160, 216, 0.1)',
    gap: 8,
    marginBottom: 0,
  },
  manageAccountButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52A0D8',
  },
  spacer: {
    flex: 1,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    gap: 12,
    marginBottom: 20,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(82, 160, 216, 0.1)',
    gap: 8,
    marginBottom: 0,
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52A0D8',
  },
  reportSection: {
    marginLeft: 16,
    marginBottom: 0,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(82, 160, 216, 0.05)',
    marginBottom: 12,
  },
  reportButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#52A0D8',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  problemPrompt: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    fontSize: 14,
    textAlign: 'center',
    pointerEvents: 'none',
  },
  problemInput: {
    borderRadius: 8,
    padding: 12,
    paddingTop: 36,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 150,
  },
  submitButton: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    backgroundColor: '#52A0D8',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
