/**
 * TrackFit App
 * Sistema de autenticação e gerenciamento fitness
 *
 * @format
 */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/context/AuthContext';
import {LoadingProvider} from './src/context/LoadingContext';
import {AppNavigator} from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#FFFFFF"
      />
      <LoadingProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </LoadingProvider>
    </SafeAreaProvider>
  );
}

export default App;
