import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthContextData } from '../types/auth';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from AsyncStorage on app start
  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    const startTime = Date.now();
    const MIN_LOADING_TIME = 1000; // 1 second minimum

    try {
      const storedUser = await AsyncStorage.getItem('@TrackFit:user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      // Ensure minimum loading time of 1 second
      const elapsedTime = Date.now() - startTime;
      const remainingTime = MIN_LOADING_TIME - elapsedTime;

      if (remainingTime > 0) {
        await new Promise<void>(resolve => setTimeout(() => resolve(), remainingTime));
      }

      setLoading(false);
    }
  }

  async function signIn(email: string, password: string): Promise<void> {
    try {
      // TODO: Replace with real API call
      // For now, simulate authentication with stored user data
      const storedUsers = await AsyncStorage.getItem('@TrackFit:users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const foundUser = users.find(
        (u: User & { password: string }) =>
          u.email === email && u.password === password,
      );

      if (!foundUser) {
        throw new Error('Email ou senha incorretos');
      }

      // Remove password from user object before storing
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = foundUser;

      await AsyncStorage.setItem(
        '@TrackFit:user',
        JSON.stringify(userWithoutPassword),
      );
      setUser(userWithoutPassword);
    } catch (error) {
      throw error;
    }
  }

  async function signUp(
    name: string,
    email: string,
    password: string,
  ): Promise<void> {
    try {
      // TODO: Replace with real API call
      // For now, store user data locally
      const storedUsers = await AsyncStorage.getItem('@TrackFit:users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if email already exists
      const emailExists = users.some((u: User) => u.email === email);
      if (emailExists) {
        throw new Error('Este email já está cadastrado');
      }

      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        name,
        email,
        password, // In production, never store plain passwords!
        createdAt: new Date(),
      };

      users.push(newUser);
      await AsyncStorage.setItem('@TrackFit:users', JSON.stringify(users));

      // Auto login after signup
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = newUser;
      await AsyncStorage.setItem(
        '@TrackFit:user',
        JSON.stringify(userWithoutPassword),
      );
      setUser(userWithoutPassword);
    } catch (error) {
      throw error;
    }
  }

  async function signOut(): Promise<void> {
    try {
      await AsyncStorage.removeItem('@TrackFit:user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  function createMockSocialUser(provider: 'apple' | 'google'): User {
    // Your implementation here
    return {
      id: '1111',
      name: provider === 'apple' ? 'Apple User' : 'Google User',
      email: 'usuario@' + provider + '.com',
      createdAt: new Date(),
    };
  }

  async function signInWithApple(): Promise<void> {
    try {
      // Simulate network delay
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

      const mockUser = createMockSocialUser('apple');
      await AsyncStorage.setItem('@TrackFit:user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      throw error;
    }
  }

  async function signInWithGoogle(): Promise<void> {
    try {
      // Simulate network delay
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));

      const mockUser = createMockSocialUser('google');
      await AsyncStorage.setItem('@TrackFit:user', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithApple,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
