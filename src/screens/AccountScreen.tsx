import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Modal,
  TextInput,
  Animated,
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
import {ReportIcon} from '../components/ReportIcon';
import {LanguageIcon} from '../components/LanguageIcon';
import {CheckmarkIcon} from '../components/CheckmarkIcon';

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
  const inputBg = isDark ? '#2a2a2a' : '#F5F5F5';
  const borderColor = isDark ? '#333' : '#e0e0e0';

  // Help and Report states
  const [showHelpOptions, setShowHelpOptions] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [problemDescription, setProblemDescription] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Settings and Language states
  const [showSettingsOptions, setShowSettingsOptions] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showSuccessMessage) {
      // Fade in animation only
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showSuccessMessage, fadeAnim]);

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

    // Show success message inline
    setShowSuccessMessage(true);
    setProblemDescription('');
  };

  const handleCloseSuccess = () => {
    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSuccessMessage(false);
      setShowReportForm(false);
      setShowHelpOptions(false);
    });
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
          onPress={() => setShowSettingsOptions(!showSettingsOptions)}
          activeOpacity={0.7}>
          <SettingsIcon size={20} color="#52A0D8" />
          <Text style={styles.settingsButtonText}>
            Configurações
          </Text>
        </TouchableOpacity>

        {/* Settings Options Section (conditional) */}
        {showSettingsOptions && (
          <View style={styles.settingsSection}>
            {/* Change Language Button */}
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setShowLanguageModal(true)}
              activeOpacity={0.7}>
              <LanguageIcon size={20} color="#52A0D8" />
              <Text style={styles.languageButtonText}>Mudar idioma</Text>
            </TouchableOpacity>
          </View>
        )}

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
              <ReportIcon size={20} color="#52A0D8" />
              <Text style={styles.reportButtonText}>Reportar problema</Text>
            </TouchableOpacity>

            {/* Report Form or Success Message (conditional) */}
            {showReportForm && !showSuccessMessage && (
              <>
                {/* Problem Header */}
                <View
                  style={[
                    styles.problemHeader,
                    {backgroundColor: '#F5F5F5'},
                  ]}>
                  <Text style={[styles.problemPrompt, {color: '#52A0D8'}]}>
                    O que está acontecendo?
                  </Text>
                </View>

                {/* Problem Description Input */}
                <TextInput
                  style={[
                    styles.problemInput,
                    {
                      backgroundColor: inputBg,
                      color: textColor,
                      borderColor: '#52A0D8',
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

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitProblem}
                  activeOpacity={0.7}>
                  <Text style={styles.submitButtonText}>Enviar</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Success Message (inline) */}
            {showSuccessMessage && (
              <Animated.View
                style={[
                  styles.successBoxInline,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        scale: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.95, 1],
                        }),
                      },
                    ],
                  },
                ]}>
                <Text style={styles.successTitle}>Mensagem Enviada!</Text>
                <Text style={styles.successText}>
                  Sua mensagem foi enviada para nossa equipe e será analisada,
                  obrigada por ajudar a melhorar nosso aplicativo!
                </Text>

                {/* Complete Button */}
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={handleCloseSuccess}
                  activeOpacity={0.7}>
                  <CheckmarkIcon size={18} color="#fff" />
                  <Text style={styles.completeButtonText}>Concluído</Text>
                </TouchableOpacity>
              </Animated.View>
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

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {backgroundColor: sectionBg}]}>
            <Text style={[styles.modalTitle, {color: textColor}]}>
              Selecione o idioma
            </Text>

            {/* Language Options */}
            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => {
                // TODO: Implement language change logic
                Alert.alert('Idioma', 'Português (BR) selecionado');
                setShowLanguageModal(false);
              }}
              activeOpacity={0.7}>
              <Text style={[styles.languageOptionText, {color: textColor}]}>
                Português (BR)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => {
                Alert.alert('Language', 'English selected');
                setShowLanguageModal(false);
              }}
              activeOpacity={0.7}>
              <Text style={[styles.languageOptionText, {color: textColor}]}>
                English (EN)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => {
                Alert.alert('Idioma', 'Español seleccionado');
                setShowLanguageModal(false);
              }}
              activeOpacity={0.7}>
              <Text style={[styles.languageOptionText, {color: textColor}]}>
                Español (ES)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.languageOption}
              onPress={() => {
                Alert.alert('Langue', 'Français sélectionné');
                setShowLanguageModal(false);
              }}
              activeOpacity={0.7}>
              <Text style={[styles.languageOptionText, {color: textColor}]}>
                Français (FR)
              </Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLanguageModal(false)}
              activeOpacity={0.7}>
              <Text style={styles.modalCloseButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 32,
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
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    gap: 4,
    marginBottom: 0,
    marginHorizontal: -20,
    borderWidth: 1,
    borderColor: '#52A0D8',
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52A0D8',
  },
  legalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    gap: 4,
    marginBottom: 0,
    marginHorizontal: -20,
    borderWidth: 1,
    borderColor: '#52A0D8',
  },
  legalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52A0D8',
  },
  manageAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    gap: 4,
    marginBottom: 0,
    marginHorizontal: -20,
    borderWidth: 1,
    borderColor: '#52A0D8',
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
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    gap: 4,
    marginBottom: 0,
    marginHorizontal: -20,
    borderWidth: 1,
    borderColor: '#52A0D8',
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52A0D8',
  },
  reportSection: {
    marginBottom: 0,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    gap: 4,
    marginBottom: 12,
    marginHorizontal: -20,
    borderWidth: 1,
    borderColor: '#52A0D8',
  },
  reportButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#52A0D8',
  },
  problemHeader: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#52A0D8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  problemPrompt: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  problemInput: {
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 150,
    marginBottom: 12,
  },
  submitButton: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 4,
    backgroundColor: '#52A0D8',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  settingsSection: {
    marginBottom: 0,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    gap: 4,
    marginBottom: 0,
    marginHorizontal: -20,
    borderWidth: 1,
    borderColor: '#52A0D8',
  },
  languageButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#52A0D8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '60%',
    borderRadius: 12,
    padding: 16,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(82, 160, 216, 0.1)',
    marginBottom: 8,
  },
  languageOptionText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalCloseButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#52A0D8',
    marginTop: 8,
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  successBoxInline: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 0,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#52A0D8',
    shadowColor: '#52A0D8',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#52A0D8',
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#52A0D8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
