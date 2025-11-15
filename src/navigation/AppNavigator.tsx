import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import {RootStackParamList} from '../types/navigation';
import {useAuth} from '../context/AuthContext';
import {useLoading} from '../context/LoadingContext';

// Import Screens
import {LoginScreen} from '../screens/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen';
import {ForgotPasswordScreen} from '../screens/ForgotPasswordScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {AccountScreen} from '../screens/AccountScreen';
import {WorkoutExecutionScreen} from '../screens/WorkoutExecutionScreen';
import {SplashScreen} from '../screens/SplashScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const {user, loading} = useAuth();
  const {isLoading} = useLoading();

  // Show splash screen while checking authentication status
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <>
      <NavigationContainer>
        {user ? (
          // User is authenticated - Show Home screen
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Account"
              component={AccountScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="WorkoutExecution"
              component={WorkoutExecutionScreen}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
          </Stack.Navigator>
        ) : (
          // User is NOT authenticated - Show Auth screens
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>

      {/* Global loading overlay for important transitions */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <SplashScreen />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
});
