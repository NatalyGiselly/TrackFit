import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {useAuth} from '../hooks/use-auth';
import {useFormValidation} from '../hooks/use-form-validation';
import {useLoadingStore} from '../stores/loading-store';
import Logo from '../../assets/images/logo.svg';
import {AppleLogo} from '../components/AppleLogo';
import {GoogleLogo} from '../components/GoogleLogo';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const {signIn, signInWithApple, signInWithGoogle} = useAuth();
  const {errors, validateEmail, validatePassword, clearError} = useFormValidation();

  const isSigningIn = useLoadingStore((state) => state.operationLoading.signIn || false);
  const isAppleLoading = useLoadingStore((state) => state.operationLoading.signInWithApple || false);
  const isGoogleLoading = useLoadingStore((state) => state.operationLoading.signInWithGoogle || false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isAnyLoading = isSigningIn || isAppleLoading || isGoogleLoading;

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!emailValid || !passwordValid) {
      return;
    }

    try {
      await signIn(email, password);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao fazer login');
    }
  }

  async function handleAppleLogin() {
    try {
      await signInWithApple();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao fazer login com Apple');
    }
  }

  async function handleGoogleLogin() {
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao fazer login com Google');
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <Logo
              width={180}
              height={180}
            />
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Bem-vindo!</Text>
            <Text style={styles.welcomeSubtitle}>Faça login para continuar</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="seu@email.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) clearError('email');
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isAnyLoading}
                autoComplete="email"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) clearError('password');
                }}
                secureTextEntry
                editable={!isAnyLoading}
                autoComplete="password"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => navigation.navigate('ForgotPassword')}
              disabled={isAnyLoading}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isSigningIn && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isSigningIn}>
              {isSigningIn ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Social Login Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[styles.socialButton, isAppleLoading && styles.buttonDisabled]}
              onPress={handleAppleLogin}
              disabled={isAnyLoading}>
              {isAppleLoading ? (
                <ActivityIndicator color="#1a1a1a" />
              ) : (
                <View style={styles.socialButtonContent}>
                  <AppleLogo width={18} height={22} />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialButton, isGoogleLoading && styles.buttonDisabled]}
              onPress={handleGoogleLogin}
              disabled={isAnyLoading}>
              {isGoogleLoading ? (
                <ActivityIndicator color="#1a1a1a" />
              ) : (
                <View style={styles.socialButtonContent}>
                  <GoogleLogo width={20} height={20} />
                  <Text style={styles.socialButtonText}>Google</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Create Account Section */}
          <View style={styles.createAccountContainer}>
            <Text style={styles.createAccountText}>Não tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              disabled={isAnyLoading}>
              <Text style={styles.createAccountLink}>Criar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fundo branco sólido
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 0,
    paddingBottom: 20,
    justifyContent: 'flex-start',
  },
  // Logo Styles
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  logoEmoji: {
    fontSize: 80,
  },
  logoEmojiWeight: {
    fontSize: 40,
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  appNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackText: {
    fontSize: 38,
    fontWeight: '700',
    color: '#808080', // Cinza
    letterSpacing: -1,
  },
  fitText: {
    fontSize: 38,
    fontWeight: '700',
    color: '#89CFF0', // Azul bebê
    letterSpacing: -1,
  },
  plusSymbol: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4CAF50', // Verde
    marginLeft: 4,
  },
  // Welcome Section
  welcomeContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  // Form Styles
  form: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputError: {
    borderColor: '#d32f2f',
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Social Login Section
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  socialButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  // Create Account Section
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  createAccountText: {
    fontSize: 14,
    color: '#666',
  },
  createAccountLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});
