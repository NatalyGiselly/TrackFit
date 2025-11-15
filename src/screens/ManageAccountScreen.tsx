import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';
import {useAuth} from '../hooks/use-auth';
import {BackIcon} from '../components/BackIcon';

type ManageAccountScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ManageAccount'
>;

export const ManageAccountScreen: React.FC = () => {
  const navigation = useNavigation<ManageAccountScreenNavigationProp>();
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

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const handleSave = () => {
    // TODO: Implement save functionality
    Alert.alert('Em desenvolvimento', 'Funcionalidade de salvar em breve!');
  };

  const handlePhotoUpload = () => {
    // TODO: Implement photo upload
    Alert.alert('Em desenvolvimento', 'Upload de foto em breve!');
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
        <Text style={[styles.headerTitle, {color: textColor}]}>
          Gerenciar Conta
        </Text>
        <View style={styles.backButton} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Profile Photo Section */}
        <View style={[styles.section, {backgroundColor: sectionBg}]}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>
            Foto de Perfil
          </Text>
          <TouchableOpacity
            style={[styles.photoPlaceholder, {borderColor}]}
            onPress={handlePhotoUpload}
            activeOpacity={0.7}>
            <Text style={[styles.photoText, {color: subtitleColor}]}>
              Adicionar Foto
            </Text>
          </TouchableOpacity>
        </View>

        {/* Personal Info Section */}
        <View style={[styles.section, {backgroundColor: sectionBg}]}>
          <Text style={[styles.sectionTitle, {color: textColor}]}>
            Informações Pessoais
          </Text>

          <Text style={[styles.label, {color: subtitleColor}]}>
            Nome Completo
          </Text>
          <TextInput
            style={[
              styles.input,
              {backgroundColor: inputBg, color: textColor, borderColor},
            ]}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Digite seu nome completo"
            placeholderTextColor={subtitleColor}
          />

          <Text style={[styles.label, {color: subtitleColor}]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {backgroundColor: inputBg, color: textColor, borderColor},
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            placeholderTextColor={subtitleColor}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Section */}
        <View style={[styles.section, {backgroundColor: sectionBg}]}>
          <TouchableOpacity
            onPress={() => setShowPasswordSection(!showPasswordSection)}
            style={styles.sectionHeader}
            activeOpacity={0.7}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>
              Alterar Senha
            </Text>
            <Text style={[styles.toggleIcon, {color: textColor}]}>
              {showPasswordSection ? '−' : '+'}
            </Text>
          </TouchableOpacity>

          {showPasswordSection && (
            <View style={styles.passwordFields}>
              <Text style={[styles.label, {color: subtitleColor}]}>
                Senha Atual
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {backgroundColor: inputBg, color: textColor, borderColor},
                ]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Digite sua senha atual"
                placeholderTextColor={subtitleColor}
                secureTextEntry
              />

              <Text style={[styles.label, {color: subtitleColor}]}>
                Nova Senha
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {backgroundColor: inputBg, color: textColor, borderColor},
                ]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Digite sua nova senha"
                placeholderTextColor={subtitleColor}
                secureTextEntry
              />

              <Text style={[styles.label, {color: subtitleColor}]}>
                Confirmar Nova Senha
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {backgroundColor: inputBg, color: textColor, borderColor},
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirme sua nova senha"
                placeholderTextColor={subtitleColor}
                secureTextEntry
              />
            </View>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  toggleIcon: {
    fontSize: 24,
    fontWeight: '300',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  photoText: {
    fontSize: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  passwordFields: {
    marginTop: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#52A0D8',
    marginTop: 8,
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
