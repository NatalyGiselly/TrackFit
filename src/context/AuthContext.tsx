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

  // Helper function to update active days streak
  function updateActiveDays(currentUser: User): User {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastAccess = currentUser.lastAccessDate?.split('T')[0];

    if (lastAccess === today) {
      // Same day, no change
      return currentUser;
    }

    const lastDate = new Date(lastAccess || today);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day - increment streak
      return {
        ...currentUser,
        activeDays: currentUser.activeDays + 1,
        lastAccessDate: new Date().toISOString(),
      };
    } else if (diffDays > 1) {
      // Streak broken - reset to 1
      return {
        ...currentUser,
        activeDays: 1,
        lastAccessDate: new Date().toISOString(),
      };
    }

    return currentUser;
  }

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
        let parsedUser: User = JSON.parse(storedUser);

        // Update active days streak
        parsedUser = updateActiveDays(parsedUser);

        // Save updated user back to storage
        await AsyncStorage.setItem('@TrackFit:user', JSON.stringify(parsedUser));

        setUser(parsedUser);
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
    username: string,
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

      // Check if username already exists
      const usernameExists = users.some((u: User) => u.username === username);
      if (usernameExists) {
        throw new Error('Este nome de usuário já está em uso');
      }

      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        name,
        username,
        email,
        password, // In production, never store plain passwords!
        createdAt: new Date(),
        activeDays: 1, // First day
        lastAccessDate: new Date().toISOString(),
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
      username: provider === 'apple' ? 'apple_user' : 'google_user',
      email: 'usuario@' + provider + '.com',
      createdAt: new Date(),
      activeDays: 1,
      lastAccessDate: new Date().toISOString(),
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
